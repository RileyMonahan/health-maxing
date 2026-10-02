import type { IconName } from '@/components/ui';
import type { Food, MealType } from '@/domain/models';

export const MEAL_LABEL: Record<MealType, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' };

export const MEAL_ICON: Record<MealType, IconName> = {
  breakfast: 'coffee-outline',
  lunch: 'food-variant',
  dinner: 'silverware-fork-knife',
  snacks: 'food-apple-outline',
};

export function defaultMeal(now: Date = new Date()): MealType {
  const h = now.getHours();
  if (h < 11) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 18) return 'snacks';
  return 'dinner';
}

export function isMealType(v: unknown): v is MealType {
  return v === 'breakfast' || v === 'lunch' || v === 'dinner' || v === 'snacks';
}

// Foods selected in search/scan are held here so the detail screen can read
// them without re-fetching (real API results won't be addressable by id).
const cache = new Map<string, Food>();
export const foodCache = {
  put: (foods: Food[]) => foods.forEach((f) => cache.set(f.id, f)),
  get: (id: string) => cache.get(id),
};
