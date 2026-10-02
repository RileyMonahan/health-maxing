import { addDays, dateRange, weekDates, weekdayOf } from './dates';
import type { DailyLog, DateKey, FoodLogEntry, Schedule, Targets, WorkoutSession } from './models';
import { sumMacros } from './targets';

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const round1 = (n: number) => Math.round(n * 10) / 10;

export interface ScoreInputs {
  today: DateKey;
  logs: Record<DateKey, DailyLog>;
  sessions: WorkoutSession[];
  entries: FoodLogEntry[];
  schedule: Schedule;
  targets: Targets;
  /** first day the user used the app; earlier days don't count against them */
  since?: DateKey;
}

function lastNDays(today: DateKey, n: number): DateKey[] {
  return dateRange(addDays(today, -(n - 1)), today);
}

/** Average energy rating over the last 7 days, out of 10. */
export function energyScore({ today, logs }: Pick<ScoreInputs, 'today' | 'logs'>): number | null {
  const values = lastNDays(today, 7)
    .map((d) => logs[d]?.energy)
    .filter((v): v is number => v != null);
  const a = avg(values);
  return a == null ? null : round1(a);
}

/** Sleep hours vs goal (60%) and quality (40%), last 7 days, out of 10. */
export function sleepScore({ today, logs, targets }: Pick<ScoreInputs, 'today' | 'logs' | 'targets'>): number | null {
  const nights = lastNDays(today, 7)
    .map((d) => logs[d])
    .filter((l): l is DailyLog => l?.sleepHours != null);
  if (!nights.length) return null;
  const perNight = nights.map((l) => {
    const hours = clamp01(l.sleepHours! / targets.sleepGoalHours);
    const quality = l.sleepQuality != null ? l.sleepQuality / 10 : hours;
    return 10 * (0.6 * hours + 0.4 * quality);
  });
  return round1(avg(perNight)!);
}

export function completedDates(sessions: WorkoutSession[]): Set<DateKey> {
  return new Set(sessions.filter((s) => s.completedAt).map((s) => s.date));
}

/** Workouts done vs scheduled this week (60%), steps vs goal over last 7 days (40%). */
export function movementScore(input: ScoreInputs): number | null {
  const { today, logs, sessions, schedule, targets, since = '' } = input;
  const doneDates = completedDates(sessions);
  const week = weekDates(today).filter((d) => d <= today && d >= since);
  const done = week.filter((d) => doneDates.has(d)).length;
  // Today only counts as scheduled once it's done, so the day isn't judged early.
  const scheduled = week.filter((d) => schedule[weekdayOf(d)] && (d < today || doneDates.has(d))).length;
  const steps = lastNDays(today, 7)
    .map((d) => logs[d]?.steps)
    .filter((v): v is number => v != null);
  const workoutPart = scheduled ? clamp01(done / scheduled) : done > 0 ? 1 : null;
  const stepsPart = steps.length ? clamp01(avg(steps)! / targets.stepsGoal) : null;
  if (workoutPart == null && stepsPart == null) return null;
  if (workoutPart == null) return round1(10 * stepsPart!);
  if (stepsPart == null) return round1(10 * workoutPart);
  return round1(10 * (0.6 * workoutPart + 0.4 * stepsPart));
}

/** A day is "on target" when calories land within ±10% and protein reaches 90%. */
export function isNutritionDayOnTarget(entries: FoodLogEntry[], date: DateKey, targets: Targets): boolean {
  const day = entries.filter((e) => e.date === date);
  if (!day.length) return false;
  const m = sumMacros(day);
  return Math.abs(m.calories - targets.calories) <= targets.calories * 0.1 && m.proteinG >= targets.proteinG * 0.9;
}

export function nutritionConsistency(entries: FoodLogEntry[], dates: DateKey[], targets: Targets) {
  const onTarget = dates.filter((d) => isNutritionDayOnTarget(entries, d, targets)).length;
  return { onTarget, total: dates.length };
}

export function trainingConsistency(sessions: WorkoutSession[], schedule: Schedule, dates: DateKey[]) {
  const done = completedDates(sessions);
  const scheduled = dates.filter((d) => schedule[weekdayOf(d)]).length;
  const completed = dates.filter((d) => done.has(d)).length;
  return { completed, scheduled };
}

/** Health Maxing score 0–100: energy, sleep, movement and nutrition, 25% each. */
export function healthScore(input: ScoreInputs): number | null {
  const parts: number[] = [];
  const e = energyScore(input);
  const s = sleepScore(input);
  const m = movementScore(input);
  if (e != null) parts.push(e / 10);
  if (s != null) parts.push(s / 10);
  if (m != null) parts.push(m / 10);
  // Today only counts once it's on target, so logging breakfast never lowers the score.
  const loggedDays = lastNDays(input.today, 7).filter(
    (d) => input.entries.some((x) => x.date === d) && (d < input.today || isNutritionDayOnTarget(input.entries, d, input.targets)),
  );
  if (loggedDays.length) {
    const n = nutritionConsistency(input.entries, loggedDays, input.targets);
    parts.push(n.onTarget / n.total);
  }
  if (!parts.length) return null;
  return Math.round(100 * avg(parts)!);
}

export function scoreLabel(score: number | null): string {
  if (score == null) return 'Check in to get your score';
  if (score >= 80) return "You're on track";
  if (score >= 60) return 'Solid, keep building';
  return "Let's lift it today";
}
