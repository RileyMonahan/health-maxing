import { StyleSheet, Text, View } from 'react-native';
import { Card, ModalHeader, OptionCard, Screen } from '@/components/ui';
import { NUTRITION_PLAN_ORDER, NUTRITION_PLANS } from '@/content/nutritionPlans';
import { usePlanStore, useProfileStore } from '@/store';
import { colors, spacing, type } from '@/theme';

export default function NutritionPlanScreen() {
  const profile = useProfileStore((s) => s.profile)!;
  const planId = usePlanStore((s) => s.nutritionPlanId);
  const targets = usePlanStore((s) => s.targets);
  const plan = NUTRITION_PLANS[planId];

  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title="Nutrition plan" />
      {NUTRITION_PLAN_ORDER.map((id) => (
        <OptionCard
          key={id}
          title={NUTRITION_PLANS[id].name}
          description={NUTRITION_PLANS[id].description}
          selected={id === planId}
          onPress={() => {
            usePlanStore.getState().setNutritionPlan(id, profile);
            useProfileStore.getState().updateProfile({ nutritionPreference: id });
          }}
        />
      ))}
      <Card style={{ gap: spacing.md }}>
        <Text style={type.subheading}>How {plan.name} works</Text>
        {plan.principles.map((p) => (
          <View key={p} style={styles.bullet}>
            <View style={styles.dot} />
            <Text style={styles.text}>{p}</Text>
          </View>
        ))}
        <Text style={[type.subheading, { marginTop: spacing.sm }]}>Example day</Text>
        {plan.exampleDay.map((p) => (
          <View key={p} style={styles.bullet}>
            <View style={[styles.dot, { backgroundColor: colors.highlight }]} />
            <Text style={styles.text}>{p}</Text>
          </View>
        ))}
      </Card>
      {targets.custom ? <Text style={styles.note}>You're using custom targets, so changing plan won't change your numbers.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bullet: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  text: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 21 },
  note: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});
