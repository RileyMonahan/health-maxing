import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, EmptyState, Icon, ModalHeader, Screen } from '@/components/ui';
import { sumMacros } from '@/domain/targets';
import { FoodRow } from '@/features/nutrition/FoodRow';
import { isMealType, MEAL_LABEL } from '@/features/nutrition/meta';
import { useToday } from '@/hooks/useToday';
import { useNutritionStore } from '@/store';
import { colors, spacing } from '@/theme';

export default function MealDetail() {
  const params = useLocalSearchParams<{ meal: string }>();
  const meal = isMealType(params.meal) ? params.meal : 'breakfast';
  const today = useToday();
  const entries = useNutritionStore((s) => s.entries).filter((e) => e.date === today && e.meal === meal);
  const m = sumMacros(entries);

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={styles.footer}>
          <Button title="Search" icon="magnify" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/nutrition/search', params: { meal } })} />
          <Button title="Scan" icon="barcode-scan" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/nutrition/scan', params: { meal } })} />
          <Button title="Add" icon="plus" size="md" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/nutrition/quick-add', params: { meal } })} />
        </View>
      }
    >
      <ModalHeader title={MEAL_LABEL[meal]} />
      <Card tint style={styles.summary}>
        <Total label="Calories" value={Math.round(m.calories)} />
        <Total label="Protein" value={Math.round(m.proteinG)} unit="g" />
        <Total label="Carbs" value={Math.round(m.carbsG)} unit="g" />
        <Total label="Fat" value={Math.round(m.fatG)} unit="g" />
      </Card>
      <Card style={{ paddingVertical: spacing.xs }}>
        {entries.length ? (
          entries.map((e, i) => (
            <FoodRow
              key={e.id}
              food={e.food}
              servings={e.servings}
              last={i === entries.length - 1}
              onPress={() => router.push({ pathname: '/nutrition/food', params: { entryId: e.id, back: '1' } })}
              right={
                <Pressable onPress={() => useNutritionStore.getState().removeEntry(e.id)} hitSlop={8} accessibilityLabel={`Remove ${e.food.name}`}>
                  <Icon name="trash-can-outline" size={22} color={colors.textTertiary} />
                </Pressable>
              }
            />
          ))
        ) : (
          <EmptyState icon="silverware-fork-knife" title="Nothing logged yet" body="Search, scan or add a food below." />
        )}
      </Card>
    </Screen>
  );
}

function Total({ label, value, unit }: { label: string; value: number; unit?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      <Text style={styles.tValue}>
        {value}
        {unit ? <Text style={styles.tUnit}>{unit}</Text> : null}
      </Text>
      <Text style={styles.tLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', gap: spacing.sm },
  summary: { flexDirection: 'row', paddingVertical: spacing.lg },
  tValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  tUnit: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
});
