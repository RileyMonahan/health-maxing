import { SAMPLE_FOODS } from '@/content/sampleFoods';
import type { Food } from '@/domain/models';
import type { FoodService } from './FoodService';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockFoodService implements FoodService {
  readonly name = 'Sample foods';
  readonly isMock = true;

  constructor(private foods: Food[] = SAMPLE_FOODS, private latencyMs = 250) {}

  async search(query: string, opts?: { limit?: number }): Promise<Food[]> {
    await wait(this.latencyMs);
    const q = query.trim().toLowerCase();
    const limit = opts?.limit ?? 25;
    if (!q) return this.foods.slice(0, limit);
    const terms = q.split(/\s+/);
    return this.foods
      .filter((f) => terms.every((t) => `${f.name} ${f.brand ?? ''}`.toLowerCase().includes(t)))
      .slice(0, limit);
  }

  async getByBarcode(barcode: string): Promise<Food | null> {
    await wait(this.latencyMs * 2);
    return this.foods.find((f) => f.barcode === barcode.trim()) ?? null;
  }
}
