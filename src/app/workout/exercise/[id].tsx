import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, EmptyState, ModalHeader, Screen, SectionHeader } from '@/components/ui';
import { getExercise } from '@/content/exercises';
import { formatShortDate } from '@/domain/dates';
import { bestSet, estimate1RM, exerciseHistory, formatSet, trimNum } from '@/domain/strength';
import { useWorkoutStore } from '@/store';
import { colors, spacing } from '@/theme';

export default function ExerciseHistory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ex = getExercise(id);
  const sessions = useWorkoutStore((s) => s.sessions);
  const history = exerciseHistory(sessions, id);
  const allSets = history.flatMap((h) => h.sets);
  const best = bestSet(allSets);

  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title={ex.name} close />
      <Text style={styles.meta}>
        {ex.muscle} · {ex.equipment}
      </Text>
      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text style={styles.statLabel}>Best set</Text>
          <Text style={styles.statValue}>{best ? formatSet(best) : '–'}</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statLabel}>Est. 1 rep max</Text>
          <Text style={styles.statValue}>{best?.weightKg && best.reps ? `${trimNum(estimate1RM(best.weightKg, best.reps))} kg` : '–'}</Text>
        </Card>
      </View>
      <SectionHeader title="History" right={`${history.length} sessions`} />
      {history.length ? (
        history.map((h) => (
          <Card key={h.completedAt} style={{ gap: 6, padding: spacing.lg }}>
            <Text style={styles.date}>{formatShortDate(h.date)}</Text>
            <Text style={styles.sets}>{h.sets.map((s) => formatSet(s) + (s.rir != null ? ` @${s.rir} RIR` : '')).join('   ·   ')}</Text>
          </Card>
        ))
      ) : (
        <EmptyState icon="history" title="No history yet" body="Your sets will appear here after your first workout with this exercise." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginTop: -8 },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, gap: 4, padding: spacing.lg },
  statLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  date: { fontSize: 15, fontWeight: '700', color: colors.text },
  sets: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
});
