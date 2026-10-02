# Health Maxing: V1 Plan

Simple on the surface, powerful underneath. Every screen has one job.

This document covers the five things the brief asked for before building:
architecture, navigation, data models, component structure and the development plan.

---

## 1. Architecture

React Native + Expo (SDK 57), TypeScript, Expo Router for navigation.

```
┌───────────────────────────────────────────────────────────┐
│ UI          src/app (routes)  +  src/components, features │  screens only render and dispatch
├───────────────────────────────────────────────────────────┤
│ State       src/store  (Zustand stores, persisted)        │  the app's single source of truth
├───────────────────────────────────────────────────────────┤
│ Domain      src/domain (pure TypeScript, no React)        │  scores, targets, schedules, streaks
├───────────────────────────────────────────────────────────┤
│ Content     src/content (plans, exercises, sample foods)  │  editable config, no logic
├───────────────────────────────────────────────────────────┤
│ Services    src/services (interfaces + adapters)          │  food database, coach messaging, storage
└───────────────────────────────────────────────────────────┘
```

Rules that keep it clean:

1. **Screens never talk to external systems directly.** They go through a store
   or a service interface.
2. **Domain logic is pure.** Health score, calorie targets, streaks, schedules and
   strength trends are plain functions in `src/domain`, so they are testable and
   can move to a server later unchanged.
3. **Plans are data, not code.** Training plans, nutrition plans, exercises and
   sample foods live in `src/content`. Adding or editing a plan is editing one file.
4. **External features sit behind adapters.** Each has an interface and a mock:
   - `FoodService`: `search`, `getByBarcode`. V1 uses `MockFoodService` (sample
     foods, simulated latency). A real API (Open Food Facts, Nutritionix, FatSecret,
     etc.) is a new class implementing the same interface, switched in
     `src/services/index.ts`.
   - `CoachService`: `getCoach`, `listMessages`, `sendMessage`, `subscribe`. V1 uses
     `MockCoachService` (messages stored on device, a demo auto-reply). A real
     backend (Supabase Realtime, Stream, Sendbird, etc.) implements the same four
     methods; the chat UI does not change.
5. **Persistence is table-shaped.** Every stored record is a flat object with an
   `id` (or a natural key such as `date`) and timestamps, matching how it would sit
   in a Postgres table. Stores persist through one `storage` adapter (AsyncStorage
   today).

### Moving to Supabase later

| Local store key | Future table | Key |
|---|---|---|
| `profile` | `profiles` | `user_id` |
| `plan` (selection, schedule, targets) | `user_plans` | `user_id` |
| `workouts.sessions` | `workout_sessions` (+ `workout_sets`) | `id` |
| `nutrition.entries` | `food_log_entries` | `id` |
| `nutrition.customFoods` | `foods` (source = custom) | `id` |
| `daily.logs` | `daily_logs` | `user_id, date` |
| `daily.photos` | `progress_photos` (+ Storage bucket) | `id` |
| coach messages | `messages` (+ Realtime channel) | `id` |

Migration path: add Supabase Auth, then a sync layer that pushes and pulls each
collection (or swap store actions to call a repository). Because records already
have stable ids and timestamps, nothing in the UI changes.

Not built in V1 (by design): real food database, real barcode lookup, real coach
backend, Apple Health / Health Connect. The manual entry for steps and sleep is
the seam where a health sync would write the same `daily_logs` fields.

---

## 2. Navigation

```
Root Stack (src/app/_layout.tsx)
├── onboarding/                 first launch only, one question per screen
│   ├── index                   questions (name → … → sleep)
│   └── plan                    recommended training + nutrition plan, can change
├── (tabs)                      bottom tabs: Home | Tracking | Progress | Coach
│   ├── index                   Home: score, energy/sleep/movement, today's tasks, streak
│   ├── tracking/               nested Stack
│   │   ├── index               hub: Workout card, Nutrition card, This Week
│   │   ├── workout             week strip, Adjust Plan, today's workout, Start
│   │   └── nutrition           calories, macros, meals, Search / Scan / Add
│   ├── progress                weight, streak, range, trend chart, consistency, strength, photos
│   └── coach                   chat with coaching team, "Support: 8am–8pm"
├── check-in                    modal: energy 1–10, sleep hours + quality, steps
├── log-weight                  modal: today's weight
├── workout/session             full-screen active workout logger
├── workout/adjust              modal: plan, days per week, which days, move workouts
├── workout/exercise/[id]       exercise history and best set
├── nutrition/search            modal: search foods (FoodService)
├── nutrition/scan              modal: barcode placeholder (FoodService.getByBarcode)
├── nutrition/quick-add         modal: create a custom food
├── nutrition/food              modal: servings + meal, then add
├── nutrition/meal/[meal]       one meal's foods, remove, add more
└── profile/                    from the avatar button on every tab
    ├── index                   settings list
    ├── personal                name, age, height, weight, goal weight
    ├── goals                   main goals, experience
    ├── plans                   training plan and nutrition plan
    ├── targets                 calories and macros (auto or custom)
    └── notifications           reminder toggles
```

Profile is reached from the avatar in the header, not a fifth tab, to keep the
four tabs from the brief.

---

## 3. Data models

All in `src/domain/models.ts`. Dates are `YYYY-MM-DD` strings in the user's local
time; timestamps are ISO strings.

```ts
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Mon = 0
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface UserProfile {
  id; name; age; heightCm; weightKg; goalWeightKg;
  goals: GoalId[];               // build_muscle, lose_fat, strength, energy, sleep, athleticism, habits
  experience: 'beginner' | 'intermediate' | 'advanced';
  nutritionPreference: NutritionPlanId;
  baselineEnergy: number;        // 1–10 from onboarding
  typicalSleepHours: number;
  createdAt; updatedAt;
}

interface PlanState {             // what the user is following
  trainingPlanId: TrainingPlanId;
  nutritionPlanId: NutritionPlanId;
  schedule: Record<Weekday, WorkoutTemplateId | null>;  // explicit, so workouts can be moved
  targets: { calories; proteinG; carbsG; fatG; stepsGoal; sleepGoalHours; custom: boolean };
}

// Content (editable)
interface TrainingPlan {
  id; name; tagline; description; minDays; maxDays; defaultDays;
  workouts: WorkoutTemplate[];
  rotations: Record<number, WorkoutTemplateId[]>; // days/week → workouts in order
}
interface WorkoutTemplate { id; name; focus; estMinutes; exercises: PlannedExercise[] }
interface PlannedExercise { exerciseId; sets; reps: string; restSec; trackRir: boolean }
interface Exercise { id; name; muscle; equipment; kind: 'strength' | 'bodyweight' | 'cardio' | 'mobility' }
interface NutritionPlan {
  id; name; tagline; description; principles: string[]; exampleDay: string[];
  proteinPerKg; fatPct;           // drives target calculation
}

// User records
interface WorkoutSession {
  id; date; templateId; planId; startedAt; completedAt?;
  exercises: { exerciseId; completed: boolean; sets: LoggedSet[] }[];
}
interface LoggedSet { weightKg?: number; reps?: number; rir?: number; done: boolean }

interface Food {                  // what FoodService returns
  id; name; brand?; servingLabel; calories; proteinG; carbsG; fatG;
  barcode?; source: 'sample' | 'custom' | 'api';
}
interface FoodLogEntry {
  id; date; meal: MealType; servings;
  food: Food;                     // snapshot, so later API changes never alter history
  createdAt;
}

interface DailyLog {              // one row per day, quick check-in data
  date; energy?; sleepHours?; sleepQuality?; steps?; weightKg?; updatedAt;
}
interface ProgressPhoto { id; date; uri; createdAt }

interface Coach { id; name; role; initials; bio }
interface CoachMessage {
  id; sender: 'client' | 'coach'; body; createdAt;
  status: 'sending' | 'sent' | 'failed';
}

interface NotificationPrefs { checkIn: boolean; workout: boolean; meals: boolean }
```

### Derived numbers (src/domain)

- **Calorie target**: Mifflin-St Jeor BMR × activity factor (from training days),
  then −400 kcal if goal weight is below current, +250 if above. Protein from the
  nutrition plan (g/kg), fat as % of calories, carbs fill the rest. Users can
  override in Profile → Targets.
- **Energy (x/10)**: average energy rating over the last 7 days.
- **Sleep (x/10)**: 60% hours vs sleep goal, 40% quality rating, last 7 days.
- **Movement (x/10)**: 60% workouts done vs scheduled this week, 40% steps vs goal.
- **Health Maxing score (0–100)**: energy 25%, sleep 25%, movement 25%, nutrition
  consistency 25%.
- **Nutrition consistency**: days in range where calories are within ±10% of target
  and protein reached 90% of target.
- **Training consistency**: completed sessions ÷ scheduled sessions in range.
- **Streak**: consecutive days with any check-in, logged food or completed workout.
  Today counts once something is logged; an empty today does not break it.
- **Strength trend**: best estimated 1RM (Epley) per exercise, first vs latest in range.

---

## 4. Component structure

```
src/
  app/                    routes only (see Navigation)
  theme/                  colors, spacing, radius, typography, shadows
  components/
    ui/                   Screen, AppHeader, Card, Button, IconBadge, ProgressBar,
                          Ring, StatTile, ListRow, SegmentedControl, Chip,
                          RatingScale, Stepper, NumberField, TextField, SectionHeader,
                          WeekDots, EmptyState
    charts/               LineChart (SVG, gradient fill)
  features/
    onboarding/           question steps, plan recommendation card
    home/                 ScoreCard, MetricTiles, TodayTasks, StreakCard
    tracking/             TrackingCard, WeekSummary
    workout/              WeekStrip, TodayWorkoutCard, ExerciseRow, SetRow
    nutrition/            CaloriesCard, MacroTiles, MealList, FoodRow, LogFoodActions
    progress/             RangeTabs, TrendCard, ConsistencyTiles, StrengthList, PhotoStrip
    coach/                CoachHeader, MessageBubble, Composer
  store/                  profile, plan, workouts, nutrition, daily (Zustand + persist)
  domain/                 models, dates, targets, scoring, streak, schedule, strength
  content/                trainingPlans, nutritionPlans, exercises, sampleFoods
  services/
    storage.ts            persistence adapter (AsyncStorage)
    food/                 FoodService interface, MockFoodService
    coach/                CoachService interface, MockCoachService
    index.ts              picks the implementation (mock today)
```

Design tokens (from the mockups): background `#F7FAFD`, cards white with 20–24px
radius and a soft blue-grey shadow, brand blue `#2E9BF0`, light blue tint `#EAF5FE`,
yellow highlight `#FFC93C` (streaks and small accents only), text `#0B1220`,
secondary text `#6B7785`.

---

## 5. Development plan

| # | Milestone | Status |
|---|---|---|
| 1 | Scaffold: Expo Router, theme, UI kit, storage, stores | Done |
| 2 | Content: 3 training plans, exercise library, 3 nutrition plans, sample foods | Done |
| 3 | Onboarding questions → plan recommendation → targets | Done |
| 4 | Home: score, tiles, today's tasks, streak; daily check-in modal | Done |
| 5 | Tracking hub + This Week summary | Done |
| 6 | Workout tracking: week strip, Adjust Plan, active session logger, history | Done |
| 7 | Nutrition tracking: macros, meals, search / scan / quick add (mock services) | Done |
| 8 | Progress: ranges, trend chart, consistency, strength, photos, weight log | Done |
| 9 | Coach chat on the CoachService mock | Done |
| 10 | Profile and settings | Done |
| 11 | Real food API adapter + barcode camera | Next |
| 12 | Supabase auth + sync, real coach messaging, coach-side app | Next |
| 13 | Apple Health / Health Connect for steps and sleep; push reminders | Later |

Out of scope for V1 on purpose: social features, AI meal photo logging, wearables,
in-app purchases. Add only when they earn their place.
