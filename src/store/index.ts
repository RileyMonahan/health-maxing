import { useEffect, useState } from 'react';
import { coachService } from '@/services';
import { useDailyStore } from './daily';
import { useNutritionStore } from './nutrition';
import { usePlanStore } from './plan';
import { useProfileStore } from './profile';
import { useWorkoutStore } from './workouts';

export { useDailyStore, useNutritionStore, usePlanStore, useProfileStore, useWorkoutStore };

const STORES = [useProfileStore, usePlanStore, useWorkoutStore, useNutritionStore, useDailyStore];

/** true once every persisted store has loaded from device storage. */
export function useHydrated(): boolean {
  const [ready, setReady] = useState(() => STORES.every((s) => s.persist.hasHydrated()));
  useEffect(() => {
    if (ready) return;
    const check = () => STORES.every((s) => s.persist.hasHydrated()) && setReady(true);
    const unsubs = STORES.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubs.forEach((u) => u());
  }, [ready]);
  return ready;
}

/** Wipe all local data (Profile → Account → Reset). */
export async function resetAllData() {
  useWorkoutStore.getState().reset();
  useNutritionStore.getState().reset();
  useDailyStore.getState().reset();
  usePlanStore.getState().reset();
  useProfileStore.getState().reset();
  await coachService.clear?.();
}
