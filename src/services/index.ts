import { MockCoachService } from './coach/MockCoachService';
import type { CoachService } from './coach/CoachService';
import { MockFoodService } from './food/MockFoodService';
import type { FoodService } from './food/FoodService';

// The one place that decides which implementation the app uses.
// Replace a mock with a real adapter here when the backend is ready.
export const foodService: FoodService = new MockFoodService();
export const coachService: CoachService & { clear?: () => Promise<void> } = new MockCoachService();

export type { CoachService, FoodService };
