import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Icon, IconBadge, ListRow, ModalHeader, PageTitle, Ring, Screen, StatTile } from '@/components/ui';
import { NUTRITION_PLANS } from '@/content/nutritionPlans';
import { formatShortDate } from '@/domain/dates';
import { MEALS } from '@/domain/models';
import { sumMacros } from '@/domain/targets';
import { MEAL_ICON, MEAL_LABEL } from '@/features/nutrition/meta';
import { useSummary } from '@/hooks/useSummary';
import { useToday } from '@/hooks/useToday';
import { usePlanStore } from '@/store';
import { colors, spacing } from '@/theme';

export default function NutritionTracking() {
  const today = useToday();
  const s = useSummary(today);
  const planId = usePlanStore((st) => st.nutritionPlanId);
  const { macros, targets } = s;
  const left = Math.round(targets.calories - macros.calories);

  return (
    <Screen>
      <ModalHeader />
      <PageTitle eyebrow={`${NUTRITION_PLANS[planId].name} plan`} title="Nutrition Tracking" right={<Text style={styles.date}>{formatShortDate(today)}</Text>} />

      <Card tint style={styles.calCard}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.cal}>
            {Math.round(macros.calories).toLocaleString()}
            <Text style={styles.calOf}> / {targets.calories.toLocaleString()} kcal</Text>
          </Text>
          <View style={styles.left}>
            <Icon name="fire" size={20} color={colors.primary} />
            <Text style={styles.leftText}>{left >= 0 ? `${left.toLocaleString()} kcal left` : `${(-left).toLocaleString()} kcal over`}</Text>
          </View>
        </View>
        <Ring value={macros.calories / targets.calories} size={112} stroke={12}>
          <Icon name="fire" size={22} color={colors.primary} />
          <Text style={styles.ringNum}>{Math.round(macros.calories).toLocaleString()}</Text>
          <Text style={styles.ringOf}>{targets.calories.toLocaleString()}</Text>
        </Ring>
      </Card>

      <View style={styles.tiles}>
        <StatTile icon="food-drumstick" tone="yellow" label="Protein" value={String(Math.round(macros.proteinG))} unit={`/ ${targets.proteinG} g`} progress={macros.proteinG / targets.proteinG} />
        <StatTile icon="barley" tone="yellow" label="Carbs" value={String(Math.round(macros.carbsG))} unit={`/ ${targets.carbsG} g`} progress={macros.carbsG / targets.carbsG} />
        <StatTile icon="water-outline" label="Fat" value={String(Math.round(macros.fatG))} unit={`/ ${targets.fatG} g`} progress={macros.fatG / targets.fatG} />
      </View>

      <Card style={{ paddingVertical: spacing.md }}>
        <View style={styles.mealsHead}>
          <Text style={styles.mealsTitle}>Meals</Text>
          <Text style={styles.mealsKcal}>{Math.round(macros.calories).toLocaleString()} kcal</Text>
        </View>
        {MEALS.map((m, i) => {
          const items = s.todayEntries.filter((e) => e.meal === m);
          const kcal = Math.round(sumMacros(items).calories);
          return (
            <ListRow
              key={m}
              left={<IconBadge icon={MEAL_ICON[m]} size={52} rounded="square" tone={items.length ? 'blue' : 'grey'} />}
              title={MEAL_LABEL[m]}
              subtitle={items.length ? items.map((e) => e.food.name).join(', ') : 'Tap to add food'}
              value={items.length ? `${kcal} kcal` : undefined}
              onPress={() => router.push({ pathname: '/nutrition/meal/[meal]', params: { meal: m } })}
              divider={i < MEALS.length - 1}
            />
          );
        })}
      </Card>

      <Card style={{ gap: spacing.md }}>
        <Text style={styles.mealsTitle}>Log Food</Text>
        <View style={styles.actions}>
          <ActionTile icon="magnify" label="Search Food" onPress={() => router.push('/nutrition/search')} />
          <ActionTile icon="barcode-scan" label="Scan Barcode" onPress={() => router.push('/nutrition/scan')} />
        </View>
        <Button title="Add Food" icon="plus" onPress={() => router.push('/nutrition/quick-add')} />
      </Card>
    </Screen>
  );
}

function ActionTile({ icon, label, onPress }: { icon: 'magnify' | 'barcode-scan'; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}>
      <Icon name={icon} size={30} color={colors.primary} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  date: { fontSize: 15, color: colors.textSecondary, marginBottom: 6 },
  calCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { fontSize: 17, fontWeight: '600', color: colors.text },
  cal: { fontSize: 44, fontWeight: '800', color: colors.text, letterSpacing: -1.2 },
  calOf: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, letterSpacing: 0 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  leftText: { fontSize: 15, color: colors.textSecondary },
  ringNum: { fontSize: 16, fontWeight: '800', color: colors.text },
  ringOf: { fontSize: 12, color: colors.textSecondary },
  tiles: { flexDirection: 'row', gap: spacing.md },
  mealsHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.sm, paddingBottom: 4 },
  mealsTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  mealsKcal: { fontSize: 17, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: spacing.lg, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  actionText: { fontSize: 15, fontWeight: '500', color: colors.text },
});
