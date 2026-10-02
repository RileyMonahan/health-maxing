import { useMemo } from 'react';
import { getWorkout } from '@/content/trainingPlans';
import { toDateKey, weekDates, weekdayOf } from '@/domain/dates';
import type { MealType } from '@/domain/models';
import { energyScore, healthScore, isNutritionDayOnTarget, movementScore, sleepScore, completedDates } from '@/domain/scoring';
import { activeDates, currentStreak } from '@/domain/streak';
import { sumMacros } from '@/domain/targets';
import { useDailyStore, useNutritionStore, usePlanStore, useProfileStore, useWorkoutStore } from '@/store';

/** Everything Home and the Tracking hub need, derived from the stores. */
export function useSummary(today: string) {
  const logs = useDailyStore((s) => s.logs);
  const sessions = useWorkoutStore((s) => s.sessions);
  const entries = useNutritionStore((s) => s.entries);
  const schedule = usePlanStore((s) => s.schedule);
  const targets = usePlanStore((s) => s.targets);
  const createdAt = useProfileStore((s) => s.profile?.createdAt);
  const since = createdAt ? toDateKey(new Date(createdAt)) : '';

  return useMemo(() => {
    const input = { today, logs, sessions, entries, schedule, targets, since };
    const todayEntries = entries.filter((e) => e.date === today);
    const macros = sumMacros(todayEntries);
    const mealsLogged = new Set<MealType>(todayEntries.map((e) => e.meal));
    const week = weekDates(today);
    const done = completedDates(sessions);
    const active = activeDates(logs, entries, sessions);
    const todayLog = logs[today];
    const workout = getWorkout(schedule[weekdayOf(today)]);

    return {
      score: healthScore(input),
      energy: energyScore(input),
      sleep: sleepScore(input),
      movement: movementScore(input),
      macros,
      targets,
      todayEntries,
      mealsLogged,
      todayLog,
      checkedIn: todayLog?.energy != null && todayLog?.sleepHours != null,
      workout,
      workoutDone: done.has(today),
      streak: currentStreak(active, today),
      weekActive: week.map((d) => active.has(d)),
      week: {
        trainingDone: week.filter((d) => done.has(d)).length,
        trainingPlanned: week.filter((d) => schedule[weekdayOf(d)] && d >= since).length,
        nutritionOnTarget: week.filter((d) => d <= today && isNutritionDayOnTarget(entries, d, targets)).length,
      },
    };
  }, [today, logs, sessions, entries, schedule, targets, since]);
}
