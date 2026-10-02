import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId, nowIso } from '@/domain/ids';
import type { LoggedSet, TrainingPlanId, WorkoutSession, WorkoutTemplate } from '@/domain/models';
import { bestSet, exerciseHistory } from '@/domain/strength';
import { appStorage, STORAGE_PREFIX } from '@/services/storage';

interface WorkoutState {
  sessions: WorkoutSession[];
  /** The workout in progress, kept so leaving the screen never loses sets. */
  active: WorkoutSession | null;
  start: (template: WorkoutTemplate, planId: TrainingPlanId, date: string) => void;
  updateSet: (exIndex: number, setIndex: number, patch: Partial<LoggedSet>) => void;
  addSet: (exIndex: number) => void;
  removeSet: (exIndex: number, setIndex: number) => void;
  toggleExercise: (exIndex: number) => void;
  finish: () => WorkoutSession | null;
  discard: () => void;
  deleteSession: (id: string) => void;
  reset: () => void;
}

/** Prefill a new session from the last time each exercise was done. */
function buildSession(template: WorkoutTemplate, planId: TrainingPlanId, date: string, history: WorkoutSession[]): WorkoutSession {
  return {
    id: createId('ws_'),
    date,
    templateId: template.id,
    planId,
    startedAt: nowIso(),
    exercises: template.exercises.map((pe) => {
      const last = exerciseHistory(history, pe.exerciseId)[0];
      const repsTarget = parseInt(pe.reps, 10);
      return {
        exerciseId: pe.exerciseId,
        completed: false,
        sets: Array.from({ length: pe.sets }, (_, i) => {
          const prev = last?.sets[i] ?? last?.sets[last.sets.length - 1];
          return {
            weightKg: prev?.weightKg,
            reps: prev?.reps ?? (Number.isFinite(repsTarget) && !/[a-z]/i.test(pe.reps) ? repsTarget : undefined),
            rir: undefined,
            done: false,
          };
        }),
      };
    }),
  };
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => {
      const patchActive = (fn: (s: WorkoutSession) => WorkoutSession) => {
        const a = get().active;
        if (a) set({ active: fn(a) });
      };
      const patchExercise = (exIndex: number, fn: (e: WorkoutSession['exercises'][number]) => WorkoutSession['exercises'][number]) =>
        patchActive((s) => ({ ...s, exercises: s.exercises.map((e, i) => (i === exIndex ? fn(e) : e)) }));

      return {
        sessions: [],
        active: null,

        start: (template, planId, date) => {
          if (get().active?.templateId === template.id) return;
          set({ active: buildSession(template, planId, date, get().sessions) });
        },

        updateSet: (exIndex, setIndex, patch) =>
          patchExercise(exIndex, (e) => {
            const sets = e.sets.map((s, i) => (i === setIndex ? { ...s, ...patch } : s));
            return { ...e, sets, completed: sets.every((s) => s.done) };
          }),

        addSet: (exIndex) =>
          patchExercise(exIndex, (e) => {
            const last = e.sets[e.sets.length - 1];
            return { ...e, completed: false, sets: [...e.sets, { weightKg: last?.weightKg, reps: last?.reps, done: false }] };
          }),

        removeSet: (exIndex, setIndex) =>
          patchExercise(exIndex, (e) => (e.sets.length <= 1 ? e : { ...e, sets: e.sets.filter((_, i) => i !== setIndex) })),

        toggleExercise: (exIndex) =>
          patchExercise(exIndex, (e) => {
            const completed = !e.completed;
            return { ...e, completed, sets: e.sets.map((s) => ({ ...s, done: completed })) };
          }),

        finish: () => {
          const a = get().active;
          if (!a) return null;
          const done: WorkoutSession = { ...a, completedAt: nowIso() };
          set({ sessions: [...get().sessions, done], active: null });
          return done;
        },

        discard: () => set({ active: null }),
        deleteSession: (id) => set({ sessions: get().sessions.filter((s) => s.id !== id) }),
        reset: () => set({ sessions: [], active: null }),
      };
    },
    { name: `${STORAGE_PREFIX}workouts`, storage: appStorage, version: 1 },
  ),
);

export function lastPerformance(sessions: WorkoutSession[], exerciseId: string) {
  const last = exerciseHistory(sessions, exerciseId)[0];
  if (!last) return null;
  return { date: last.date, best: bestSet(last.sets), sets: last.sets };
}
