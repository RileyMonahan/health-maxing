// Core data models. Records are flat and keyed by id (or date) so each
// collection maps directly onto a database table later (see docs/PLAN.md).

/** Monday = 0 … Sunday = 6 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

/** Local calendar date, YYYY-MM-DD */
export type DateKey = string;

export type GoalId =
  | 'build_muscle'
  | 'lose_fat'
  | 'strength'
  | 'energy'
  | 'sleep'
  | 'athleticism'
  | 'habits';

export type Experience = 'beginner' | 'intermediate' | 'advanced';

export type TrainingPlanId = 'performance' | 'balanced' | 'simple';
export type NutritionPlanId = 'structured' | 'balanced' | 'flexible';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  goals: GoalId[];
  experience: Experience;
  nutritionPreference: NutritionPlanId;
  baselineEnergy: number;
  typicalSleepHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface Targets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  stepsGoal: number;
  sleepGoalHours: number;
  /** true once the user overrides the calculated numbers */
  custom: boolean;
}

export type Schedule = Record<Weekday, string | null>;

// ---- Training content ----

export type ExerciseKind = 'strength' | 'bodyweight' | 'cardio' | 'mobility';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  kind: ExerciseKind;
}

export interface PlannedExercise {
  exerciseId: string;
  sets: number;
  /** e.g. "8", "8-10", "30s", "10 min" */
  reps: string;
  restSec: number;
  trackRir: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  focus: string;
  estMinutes: number;
  exercises: PlannedExercise[];
}

export interface TrainingPlan {
  id: TrainingPlanId;
  name: string;
  tagline: string;
  description: string;
  minDays: number;
  maxDays: number;
  defaultDays: number;
  workouts: WorkoutTemplate[];
  /** days per week → workout ids in weekly order */
  rotations: Record<number, string[]>;
}

// ---- Nutrition content ----

export interface NutritionPlan {
  id: NutritionPlanId;
  name: string;
  tagline: string;
  description: string;
  principles: string[];
  exampleDay: string[];
  proteinPerKg: number;
  fatPct: number;
}

// ---- User records ----

export interface LoggedSet {
  weightKg?: number;
  reps?: number;
  rir?: number;
  done: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  completed: boolean;
  sets: LoggedSet[];
}

export interface WorkoutSession {
  id: string;
  date: DateKey;
  templateId: string;
  planId: TrainingPlanId;
  startedAt: string;
  completedAt?: string;
  exercises: LoggedExercise[];
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
export const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export interface Food {
  id: string;
  name: string;
  brand?: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  barcode?: string;
  source: 'sample' | 'custom' | 'api';
}

export interface FoodLogEntry {
  id: string;
  date: DateKey;
  meal: MealType;
  servings: number;
  /** snapshot of the food at log time, so history never changes */
  food: Food;
  createdAt: string;
}

export interface DailyLog {
  date: DateKey;
  energy?: number;
  sleepHours?: number;
  sleepQuality?: number;
  steps?: number;
  weightKg?: number;
  updatedAt: string;
}

export interface ProgressPhoto {
  id: string;
  date: DateKey;
  uri: string;
  createdAt: string;
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
}

export interface CoachMessage {
  id: string;
  sender: 'client' | 'coach';
  body: string;
  createdAt: string;
  status: 'sending' | 'sent' | 'failed';
}

export interface NotificationPrefs {
  checkIn: boolean;
  workout: boolean;
  meals: boolean;
  coach: boolean;
}

export interface Macros {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}
