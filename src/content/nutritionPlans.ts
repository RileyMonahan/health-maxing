import type { NutritionPlan, NutritionPlanId } from '@/domain/models';

// Nutrition approaches. All three support health and results; they differ in
// how strict and involved the user wants to be. Edit freely.

export const NUTRITION_PLANS: Record<NutritionPlanId, NutritionPlan> = {
  structured: {
    id: 'structured',
    name: 'Structured',
    tagline: 'Whole foods, set meals',
    description: 'Mostly whole, single-ingredient foods with a consistent meal structure. The most disciplined option.',
    principles: [
      '3 meals and 1 snack at similar times each day',
      'Protein and vegetables at every meal',
      'Whole-food carbs: rice, potatoes, oats, fruit',
      'Treats kept for one planned meal a week',
    ],
    exampleDay: ['Oats, whey and berries', 'Chicken, rice and greens', 'Salmon, potatoes and vegetables', 'Greek yogurt and fruit'],
    proteinPerKg: 2.2,
    fatPct: 0.25,
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced',
    tagline: 'Mostly whole foods, some flexibility',
    description: 'Around 80% whole foods with room for variety, eating out and foods you enjoy.',
    principles: [
      'About 80% whole foods, 20% whatever you enjoy',
      'Hit your protein target every day',
      'Fruit or vegetables with most meals',
      'Eating out is fine, just log it',
    ],
    exampleDay: ['Eggs on toast and fruit', 'Chicken burrito bowl', 'Steak, rice and salad', 'Protein bar or yogurt'],
    proteinPerKg: 2.0,
    fatPct: 0.28,
  },
  flexible: {
    id: 'flexible',
    name: 'Flexible',
    tagline: 'Calories and protein first',
    description: 'Hit calories and protein and cover the basics. Pizza, pasta and normal meals can still fit.',
    principles: [
      'Stay close to your calorie target',
      'Reach your protein target',
      'Two servings of fruit or vegetables a day',
      'Any food can fit when the numbers work',
    ],
    exampleDay: ['Bagel with eggs', 'Chicken wrap and fruit', 'Pizza with a side salad', 'Protein shake'],
    proteinPerKg: 1.8,
    fatPct: 0.3,
  },
};

export const NUTRITION_PLAN_ORDER: NutritionPlanId[] = ['structured', 'balanced', 'flexible'];
