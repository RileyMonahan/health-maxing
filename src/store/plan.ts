import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NUTRITION_PLANS } from '@/content/nutritionPlans';
import { TRAINING_PLANS } from '@/content/trainingPlans';
import type { NutritionPlanId, Schedule, Targets, TrainingPlanId, UserProfile, Weekday } from '@/domain/models';
import { buildSchedule, clampDays, DEFAULT_DAYS, emptySchedule, swapDays, trainingDaysOf } from '@/domain/schedule';
import { calculateTargets } from '@/domain/targets';
import { appStorage, STORAGE_PREFIX } from '@/services/storage';

interface PlanState {
  trainingPlanId: TrainingPlanId;
  nutritionPlanId: NutritionPlanId;
  schedule: Schedule;
  targets: Targets;
  /** Set everything at the end of onboarding. */
  initialise: (args: { trainingPlanId: TrainingPlanId; nutritionPlanId: NutritionPlanId; days: Weekday[]; profile: UserProfile }) => void;
  setTrainingPlan: (id: TrainingPlanId) => void;
  setDaysPerWeek: (n: number) => void;
  toggleDay: (day: Weekday) => void;
  swapDays: (a: Weekday, b: Weekday) => void;
  setNutritionPlan: (id: NutritionPlanId, profile: UserProfile) => void;
  setTargets: (patch: Partial<Targets>) => void;
  /** Recalculate from the profile unless the user set custom numbers. */
  recalcTargets: (profile: UserProfile, force?: boolean) => void;
  reset: () => void;
}

const DEFAULT_TARGETS: Targets = { calories: 2500, proteinG: 160, carbsG: 290, fatG: 75, stepsGoal: 8000, sleepGoalHours: 8, custom: false };

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      trainingPlanId: 'balanced',
      nutritionPlanId: 'balanced',
      schedule: emptySchedule(),
      targets: DEFAULT_TARGETS,

      initialise: ({ trainingPlanId, nutritionPlanId, days, profile }) => {
        const plan = TRAINING_PLANS[trainingPlanId];
        const n = clampDays(plan, days.length);
        const chosen = days.length === n ? days : DEFAULT_DAYS[n];
        set({
          trainingPlanId,
          nutritionPlanId,
          schedule: buildSchedule(plan, chosen),
          targets: calculateTargets(profile, n, NUTRITION_PLANS[nutritionPlanId]),
        });
      },

      setTrainingPlan: (id) => {
        const plan = TRAINING_PLANS[id];
        const current = trainingDaysOf(get().schedule);
        const n = clampDays(plan, current.length);
        const days = current.length === n ? current : DEFAULT_DAYS[n];
        set({ trainingPlanId: id, schedule: buildSchedule(plan, days) });
      },

      setDaysPerWeek: (n) => {
        const plan = TRAINING_PLANS[get().trainingPlanId];
        set({ schedule: buildSchedule(plan, DEFAULT_DAYS[clampDays(plan, n)]) });
      },

      toggleDay: (day) => {
        const plan = TRAINING_PLANS[get().trainingPlanId];
        const current = trainingDaysOf(get().schedule);
        const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
        if (next.length < plan.minDays || next.length > plan.maxDays) return;
        set({ schedule: buildSchedule(plan, next) });
      },

      swapDays: (a, b) => set({ schedule: swapDays(get().schedule, a, b) }),

      setNutritionPlan: (id, profile) => {
        set({ nutritionPlanId: id });
        get().recalcTargets(profile);
      },

      setTargets: (patch) => set({ targets: { ...get().targets, ...patch } }),

      recalcTargets: (profile, force = false) => {
        const { targets, nutritionPlanId, schedule } = get();
        if (targets.custom && !force) return;
        const calc = calculateTargets(profile, trainingDaysOf(schedule).length, NUTRITION_PLANS[nutritionPlanId]);
        set({ targets: { ...calc, stepsGoal: targets.stepsGoal, sleepGoalHours: targets.sleepGoalHours } });
      },

      reset: () => set({ trainingPlanId: 'balanced', nutritionPlanId: 'balanced', schedule: emptySchedule(), targets: DEFAULT_TARGETS }),
    }),
    { name: `${STORAGE_PREFIX}plan`, storage: appStorage, version: 1 },
  ),
);

/** Days the user is limited to for a given plan, for UI hints. */
export function planDayRange(id: TrainingPlanId) {
  const p = TRAINING_PLANS[id];
  return { min: p.minDays, max: p.maxDays };
}
