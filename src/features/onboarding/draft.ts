import { create } from 'zustand';
import type { Experience, GoalId, NutritionPlanId, TrainingPlanId, Weekday } from '@/domain/models';
import { DEFAULT_DAYS } from '@/domain/schedule';

/** Answers collected during onboarding. Kept in memory until the user finishes. */
export interface OnboardingDraft {
  name: string;
  age: string;
  heightCm: string;
  weightKg: string;
  goalWeightKg: string;
  goals: GoalId[];
  experience: Experience | null;
  daysPerWeek: number;
  trainingDays: Weekday[];
  nutritionPlanId: NutritionPlanId | null;
  energy: number | null;
  sleepHours: number;
  trainingPlanId: TrainingPlanId | null;
}

interface DraftStore extends OnboardingDraft {
  set: (patch: Partial<OnboardingDraft>) => void;
  clear: () => void;
}

const initial: OnboardingDraft = {
  name: '',
  age: '',
  heightCm: '',
  weightKg: '',
  goalWeightKg: '',
  goals: [],
  experience: null,
  daysPerWeek: 3,
  trainingDays: DEFAULT_DAYS[3],
  nutritionPlanId: null,
  energy: null,
  sleepHours: 7.5,
  trainingPlanId: null,
};

export const useOnboardingDraft = create<DraftStore>()((set) => ({
  ...initial,
  set: (patch) => set(patch),
  clear: () => set(initial),
}));

export const num = (s: string) => parseFloat(s);
export const inRange = (s: string, min: number, max: number) => {
  const n = num(s);
  return Number.isFinite(n) && n >= min && n <= max;
};
