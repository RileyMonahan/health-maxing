import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Icon, ModalHeader, ProgressBar, Screen } from '@/components/ui';
import { getExercise } from '@/content/exercises';
import { getWorkout } from '@/content/trainingPlans';
import { formatSet } from '@/domain/strength';
import { setsLabel } from '@/features/workout/kindIcon';
import { columnsFor, SetHeader, SetRow } from '@/features/workout/SetRow';
import { useWorkoutStore } from '@/store';
import { lastPerformance } from '@/store/workouts';
import { colors, spacing } from '@/theme';
import { confirm, notify } from '@/utils/confirm';

/** Live workout logger. Every change is saved to the active session immediately. */
export default function WorkoutSession() {
  const active = useWorkoutStore((s) => s.active);
  const sessions = useWorkoutStore((s) => s.sessions);
  const actions = useWorkoutStore.getState();
  const elapsed = useElapsed(active?.startedAt);

  if (!active) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ModalHeader close />
        <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>No workout in progress.</Text>
      </Screen>
    );
  }

  const template = getWorkout(active.templateId);
  const totalSets = active.exercises.reduce((n, e) => n + e.sets.length, 0);
  const doneSets = active.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);

  const finish = async () => {
    if (doneSets === 0) {
      notify('No sets logged yet', 'Tick off at least one set before finishing.');
      return;
    }
    if (doneSets < totalSets && !(await confirm('Finish workout?', `You've completed ${doneSets} of ${totalSets} sets.`, 'Finish'))) return;
    useWorkoutStore.getState().finish();
    router.back();
  };

  const discard = async () => {
    if (await confirm('Discard workout?', 'Your logged sets for this session will be deleted.', 'Discard', true)) {
      useWorkoutStore.getState().discard();
      router.back();
    }
  };

  return (
    <Screen edges={['top', 'bottom']} footer={<Button title="Finish Workout" icon="flag-checkered" onPress={finish} />}>
      <ModalHeader
        title={template?.name ?? 'Workout'}
        right={
          <Pressable onPress={discard} hitSlop={8} accessibilityRole="button">
            <Text style={styles.discard}>Discard</Text>
          </Pressable>
        }
      />
      <Card tint style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View style={styles.timer}>
            <Icon name="timer-outline" size={20} color={colors.primary} />
            <Text style={styles.timerText}>{elapsed}</Text>
          </View>
          <Text style={styles.progressText}>
            {doneSets} / {totalSets} sets
          </Text>
        </View>
        <ProgressBar value={totalSets ? doneSets / totalSets : 0} />
      </Card>

      {active.exercises.map((le, exIndex) => {
        const ex = getExercise(le.exerciseId);
        const planned = template?.exercises.find((p) => p.exerciseId === le.exerciseId);
        const reps = planned?.reps ?? '';
        const cols = columnsFor(ex.kind, reps, planned?.trackRir ?? false);
        const last = lastPerformance(sessions, le.exerciseId);
        return (
          <Card key={le.exerciseId} style={styles.exCard}>
            <View style={styles.exHead}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exMeta}>
                  Target {setsLabel(planned?.sets ?? le.sets.length, reps)}
                  {last?.best ? `  ·  Last ${formatSet(last.best)}` : ''}
                </Text>
              </View>
              <Pressable
                onPress={() => actions.toggleExercise(exIndex)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: le.completed }}
                accessibilityLabel={`Mark ${ex.name} complete`}
                style={[styles.exCheck, le.completed && styles.exCheckOn]}
              >
                <Icon name={le.completed ? 'check-all' : 'check'} size={20} color={le.completed ? '#fff' : colors.textSecondary} />
              </Pressable>
            </View>
            <SetHeader cols={cols} />
            {le.sets.map((set, i) => (
              <SetRow
                key={i}
                index={i}
                set={set}
                cols={cols}
                target={reps}
                onChange={(patch) => actions.updateSet(exIndex, i, patch)}
                onRemove={() => actions.removeSet(exIndex, i)}
              />
            ))}
            <Pressable onPress={() => actions.addSet(exIndex)} style={styles.addSet} accessibilityRole="button">
              <Icon name="plus" size={18} color={colors.primary} />
              <Text style={styles.addSetText}>Add set</Text>
            </Pressable>
          </Card>
        );
      })}
      <Text style={styles.tip}>RIR = reps in reserve, how many more reps you could have done. Long press a set number to remove it.</Text>
    </Screen>
  );
}

function useElapsed(startedAt?: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!startedAt) return '0:00';
  const secs = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  discard: { color: colors.danger, fontWeight: '600', fontSize: 15 },
  progressCard: { gap: spacing.md, padding: spacing.lg },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 20, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  progressText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  exCard: { gap: spacing.sm, padding: spacing.lg },
  exHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: 4 },
  exName: { fontSize: 18, fontWeight: '700', color: colors.text },
  exMeta: { fontSize: 13, color: colors.textSecondary },
  exCheck: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.track, alignItems: 'center', justifyContent: 'center' },
  exCheckOn: { backgroundColor: colors.success },
  addSet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  addSetText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  tip: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
