import type { Food } from '@/domain/models';

// Sample foods used by MockFoodService until a real food database is connected.
// Barcodes are made up so the scanner placeholder has something to find.

type Row = [id: string, name: string, serving: string, kcal: number, p: number, c: number, f: number, barcode?: string, brand?: string];

const rows: Row[] = [
  ['oats', 'Rolled Oats', '50 g', 190, 6.5, 33, 3.5, '5000000000011'],
  ['banana', 'Banana', '1 medium', 105, 1.3, 27, 0.4],
  ['blueberries', 'Blueberries', '100 g', 57, 0.7, 14, 0.3],
  ['egg', 'Egg', '1 large', 72, 6.3, 0.4, 4.8],
  ['egg_whites', 'Egg Whites', '100 g', 52, 11, 0.7, 0.2],
  ['toast', 'Wholegrain Toast', '1 slice', 110, 5, 19, 1.5],
  ['bagel', 'Plain Bagel', '1 bagel', 270, 10, 53, 1.5],
  ['greek_yogurt', 'Greek Yogurt 0%', '170 g', 100, 17, 6, 0.7, '5000000000028', 'Fage'],
  ['whey', 'Whey Protein', '1 scoop (30 g)', 120, 24, 3, 1.5, '5000000000035', 'Optimum'],
  ['milk', 'Semi-skimmed Milk', '250 ml', 125, 8.5, 12, 4.5],
  ['peanut_butter', 'Peanut Butter', '1 tbsp (16 g)', 95, 4, 3, 8, '5000000000042'],
  ['chicken_breast', 'Chicken Breast', '150 g cooked', 248, 46, 0, 5.4],
  ['white_rice', 'White Rice', '150 g cooked', 195, 4, 43, 0.4],
  ['brown_rice', 'Brown Rice', '150 g cooked', 168, 3.9, 35, 1.3],
  ['salmon', 'Salmon Fillet', '140 g', 290, 30, 0, 18],
  ['quinoa', 'Quinoa', '150 g cooked', 180, 6.6, 32, 2.9],
  ['steak', 'Sirloin Steak', '170 g cooked', 350, 50, 0, 16],
  ['lean_mince', 'Lean Beef Mince 5%', '125 g', 170, 26, 0, 6.5],
  ['potato', 'Potatoes', '200 g', 154, 4, 35, 0.2],
  ['sweet_potato', 'Sweet Potato', '200 g', 172, 3.2, 40, 0.2],
  ['pasta', 'Pasta', '180 g cooked', 284, 10, 56, 1.6],
  ['broccoli', 'Broccoli', '100 g', 34, 2.8, 7, 0.4],
  ['mixed_salad', 'Mixed Salad', '1 bowl', 25, 1.5, 4, 0.3],
  ['avocado', 'Avocado', '1/2 fruit', 120, 1.5, 6, 11],
  ['olive_oil', 'Olive Oil', '1 tbsp', 119, 0, 0, 13.5],
  ['apple', 'Apple', '1 medium', 95, 0.5, 25, 0.3],
  ['almonds', 'Almonds', '28 g', 164, 6, 6, 14],
  ['tuna', 'Tuna in Water', '1 can (112 g)', 120, 27, 0, 1, '5000000000059'],
  ['cottage_cheese', 'Cottage Cheese', '150 g', 145, 17, 5, 6],
  ['protein_bar', 'Protein Bar', '1 bar (60 g)', 220, 20, 22, 7, '5000000000066', 'Grenade'],
  ['chicken_wrap', 'Chicken Wrap', '1 wrap', 450, 32, 45, 15],
  ['burrito_bowl', 'Chicken Burrito Bowl', '1 bowl', 650, 45, 70, 20],
  ['pizza_slice', 'Pepperoni Pizza', '1 slice', 300, 13, 34, 12],
  ['burger', 'Cheeseburger', '1 burger', 540, 30, 40, 28],
  ['spaghetti_bolognese', 'Spaghetti Bolognese', '1 plate', 620, 35, 75, 18],
  ['sushi', 'Salmon Sushi', '8 pieces', 380, 18, 60, 7],
  ['dark_chocolate', 'Dark Chocolate 70%', '20 g', 120, 1.6, 9, 8.5],
  ['orange_juice', 'Orange Juice', '250 ml', 112, 1.7, 26, 0.5, '5000000000073'],
];

export const SAMPLE_FOODS: Food[] = rows.map(([id, name, servingLabel, calories, proteinG, carbsG, fatG, barcode, brand]) => ({
  id: `sample_${id}`,
  name,
  brand,
  servingLabel,
  calories,
  proteinG,
  carbsG,
  fatG,
  barcode,
  source: 'sample',
}));

export const SAMPLE_BARCODES = SAMPLE_FOODS.filter((f) => f.barcode).map((f) => ({ barcode: f.barcode!, name: f.name }));
