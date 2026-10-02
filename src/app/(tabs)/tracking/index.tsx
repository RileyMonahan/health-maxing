import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader, Card, IconBadge, PageTitle, ProgressBar, Screen, SectionHeader } from '@/components/ui';
import { getWorkout } from '@/content/trainingPlans';
import { WEEKDAY_SHORT, weekdayOf } from '@/domain/dates';
import { nextTrainingDay } from '@/domain/schedule';
import { TrackingCard } from '@/features/tracking/TrackingCard';
import { useSummary } from '@/hooks/useSummary';
import { useToday } from '@/hooks/useToday';
import { usePlanStore } from '@/store';
import { colors, spacing } from '@/theme';

export default function TrackingHub() {
  const today = useToday();
  const s = useSummary(today);
  const schedule = usePlanStore((st) => st.schedule);

  let workoutSubtitle = "Today's session ready";
  let workoutMeta = s.workout ? `${s.workout.exercises.length} exercises` : '';
  if (s.workoutDone) workoutSubtitle = 'Done today. Nice work.';
  else if (!s.workout) {
    const next = nextTrainingDay(schedule, weekdayOf(today));
    const nextW = next != null ? getWorkout(schedule[next]) : null;
    workoutSubtitle = 'Rest day today';
    workoutMeta = nextW && next != null ? `Next: ${WEEKDAY_SHORT[next]}, ${nextW.name}` : 'No workouts scheduled';
  }

  return (
    <Screen>
      <AppHeader />
      <PageTitle title="Tracking" subtitle="Choose what you want to track today." />

      <TrackingCard
        icon="dumbbell"
        title="Workout Tracking"
        subtitle={workoutSubtitle}
        metaIcon={s.workout ? 'format-list-bulleted' : 'calendar-month'}
        meta={workoutMeta}
        onPress={() => router.push('/tracking/workout')}
      />
      <TrackingCard
        icon="bowl-mix"
        title="Nutrition Tracking"
        subtitle="Calories and meals"
        metaIcon="fire"
        meta={Math.round(s.macros.calories).toLocaleString()}
        metaSuffix={` / ${s.targets.calories.toLocaleString()} kcal`}
        onPress={() => router.push('/tracking/nutrition')}
      />

      <SectionHeader title="This Week" right="View all" onPress={() => router.push('/progress')} />
      <View style={styles.row}>
        <WeekTile icon="dumbbell" label="Training days" value={s.week.trainingDone} total={s.week.trainingPlanned} />
        <WeekTile icon="fire" tone="yellow" label="Nutrition on target" value={s.week.nutritionOnTarget} total={7} color={colors.highlight} />
      </View>
    </Screen>
  );
}

function WeekTile({ icon, label, value, total, tone = 'blue', color }: { icon: 'dumbbell' | 'fire'; label: string; value: number; total: number; tone?: 'blue' | 'yellow'; color?: string }) {
  return (
    <Card style={styles.tile}>
      <View style={styles.tileTop}>
        <IconBadge icon={icon} tone={tone} size={48} />
        <View style={{ flex: 1 }}>
          <Text style={styles.tileLabel} numberOfLines={2}>
            {label}
          </Text>
          <Text style={styles.tileValue}>
            {value}
            <Text style={styles.tileTotal}> / {total}</Text>
          </Text>
        </View>
      </View>
      <ProgressBar value={total ? value / total : 0} color={color} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  tile: { flex: 1, gap: spacing.md, padding: spacing.lg },
  tileTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tileLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  tileValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  tileTotal: { fontSize: 18, fontWeight: '500', color: colors.textSecondary },
});
