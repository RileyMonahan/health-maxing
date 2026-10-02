import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId, nowIso } from '@/domain/ids';
import type { DateKey, Food, FoodLogEntry, MealType } from '@/domain/models';
import { appStorage, STORAGE_PREFIX } from '@/services/storage';

interface NutritionState {
  entries: FoodLogEntry[];
  customFoods: Food[];
  addEntry: (args: { date: DateKey; meal: MealType; food: Food; servings: number }) => void;
  updateEntry: (id: string, patch: Partial<Pick<FoodLogEntry, 'servings' | 'meal'>>) => void;
  removeEntry: (id: string) => void;
  addCustomFood: (food: Omit<Food, 'id' | 'source'>) => Food;
  reset: () => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      entries: [],
      customFoods: [],
      addEntry: ({ date, meal, food, servings }) =>
        set({ entries: [...get().entries, { id: createId('fl_'), date, meal, food, servings, createdAt: nowIso() }] }),
      updateEntry: (id, patch) => set({ entries: get().entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) }),
      removeEntry: (id) => set({ entries: get().entries.filter((e) => e.id !== id) }),
      addCustomFood: (food) => {
        const created: Food = { ...food, id: createId('food_'), source: 'custom' };
        set({ customFoods: [created, ...get().customFoods] });
        return created;
      },
      reset: () => set({ entries: [], customFoods: [] }),
    }),
    { name: `${STORAGE_PREFIX}nutrition`, storage: appStorage, version: 1 },
  ),
);

/** Most recently logged distinct foods, newest first. */
export function recentFoods(entries: FoodLogEntry[], limit = 8): Food[] {
  const seen = new Set<string>();
  const out: Food[] = [];
  for (let i = entries.length - 1; i >= 0 && out.length < limit; i--) {
    const f = entries[i].food;
    if (!seen.has(f.id)) {
      seen.add(f.id);
      out.push(f);
    }
  }
  return out;
}
