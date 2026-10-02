import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BigNumberField, Button, Icon, Logo, OptionCard, ProgressBar, RatingScale, Screen, Stepper, TextField } from '@/components/ui';
import { NUTRITION_PLAN_ORDER, NUTRITION_PLANS } from '@/content/nutritionPlans';
import { WEEKDAY_SHORT } from '@/domain/dates';
import type { Weekday } from '@/domain/models';
import { DEFAULT_DAYS } from '@/domain/schedule';
import { inRange, useOnboardingDraft } from '@/features/onboarding/draft';
import { EXPERIENCE_OPTIONS, GOAL_OPTIONS } from '@/features/onboarding/options';
import { colors, spacing, type } from '@/theme';

type StepId =
  | 'welcome'
  | 'name'
  | 'age'
  | 'height'
  | 'weight'
  | 'goalWeight'
  | 'goals'
  | 'experience'
  | 'days'
  | 'trainingDays'
  | 'nutrition'
  | 'energy'
  | 'sleep';

const STEPS: StepId[] = ['welcome', 'name', 'age', 'height', 'weight', 'goalWeight', 'goals', 'experience', 'days', 'trainingDays', 'nutrition', 'energy', 'sleep'];

const NUTRITION_ICONS = { structured: 'food-apple', balanced: 'food-variant', flexible: 'food-takeout-box' } as const;

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const d = useOnboardingDraft();
  const step = STEPS[index];

  const valid: Record<StepId, boolean> = {
    welcome: true,
    name: d.name.trim().length > 0,
    age: inRange(d.age, 13, 99),
    height: inRange(d.heightCm, 120, 230),
    weight: inRange(d.weightKg, 35, 250),
    goalWeight: inRange(d.goalWeightKg, 35, 250),
    goals: d.goals.length > 0,
    experience: d.experience != null,
    days: d.daysPerWeek >= 2,
    trainingDays: d.trainingDays.length === d.daysPerWeek,
    nutrition: d.nutritionPlanId != null,
    energy: d.energy != null,
    sleep: d.sleepHours > 0,
  };

  const next = () => {
    if (index === STEPS.length - 1) router.push('/onboarding/plan');
    else setIndex(index + 1);
  };

  if (step === 'welcome') {
    return (
      <Screen scroll={false} edges={['top', 'bottom']} footer={<Button title="Get started" onPress={next} />}>
        <View style={styles.welcome}>
          <Logo size={88} />
          <Text style={[type.title, styles.center]}>Health Maxing</Text>
          <Text style={[styles.lead, styles.center]}>Get stronger, sleep better and feel more energy, one simple day at a time.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={<Button title={index === STEPS.length - 1 ? 'See my plan' : 'Continue'} onPress={next} disabled={!valid[step]} />}
    >
      <View style={styles.top}>
        <Pressable onPress={() => setIndex(index - 1)} hitSlop={10} accessibilityLabel="Back" style={styles.back}>
          <Icon name="chevron-left" size={26} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar value={index / (STEPS.length - 1)} height={6} />
        </View>
      </View>
      <StepBody key={step} step={step} />
    </Screen>
  );
}

function Question({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={{ gap: 6, marginTop: spacing.lg, marginBottom: spacing.sm }}>
      <Text style={styles.q}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

function StepBody({ step }: { step: StepId }) {
  const d = useOnboardingDraft();
  switch (step) {
    case 'name':
      return (
        <>
          <Question title="What's your first name?" />
          <TextField value={d.name} onChangeText={(name) => d.set({ name })} placeholder="Your name" autoFocus autoCapitalize="words" style={{ fontSize: 22, height: 60 }} />
        </>
      );
    case 'age':
      return (
        <>
          <Question title="How old are you?" />
          <BigNumberField value={d.age} onChangeText={(age) => d.set({ age: age.replace('.', '') })} suffix="years" placeholder="25" />
        </>
      );
    case 'height':
      return (
        <>
          <Question title="How tall are you?" />
          <BigNumberField value={d.heightCm} onChangeText={(heightCm) => d.set({ heightCm })} suffix="cm" placeholder="180" />
        </>
      );
    case 'weight':
      return (
        <>
          <Question title="What do you weigh today?" />
          <BigNumberField value={d.weightKg} onChangeText={(weightKg) => d.set({ weightKg })} suffix="kg" placeholder="80" />
        </>
      );
    case 'goalWeight':
      return (
        <>
          <Question title="What's your goal weight?" hint="A rough number is fine. You can change it later." />
          <BigNumberField value={d.goalWeightKg} onChangeText={(goalWeightKg) => d.set({ goalWeightKg })} suffix="kg" placeholder={d.weightKg || '78'} />
        </>
      );
    case 'goals':
      return (
        <>
          <Question title="What are your main goals?" hint="Pick as many as you like." />
          {GOAL_OPTIONS.map((g) => (
            <OptionCard
              key={g.id}
              title={g.label}
              icon={g.icon}
              selected={d.goals.includes(g.id)}
              onPress={() => d.set({ goals: d.goals.includes(g.id) ? d.goals.filter((x) => x !== g.id) : [...d.goals, g.id] })}
            />
          ))}
        </>
      );
    case 'experience':
      return (
        <>
          <Question title="How much training experience do you have?" />
          {EXPERIENCE_OPTIONS.map((o) => (
            <OptionCard key={o.id} title={o.label} description={o.description} icon={o.icon} selected={d.experience === o.id} onPress={() => d.set({ experience: o.id })} />
          ))}
        </>
      );
    case 'days':
      return (
        <>
          <Question title="How many days a week do you want to train?" hint="Be realistic. Consistency beats volume." />
          <View style={styles.dayCountRow}>
            {[2, 3, 4, 5, 6].map((n) => {
              const on = d.daysPerWeek === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => d.set({ daysPerWeek: n, trainingDays: DEFAULT_DAYS[n] })}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.dayCount, on && styles.dayCountOn]}
                >
                  <Text style={[styles.dayCountNum, on && { color: '#fff' }]}>{n}</Text>
                  <Text style={[styles.dayCountLabel, on && { color: '#fff' }]}>days</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      );
    case 'trainingDays':
      return (
        <>
          <Question title="Which days suit you best?" hint={`Choose ${d.daysPerWeek} days.`} />
          <View style={styles.weekGrid}>
            {([0, 1, 2, 3, 4, 5, 6] as Weekday[]).map((day) => {
              const on = d.trainingDays.includes(day);
              const full = !on && d.trainingDays.length >= d.daysPerWeek;
              return (
                <Pressable
                  key={day}
                  onPress={() =>
                    on
                      ? d.set({ trainingDays: d.trainingDays.filter((x) => x !== day) })
                      : !full && d.set({ trainingDays: [...d.trainingDays, day].sort() as Weekday[] })
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected: on, disabled: full }}
                  style={[styles.weekDay, on && styles.dayCountOn, full && { opacity: 0.4 }]}
                >
                  <Text style={[styles.weekDayText, on && { color: '#fff' }]}>{WEEKDAY_SHORT[day]}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      );
    case 'nutrition':
      return (
        <>
          <Question title="How do you like to eat?" hint="All three support great results. Pick how strict you want to be." />
          {NUTRITION_PLAN_ORDER.map((id) => {
            const p = NUTRITION_PLANS[id];
            return (
              <OptionCard
                key={id}
                title={p.name}
                description={p.description}
                icon={NUTRITION_ICONS[id]}
                selected={d.nutritionPlanId === id}
                onPress={() => d.set({ nutritionPlanId: id })}
              />
            );
          })}
        </>
      );
    case 'energy':
      return (
        <>
          <Question title="How is your energy most days?" hint="1 is exhausted, 10 is unstoppable." />
          <RatingScale value={d.energy ?? undefined} onChange={(energy) => d.set({ energy })} />
        </>
      );
    case 'sleep':
      return (
        <>
          <Question title="How much do you usually sleep?" />
          <View style={{ paddingVertical: spacing.xxl }}>
            <Stepper value={d.sleepHours} onChange={(sleepHours) => d.set({ sleepHours })} step={0.5} min={3} max={12} unit="hrs" />
          </View>
        </>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  welcome: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.lg },
  center: { textAlign: 'center' },
  lead: { fontSize: 18, color: colors.textSecondary, lineHeight: 26 },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  q: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5, lineHeight: 34 },
  hint: { fontSize: 16, color: colors.textSecondary, lineHeight: 22 },
  dayCountRow: { flexDirection: 'row', gap: 10, marginTop: spacing.md },
  dayCount: {
    flex: 1,
    height: 96,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCountOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayCountNum: { fontSize: 30, fontWeight: '800', color: colors.text },
  dayCountLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  weekGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: spacing.md },
  weekDay: {
    width: '30%',
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: { fontSize: 17, fontWeight: '700', color: colors.text },
});
