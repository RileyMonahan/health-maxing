import { addDays } from './dates';
import type { DailyLog, DateKey, FoodLogEntry, WorkoutSession } from './models';

export function activeDates(
  logs: Record<DateKey, DailyLog>,
  entries: FoodLogEntry[],
  sessions: WorkoutSession[],
): Set<DateKey> {
  const set = new Set<DateKey>();
  Object.values(logs).forEach((l) => {
    if (l.energy != null || l.sleepHours != null || l.steps != null || l.weightKg != null) set.add(l.date);
  });
  entries.forEach((e) => set.add(e.date));
  sessions.forEach((s) => s.completedAt && set.add(s.date));
  return set;
}

/** Consecutive active days ending today (or yesterday, if today is still empty). */
export function currentStreak(active: Set<DateKey>, today: DateKey): number {
  let day = active.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (active.has(day)) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}
