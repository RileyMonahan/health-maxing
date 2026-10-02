/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addDays, startOfWeek, weekdayOf } from '../dates';
import type { FoodLogEntry, Schedule, Targets, TrainingPlan, WorkoutSession } from '../models';
import { buildSchedule, nextTrainingDay, swapDays } from '../schedule';
import { energyScore, healthScore, isNutritionDayOnTarget, movementScore, sleepScore } from '../scoring';
import { activeDates, currentStreak } from '../streak';
import { estimate1RM, strengthTrends } from '../strength';
import { calculateTargets, sumMacros } from '../targets';

const targets: Targets = { calories: 2500, proteinG: 160, carbsG: 300, fatG: 70, stepsGoal: 8000, sleepGoalHours: 8, custom: false };
const plan: TrainingPlan = {
  id: 'balanced', name: 'B', tagline: '', description: '', minDays: 3, maxDays: 4, defaultDays: 3,
  workouts: [], rotations: { 3: ['a', 'b', 'c'], 4: ['a', 'b', 'c', 'd'] },
};

test('dates: weekday is Monday-based and weeks start Monday', () => {
  assert.equal(weekdayOf('2026-10-05'), 0); // Monday
  assert.equal(weekdayOf('2026-10-04'), 6); // Sunday
  assert.equal(startOfWeek('2026-10-04'), '2026-09-28');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});

test('targets: deficit when goal weight is lower, protein from plan', () => {
  const t = calculateTargets({ weightKg: 80, heightCm: 180, age: 25, goalWeightKg: 75, typicalSleepHours: 8 }, 3, { proteinPerKg: 2, fatPct: 0.25 });
  // BMR 1805 × 1.5 = 2707.5 − 400 → 2310
  assert.equal(t.calories, 2310);
  assert.equal(t.proteinG, 160);
  assert.ok(Math.abs(t.proteinG * 4 + t.carbsG * 4 + t.fatG * 9 - t.calories) < 10);
});

test('schedule: rotation assigned to chosen days and swapping moves workouts', () => {
  const s = buildSchedule(plan, [4, 0, 2]);
  assert.deepEqual([s[0], s[2], s[4], s[1]], ['a', 'b', 'c', null]);
  const moved = swapDays(s, 0, 1);
  assert.equal(moved[0], null);
  assert.equal(moved[1], 'a');
  assert.equal(nextTrainingDay(s, 4), 0);
});

test('scores: energy and sleep average the last 7 days', () => {
  const today = '2026-10-07';
  const logs = {
    '2026-10-06': { date: '2026-10-06', energy: 6, sleepHours: 8, sleepQuality: 10, updatedAt: '' },
    '2026-10-07': { date: '2026-10-07', energy: 8, sleepHours: 4, sleepQuality: 5, updatedAt: '' },
    '2026-09-01': { date: '2026-09-01', energy: 1, updatedAt: '' },
  };
  assert.equal(energyScore({ today, logs }), 7);
  // night 1: 10*(0.6*1 + 0.4*1)=10, night 2: 10*(0.6*0.5+0.4*0.5)=5 → 7.5
  assert.equal(sleepScore({ today, logs, targets }), 7.5);
});

test('scores: movement blends workouts this week and steps', () => {
  const today = '2026-10-07'; // Wednesday
  const schedule: Schedule = { 0: 'a', 1: null, 2: 'b', 3: null, 4: 'c', 5: null, 6: null };
  const sessions: WorkoutSession[] = [{ id: '1', date: '2026-10-05', templateId: 'a', planId: 'balanced', startedAt: '', completedAt: 'x', exercises: [] }];
  const logs = { [today]: { date: today, steps: 8000, updatedAt: '' } };
  // Monday done (1/1); today's workout isn't counted until done; steps on goal → 10
  assert.equal(movementScore({ today, logs, sessions, entries: [], schedule, targets }), 10);
  // Monday missed: workouts 0/1, steps 1 → 10*(0 + 0.4) = 4
  assert.equal(movementScore({ today, logs, sessions: [], entries: [], schedule, targets }), 4);
  // Joined today: Monday doesn't count against them, only steps → 10
  assert.equal(movementScore({ today, logs, sessions: [], entries: [], schedule, targets, since: today }), 10);
  assert.equal(healthScore({ today, logs: {}, sessions: [], entries: [], schedule: { ...schedule, 0: null, 2: null }, targets }), null);
});

test('nutrition: on target within 10% calories and 90% protein', () => {
  const food = { id: 'f', name: 'f', servingLabel: '', calories: 1250, proteinG: 75, carbsG: 0, fatG: 0, source: 'sample' as const };
  const entries: FoodLogEntry[] = [
    { id: '1', date: 'd', meal: 'lunch', servings: 2, food, createdAt: '' },
  ];
  assert.equal(sumMacros(entries).calories, 2500);
  assert.equal(isNutritionDayOnTarget(entries, 'd', targets), true);
  assert.equal(isNutritionDayOnTarget(entries, 'other', targets), false);
});

test('streak counts back from today, tolerating an empty today', () => {
  const entries: FoodLogEntry[] = ['2026-10-04', '2026-10-05', '2026-10-06'].map((date, i) => ({
    id: String(i), date, meal: 'lunch', servings: 1, createdAt: '',
    food: { id: 'f', name: 'f', servingLabel: '', calories: 1, proteinG: 0, carbsG: 0, fatG: 0, source: 'sample' },
  }));
  const active = activeDates({}, entries, []);
  assert.equal(currentStreak(active, '2026-10-07'), 3);
  assert.equal(currentStreak(active, '2026-10-08'), 0);
});

test('strength: Epley e1RM and first-vs-latest trend', () => {
  assert.equal(estimate1RM(100, 1), 100);
  assert.ok(Math.abs(estimate1RM(100, 10) - 133.33) < 0.01);
  const mk = (id: string, at: string, kg: number): WorkoutSession => ({
    id, date: at.slice(0, 10), templateId: 't', planId: 'simple', startedAt: at, completedAt: at,
    exercises: [{ exerciseId: 'bench', completed: true, sets: [{ weightKg: kg, reps: 5, done: true }] }],
  });
  const [t] = strengthTrends([mk('2', '2026-10-08T10:00:00Z', 90), mk('1', '2026-10-01T10:00:00Z', 80)]);
  assert.equal(t.exerciseId, 'bench');
  assert.ok(t.change > 0);
});
