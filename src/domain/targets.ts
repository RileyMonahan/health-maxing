import type { Macros, NutritionPlan, Targets, UserProfile } from './models';

const ACTIVITY_BY_DAYS: Record<number, number> = { 0: 1.3, 1: 1.35, 2: 1.4, 3: 1.5, 4: 1.55, 5: 1.6, 6: 1.7, 7: 1.75 };

/** Mifflin-St Jeor (male). */
export function bmr(p: Pick<UserProfile, 'weightKg' | 'heightCm' | 'age'>): number {
  return 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + 5;
}

export function calculateTargets(
  profile: Pick<UserProfile, 'weightKg' | 'heightCm' | 'age' | 'goalWeightKg' | 'typicalSleepHours'>,
  trainingDays: number,
  plan: Pick<NutritionPlan, 'proteinPerKg' | 'fatPct'>,
): Targets {
  const tdee = bmr(profile) * (ACTIVITY_BY_DAYS[Math.min(7, Math.max(0, trainingDays))] ?? 1.5);
  const diff = profile.goalWeightKg - profile.weightKg;
  const adjust = diff < -1 ? -400 : diff > 1 ? 250 : 0;
  const calories = roundTo(tdee + adjust, 10);
  const proteinG = Math.round(profile.weightKg * plan.proteinPerKg);
  const fatG = Math.round((calories * plan.fatPct) / 9);
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));
  return {
    calories,
    proteinG,
    carbsG,
    fatG,
    stepsGoal: 8000,
    sleepGoalHours: 8,
    custom: false,
  };
}

export function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

export const ZERO_MACROS: Macros = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };

export function sumMacros(items: { food: Macros; servings: number }[]): Macros {
  return items.reduce<Macros>(
    (acc, { food, servings }) => ({
      calories: acc.calories + food.calories * servings,
      proteinG: acc.proteinG + food.proteinG * servings,
      carbsG: acc.carbsG + food.carbsG * servings,
      fatG: acc.fatG + food.fatG * servings,
    }),
    ZERO_MACROS,
  );
}
