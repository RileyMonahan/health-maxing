import type { LoggedSet, WorkoutSession } from './models';

/** Epley estimated one-rep max. */
export function estimate1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export function bestSet(sets: LoggedSet[]): LoggedSet | null {
  let best: LoggedSet | null = null;
  let bestScore = -1;
  for (const s of sets) {
    if (!s.done || !s.reps) continue;
    const score = s.weightKg ? estimate1RM(s.weightKg, s.reps) : s.reps;
    if (score > bestScore) {
      best = s;
      bestScore = score;
    }
  }
  return best;
}

/** Completed sessions containing this exercise, newest first. */
export function exerciseHistory(sessions: WorkoutSession[], exerciseId: string) {
  return sessions
    .filter((s) => s.completedAt)
    .flatMap((s) => {
      const ex = s.exercises.find((e) => e.exerciseId === exerciseId);
      const done = ex?.sets.filter((x) => x.done) ?? [];
      return done.length ? [{ date: s.date, completedAt: s.completedAt!, sets: done }] : [];
    })
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

export function formatSet(s: LoggedSet): string {
  if (s.weightKg && s.reps) return `${trimNum(s.weightKg)} kg × ${s.reps}`;
  if (s.reps) return `${s.reps} reps`;
  return '—';
}

export function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export interface StrengthTrend {
  exerciseId: string;
  first: number;
  latest: number;
  change: number;
}

/** First vs latest best e1RM for each weighted exercise in the given sessions. */
export function strengthTrends(sessions: WorkoutSession[]): StrengthTrend[] {
  const byEx = new Map<string, { at: string; e1rm: number }[]>();
  for (const s of sessions) {
    if (!s.completedAt) continue;
    for (const ex of s.exercises) {
      const best = bestSet(ex.sets);
      if (!best?.weightKg || !best.reps) continue;
      const list = byEx.get(ex.exerciseId) ?? [];
      list.push({ at: s.completedAt, e1rm: estimate1RM(best.weightKg, best.reps) });
      byEx.set(ex.exerciseId, list);
    }
  }
  const trends: StrengthTrend[] = [];
  byEx.forEach((list, exerciseId) => {
    list.sort((a, b) => a.at.localeCompare(b.at));
    const first = list[0].e1rm;
    const latest = list[list.length - 1].e1rm;
    trends.push({ exerciseId, first, latest, change: latest - first });
  });
  return trends.sort((a, b) => b.latest - a.latest);
}
