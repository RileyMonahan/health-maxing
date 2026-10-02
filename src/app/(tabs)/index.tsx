import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader, Card, Icon, IconBadge, Ring, Screen, SectionHeader, StatTile, WeekDots } from '@/components/ui';
import { formatShortDate, greetingFor } from '@/domain/dates';
import { scoreLabel } from '@/domain/scoring';
import { TaskRow } from '@/features/home/TaskRow';
import { useSummary } from '@/hooks/useSummary';
import { useToday } from '@/hooks/useToday';
import { useProfileStore } from '@/store';
import { colors, spacing, type } from '@/theme';

const fmt = (v: number | null) => (v == null ? '–' : v.toFixed(1));

export default function Home() {
  const today = useToday();
  const name = useProfileStore((s) => s.profile?.name ?? '');
  const s = useSummary(today);

  const mainMeals = (['breakfast', 'lunch', 'dinner'] as const).filter((m) => s.mealsLogged.has(m)).length;
  const tasks = [
    {
      key: 'checkin',
      icon: 'white-balance-sunny' as const,
      title: 'Morning check-in',
      subtitle: s.checkedIn ? 'Energy and sleep logged' : 'Energy and sleep, 10 seconds',
      done: s.checkedIn,
      onPress: () => router.push('/check-in'),
    },
    {
      key: 'workout',
      icon: 'dumbbell' as const,
      title: s.workout ? 'Workout' : 'Rest day',
      subtitle: s.workout ? `${s.workout.estMinutes} min · ${s.workout.name}` : 'Recover, walk and stretch',
      done: s.workoutDone || !s.workout,
      onPress: () => router.push('/tracking/workout'),
    },
    {
      key: 'nutrition',
      icon: 'bowl-mix' as const,
      title: 'Nutrition',
      subtitle: `${mainMeals} / 3 meals logged`,
      done: mainMeals === 3,
      onPress: () => router.push('/tracking/nutrition'),
    },
  ];
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <Screen>
      <AppHeader />
      <View style={styles.greetingBlock}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            {greetingFor()}
            {name ? `, ${name}` : ''}
          </Text>
          <Icon name="white-balance-sunny" size={20} color={colors.highlight} />
          <Text style={styles.date}>{formatShortDate(today)}</Text>
        </View>
        <Text style={type.title}>Let's make it count.</Text>
      </View>

      <Card tint style={styles.scoreCard} onPress={() => router.push('/progress')} accessibilityLabel={`Health score ${s.score ?? 'not yet available'}`}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.cardLabel}>Health Score</Text>
          <Text style={styles.score}>
            {s.score ?? '–'}
            <Text style={styles.scoreOf}> / 100</Text>
          </Text>
          <View style={styles.trend}>
            <Icon name="trending-up" size={20} color={colors.primary} />
            <Text style={styles.trendText}>{scoreLabel(s.score)}</Text>
          </View>
        </View>
        <Ring value={(s.score ?? 0) / 100} size={124} stroke={13}>
          <Icon name="heart" size={24} color={colors.primary} />
          <Text style={styles.ringNum}>{s.score ?? '–'}</Text>
        </Ring>
      </Card>

      <View style={styles.tiles}>
        <StatTile icon="lightning-bolt" tone="yellow" label="Energy" value={fmt(s.energy)} unit="/ 10" progress={(s.energy ?? 0) / 10} onPress={() => router.push('/check-in')} />
        <StatTile icon="weather-night" label="Sleep" value={fmt(s.sleep)} unit="/ 10" progress={(s.sleep ?? 0) / 10} onPress={() => router.push('/check-in')} />
        <StatTile icon="run-fast" tone="yellow" label="Movement" value={fmt(s.movement)} unit="/ 10" progress={(s.movement ?? 0) / 10} onPress={() => router.push('/check-in')} />
      </View>

      <SectionHeader title="Today" right={`${doneCount} of ${tasks.length}`} />
      <Card style={{ paddingVertical: 0 }}>
        {tasks.map(({ key, ...t }, i) => (
          <TaskRow key={key} {...t} last={i === tasks.length - 1} />
        ))}
      </Card>

      <Card style={styles.streak}>
        <IconBadge icon="fire" tone="yellow" size={52} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.streakTitle}>
            {s.streak} day streak
          </Text>
          <Text style={styles.streakBody}>{s.streak > 0 ? "Keep going, you're building momentum." : 'Log anything today to start one.'}</Text>
        </View>
        <WeekDots filled={s.weekActive} size={16} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greetingBlock: { marginTop: spacing.md },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  greetingText: { fontSize: 17, color: colors.textSecondary, fontWeight: '500' },
  date: { flex: 1, textAlign: 'right', fontSize: 15, color: colors.textSecondary },
  scoreCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardLabel: { fontSize: 18, fontWeight: '600', color: colors.text },
  score: { fontSize: 64, fontWeight: '800', color: colors.text, letterSpacing: -2 },
  scoreOf: { fontSize: 20, fontWeight: '500', color: colors.textSecondary, letterSpacing: 0 },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trendText: { fontSize: 15, color: colors.textSecondary },
  ringNum: { fontSize: 22, fontWeight: '800', color: colors.text },
  tiles: { flexDirection: 'row', gap: spacing.md },
  streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  streakTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  streakBody: { fontSize: 13, color: colors.textSecondary },
});
