import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId, nowIso } from '@/domain/ids';
import type { DailyLog, DateKey, ProgressPhoto } from '@/domain/models';
import { appStorage, STORAGE_PREFIX } from '@/services/storage';

interface DailyState {
  logs: Record<DateKey, DailyLog>;
  photos: ProgressPhoto[];
  upsertLog: (date: DateKey, patch: Partial<Omit<DailyLog, 'date' | 'updatedAt'>>) => void;
  addPhoto: (date: DateKey, uri: string) => void;
  removePhoto: (id: string) => void;
  reset: () => void;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      logs: {},
      photos: [],
      upsertLog: (date, patch) =>
        set({ logs: { ...get().logs, [date]: { ...get().logs[date], ...patch, date, updatedAt: nowIso() } } }),
      addPhoto: (date, uri) => set({ photos: [...get().photos, { id: createId('ph_'), date, uri, createdAt: nowIso() }] }),
      removePhoto: (id) => set({ photos: get().photos.filter((p) => p.id !== id) }),
      reset: () => set({ logs: {}, photos: [] }),
    }),
    { name: `${STORAGE_PREFIX}daily`, storage: appStorage, version: 1 },
  ),
);

/** Latest logged weight, falling back to the onboarding weight. */
export function currentWeight(logs: Record<DateKey, DailyLog>, fallback: number): number {
  const dates = Object.keys(logs).filter((d) => logs[d].weightKg != null).sort();
  return dates.length ? logs[dates[dates.length - 1]].weightKg! : fallback;
}
