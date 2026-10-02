import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Icon, IconBadge, ListRow, ModalHeader, PageTitle, Screen, SectionHeader } from '@/components/ui';
import { getExercise } from '@/content/exercises';
import { getWorkout, TRAINING_PLANS } from '@/content/trainingPlans';
import { formatMonthDay, WEEKDAY_LONG, weekDates, weekdayOf } from '@/domain/dates';
import { completedDates } from '@/domain/scoring';
import { formatSet } from '@/domain/strength';
import { KIND_ICON, setsLabel } from '@/features/workout/kindIcon';
import { WeekStrip } from '@/features/workout/WeekStrip';
import { useToday } from '@/hooks/useToday';
import { usePlanStore, useWorkoutStore } from '@/store';
import { lastPerformance } from '@/store/workouts';
import { colors, spacing } from '@/theme';

export default function WorkoutTracking() {
  const today = useToday();
  const [selected, setSelected] = useState(today);
  const schedule = usePlanStore((s) => s.schedule);
  const planId = usePlanStore((s) => s.trainingPlanId);
  const sessions = useWorkoutStore((s) => s.sessions);
  const active = useWorkoutStore((s) => s.active);

  const dates = weekDates(today);
  const done = useMemo(() => completedDates(sessions), [sessions]);
  const workout = getWorkout(schedule[weekdayOf(selected)]);
  const isToday = selected === today;
  const recent = useMemo(() => [...sessions].filter((s) => s.completedAt).reverse().slice(0, 3), [sessions]);

  const start = () => {
    if (!workout) return;
    useWorkoutStore.getState().start(workout, planId, today);
    router.push('/workout/session');
  };

  const resumeActive = active && (!workout || active.templateId === workout.id);

  return (
    <Screen>
      <ModalHeader
        right={<Button title="Adjust Plan" icon="calendar-edit" variant="secondary" size="sm" onPress={() => router.push('/workout/adjust')} />}
      />
      <PageTitle eyebrow={`${TRAINING_PLANS[planId].name} plan`} title="Workout Tracking" />

      <WeekStrip dates={dates} today={today} selected={selected} schedule={schedule} completed={done} onSelect={setSelected} />

      {workout ? (
        <>
          <Card tint style={styles.hero}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.heroEyebrow}>{isToday ? "Today's Workout" : `${WEEKDAY_LONG[weekdayOf(selected)]}'s Workout`}</Text>
              <Text style={styles.heroTitle}>{workout.name}</Text>
              <Text style={styles.heroSub}>
                {workout.focus} · {workout.estMinutes} min
              </Text>
            </View>
            <View style={styles.heroArt}>
              <Icon name="dumbbell" size={56} color={colors.primary} />
            </View>
          </Card>

          <Card style={{ paddingVertical: spacing.md }}>
            <View style={styles.exHeader}>
              <Text style={styles.exTitle}>Exercises</Text>
              <Text style={styles.exCount}>{workout.exercises.length} exercises</Text>
            </View>
            {workout.exercises.map((pe, i) => {
              const ex = getExercise(pe.exerciseId);
              const last = lastPerformance(sessions, pe.exerciseId);
              const lastText = last?.best ? ` · Last: ${formatSet(last.best)}` : '';
              return (
                <ListRow
                  key={pe.exerciseId}
                  left={<IconBadge icon={KIND_ICON[ex.kind]} size={52} rounded="square" />}
                  title={ex.name}
                  subtitle={`${setsLabel(pe.sets, pe.reps)}${lastText}`}
                  onPress={() => router.push({ pathname: '/workout/exercise/[id]', params: { id: pe.exerciseId } })}
                  divider={i < workout.exercises.length - 1}
                />
              );
            })}
          </Card>

          {isToday && done.has(today) && !resumeActive ? (
            <Card style={styles.doneCard}>
              <IconBadge icon="check" tone="green" />
              <Text style={styles.doneText}>Workout complete. Great work today.</Text>
            </Card>
          ) : (
            <Button
              title={resumeActive ? 'Resume Workout' : isToday ? 'Start Workout' : 'Do this workout today'}
              icon="play-circle"
              onPress={resumeActive ? () => router.push('/workout/session') : start}
            />
          )}
        </>
      ) : (
        <Card style={styles.rest}>
          <IconBadge icon="sleep" size={56} />
          <Text style={styles.restTitle}>Rest day</Text>
          <Text style={styles.restBody}>Recovery is where you get stronger. Go for a walk, stretch and sleep well.</Text>
          {resumeActive ? <Button title="Resume Workout" icon="play-circle" onPress={() => router.push('/workout/session')} style={{ alignSelf: 'stretch' }} /> : null}
        </Card>
      )}

      {recent.length ? (
        <>
          <SectionHeader title="Recent workouts" />
          <Card style={{ paddingVertical: spacing.xs }}>
            {recent.map((s, i) => {
              const sets = s.exercises.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0);
              return (
                <ListRow
                  key={s.id}
                  title={getWorkout(s.templateId)?.name ?? 'Workout'}
                  subtitle={`${formatMonthDay(s.date)} · ${sets} sets`}
                  left={<IconBadge icon="check" tone="green" size={36} />}
                  divider={i < recent.length - 1}
                />
              );
            })}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  heroEyebrow: { fontSize: 15, color: colors.textSecondary },
  heroTitle: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5, lineHeight: 32 },
  heroSub: { fontSize: 15, color: colors.textSecondary },
  heroArt: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#DCEEFD', alignItems: 'center', justifyContent: 'center' },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.sm },
  exTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  exCount: { fontSize: 15, color: colors.textSecondary },
  doneCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  doneText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  rest: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  restTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  restBody: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 },
});
