import type { Schedule, TrainingPlan, Weekday } from './models';
import { WEEKDAYS } from './models';

/** Spread N training days across the week with rest days in between. */
export const DEFAULT_DAYS: Record<number, Weekday[]> = {
  1: [0],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

export function clampDays(plan: TrainingPlan, days: number): number {
  return Math.min(plan.maxDays, Math.max(plan.minDays, days));
}

export function rotationFor(plan: TrainingPlan, days: number): string[] {
  return plan.rotations[clampDays(plan, days)] ?? plan.rotations[plan.defaultDays];
}

/** Assign the plan's rotation to the chosen weekdays, in order. */
export function buildSchedule(plan: TrainingPlan, trainingDays: Weekday[]): Schedule {
  const days = [...trainingDays].sort((a, b) => a - b);
  const rotation = rotationFor(plan, days.length);
  const schedule = emptySchedule();
  days.forEach((day, i) => {
    schedule[day] = rotation[i % rotation.length];
  });
  return schedule;
}

export function emptySchedule(): Schedule {
  return { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
}

export function trainingDaysOf(schedule: Schedule): Weekday[] {
  return WEEKDAYS.filter((d) => schedule[d] != null);
}

/** Swap whatever is on two days (workout ↔ workout or workout ↔ rest). */
export function swapDays(schedule: Schedule, a: Weekday, b: Weekday): Schedule {
  return { ...schedule, [a]: schedule[b], [b]: schedule[a] };
}

/** Next training weekday after `from` (exclusive), wrapping around the week. */
export function nextTrainingDay(schedule: Schedule, from: Weekday): Weekday | null {
  for (let i = 1; i <= 7; i++) {
    const d = ((from + i) % 7) as Weekday;
    if (schedule[d]) return d;
  }
  return null;
}
