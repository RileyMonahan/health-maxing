import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, ModalHeader, OptionCard, Screen } from '@/components/ui';
import { NUTRITION_PLAN_ORDER, NUTRITION_PLANS } from '@/content/nutritionPlans';
import { recommendTrainingPlan, TRAINING_PLAN_ORDER, TRAINING_PLANS } from '@/content/trainingPlans';
import { todayKey } from '@/domain/dates';
import { createId, nowIso } from '@/domain/ids';
import type { UserProfile } from '@/domain/models';
import { clampDays } from '@/domain/schedule';
import { calculateTargets } from '@/domain/targets';
import { num, useOnboardingDraft } from '@/features/onboarding/draft';
import { useDailyStore, usePlanStore, useProfileStore } from '@/store';
import { colors, spacing, type } from '@/theme';

export default function PlanChoice() {
  const d = useOnboardingDraft();
  const recommended = recommendTrainingPlan(d.daysPerWeek, d.experience ?? 'beginner');
  const trainingPlanId = d.trainingPlanId ?? recommended;
  const nutritionPlanId = d.nutritionPlanId ?? 'balanced';
  const plan = TRAINING_PLANS[trainingPlanId];
  const scheduledDays = clampDays(plan, d.daysPerWeek);

  useEffect(() => {
    if (!d.trainingPlanId) d.set({ trainingPlanId: recommended });
  }, [d, recommended]);

  const profile: UserProfile = useMemo(
    () => ({
      id: createId('user_'),
      name: d.name.trim(),
      age: num(d.age),
      heightCm: num(d.heightCm),
      weightKg: num(d.weightKg),
      goalWeightKg: num(d.goalWeightKg),
      goals: d.goals,
      experience: d.experience ?? 'beginner',
      nutritionPreference: nutritionPlanId,
      baselineEnergy: d.energy ?? 5,
      typicalSleepHours: d.sleepHours,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }),
    [d, nutritionPlanId],
  );

  const targets = calculateTargets(profile, scheduledDays, NUTRITION_PLANS[nutritionPlanId]);

  const start = () => {
    usePlanStore.getState().initialise({ trainingPlanId, nutritionPlanId, days: d.trainingDays, profile });
    useDailyStore.getState().upsertLog(todayKey(), { energy: profile.baselineEnergy, weightKg: profile.weightKg });
    // Setting the profile flips the onboarding guard and opens the app.
    useProfileStore.getState().setProfile(profile);
    d.clear();
  };

  return (
    <Screen edges={['top', 'bottom']} footer={<Button title="Start Health Maxing" onPress={start} />}>
      <ModalHeader />
      <View style={{ gap: 6 }}>
        <Text style={type.title}>Your plan, {d.name.trim() || 'champ'}</Text>
        <Text style={styles.lead}>We picked these from your answers. Tap to change anything.</Text>
      </View>

      <Card tint style={styles.targets}>
        <Target label="Calories" value={targets.calories.toLocaleString()} unit="kcal" />
        <Target label="Protein" value={String(targets.proteinG)} unit="g" />
        <Target label="Training" value={String(scheduledDays)} unit="days/wk" />
      </Card>

      <Text style={type.heading}>Training</Text>
      {TRAINING_PLAN_ORDER.map((id) => {
        const p = TRAINING_PLANS[id];
        return (
          <OptionCard
            key={id}
            title={p.name}
            description={`${p.tagline}. ${p.minDays}–${p.maxDays} days a week.`}
            badge={id === recommended ? 'Recommended' : undefined}
            selected={trainingPlanId === id}
            onPress={() => d.set({ trainingPlanId: id })}
          />
        );
      })}
      {scheduledDays !== d.daysPerWeek ? (
        <Text style={styles.note}>
          {plan.name} runs {plan.minDays}–{plan.maxDays} days a week, so we'll schedule {scheduledDays} days. You can adjust days any time.
        </Text>
      ) : null}

      <Text style={type.heading}>Nutrition</Text>
      {NUTRITION_PLAN_ORDER.map((id) => {
        const p = NUTRITION_PLANS[id];
        return (
          <OptionCard key={id} title={p.name} description={p.tagline} selected={nutritionPlanId === id} onPress={() => d.set({ nutritionPlanId: id })} />
        );
      })}
    </Screen>
  );
}

function Target({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={styles.tLabel}>{label}</Text>
      <Text style={styles.tValue}>{value}</Text>
      <Text style={styles.tUnit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: { fontSize: 16, color: colors.textSecondary, lineHeight: 22 },
  targets: { flexDirection: 'row', gap: spacing.md },
  tLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  tValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  tUnit: { fontSize: 13, color: colors.textSecondary },
  note: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
});
