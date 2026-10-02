import type { Food } from '@/domain/models';

/**
 * Contract for any food database. V1 uses MockFoodService; a real provider
 * (Open Food Facts, Nutritionix, FatSecret…) implements the same interface and
 * is switched in services/index.ts. Results are normalised to `Food`, with
 * macros per one serving.
 */
export interface FoodService {
  readonly name: string;
  /** true while the service is a placeholder, so the UI can say so */
  readonly isMock: boolean;
  search(query: string, opts?: { limit?: number; signal?: AbortSignal }): Promise<Food[]>;
  getByBarcode(barcode: string): Promise<Food | null>;
}
