import type { PlannedExercise, TrainingPlan, TrainingPlanId, WorkoutTemplate } from '@/domain/models';

// Training plans are plain data. To add a plan: add a TrainingPlan below and
// register it in TRAINING_PLANS. To edit one: change its workouts or rotations.

const ex = (exerciseId: string, sets: number, reps: string, restSec = 90, trackRir = true): PlannedExercise => ({
  exerciseId,
  sets,
  reps,
  restSec,
  trackRir,
});

// ---- Performance: strength, muscle, engine, mobility, athleticism ----

const performanceWorkouts: WorkoutTemplate[] = [
  {
    id: 'perf_lower_strength',
    name: 'Lower Body Strength',
    focus: 'Heavy legs and posterior chain',
    estMinutes: 60,
    exercises: [
      ex('box_jump', 3, '5', 60, false),
      ex('back_squat', 4, '5', 180),
      ex('romanian_deadlift', 3, '8', 120),
      ex('bulgarian_split_squat', 3, '8', 90),
      ex('hanging_knee_raise', 3, '12', 60, false),
    ],
  },
  {
    id: 'perf_upper_strength',
    name: 'Upper Body Strength',
    focus: 'Heavy press and pull',
    estMinutes: 60,
    exercises: [
      ex('bench_press', 4, '5', 180),
      ex('pull_up', 4, '6-8', 120),
      ex('overhead_press', 3, '6', 120),
      ex('bent_over_row', 3, '8', 90),
      ex('face_pull', 3, '15', 60, false),
    ],
  },
  {
    id: 'perf_athletic',
    name: 'Athletic Full Body',
    focus: 'Power, carries and conditioning',
    estMinutes: 50,
    exercises: [
      ex('med_ball_slam', 4, '6', 60, false),
      ex('trap_bar_deadlift', 4, '4', 150),
      ex('kb_swing', 3, '15', 60, false),
      ex('farmers_carry', 3, '40 m', 90, false),
      ex('sled_push', 4, '20 m', 90, false),
    ],
  },
  {
    id: 'perf_upper_muscle',
    name: 'Upper Body Muscle',
    focus: 'Volume for size',
    estMinutes: 55,
    exercises: [
      ex('incline_db_press', 3, '8-10', 90),
      ex('seated_cable_row', 3, '10-12', 90),
      ex('db_shoulder_press', 3, '10', 90),
      ex('lat_pulldown', 3, '10-12', 90),
      ex('lateral_raise', 3, '15', 45, false),
      ex('db_curl', 2, '12', 45, false),
      ex('triceps_pushdown', 2, '12', 45, false),
    ],
  },
  {
    id: 'perf_conditioning',
    name: 'Conditioning',
    focus: 'Intervals and core',
    estMinutes: 40,
    exercises: [
      ex('intervals', 6, '1 min hard', 90, false),
      ex('walking_lunge', 3, '12', 60),
      ex('dead_bug', 3, '10', 45, false),
      ex('plank', 3, '45s', 45, false),
    ],
  },
  {
    id: 'perf_engine_mobility',
    name: 'Zone 2 + Mobility',
    focus: 'Aerobic base and recovery',
    estMinutes: 50,
    exercises: [ex('zone2_cardio', 1, '35 min', 0, false), ex('mobility_flow', 1, '10 min', 0, false), ex('hip_mobility', 1, '5 min', 0, false)],
  },
];

// ---- Balanced: most of the benefits, less volume ----

const balancedWorkouts: WorkoutTemplate[] = [
  {
    id: 'bal_upper',
    name: 'Upper Body Strength',
    focus: 'Chest, back and shoulders',
    estMinutes: 45,
    exercises: [ex('bench_press', 4, '8'), ex('bent_over_row', 4, '10'), ex('db_shoulder_press', 3, '10'), ex('push_up', 3, '12', 60, false)],
  },
  {
    id: 'bal_lower',
    name: 'Lower Body Strength',
    focus: 'Legs and core',
    estMinutes: 45,
    exercises: [ex('back_squat', 4, '6-8', 150), ex('romanian_deadlift', 3, '10'), ex('walking_lunge', 3, '10'), ex('plank', 3, '40s', 45, false)],
  },
  {
    id: 'bal_full',
    name: 'Full Body + Cardio',
    focus: 'Strength and engine',
    estMinutes: 45,
    exercises: [
      ex('trap_bar_deadlift', 3, '6', 150),
      ex('incline_db_press', 3, '10'),
      ex('lat_pulldown', 3, '10'),
      ex('zone2_cardio', 1, '15 min', 0, false),
    ],
  },
  {
    id: 'bal_upper_b',
    name: 'Upper Body Muscle',
    focus: 'Volume for size',
    estMinutes: 45,
    exercises: [ex('incline_db_press', 3, '10'), ex('pull_up', 3, '6-10'), ex('lateral_raise', 3, '15', 45, false), ex('db_curl', 3, '12', 45, false)],
  },
  {
    id: 'bal_lower_b',
    name: 'Lower Body + Mobility',
    focus: 'Legs and movement quality',
    estMinutes: 45,
    exercises: [ex('trap_bar_deadlift', 3, '6', 150), ex('bulgarian_split_squat', 3, '10'), ex('hip_thrust', 3, '10'), ex('hip_mobility', 1, '8 min', 0, false)],
  },
];

// ---- Simple: a strong foundation in a few short sessions ----

const simpleWorkouts: WorkoutTemplate[] = [
  {
    id: 'simple_a',
    name: 'Full Body A',
    focus: 'Squat, push, pull',
    estMinutes: 35,
    exercises: [ex('goblet_squat', 3, '10'), ex('db_bench_press', 3, '10'), ex('db_row', 3, '10'), ex('plank', 2, '30s', 45, false)],
  },
  {
    id: 'simple_b',
    name: 'Full Body B',
    focus: 'Hinge, press, carry',
    estMinutes: 35,
    exercises: [ex('db_rdl', 3, '10'), ex('db_shoulder_press', 3, '10'), ex('lat_pulldown', 3, '10'), ex('farmers_carry', 2, '30 m', 60, false)],
  },
  {
    id: 'simple_c',
    name: 'Full Body C',
    focus: 'Legs, push ups, walk',
    estMinutes: 35,
    exercises: [ex('walking_lunge', 3, '10'), ex('push_up', 3, '10', 60, false), ex('seated_cable_row', 3, '12'), ex('brisk_walk', 1, '15 min', 0, false)],
  },
];

export const TRAINING_PLANS: Record<TrainingPlanId, TrainingPlan> = {
  performance: {
    id: 'performance',
    name: 'Performance',
    tagline: 'Strong, athletic and capable',
    description:
      'The most complete plan. Heavy strength work, muscle building, conditioning, mobility and athletic power across 4–6 sessions a week.',
    minDays: 4,
    maxDays: 6,
    defaultDays: 5,
    workouts: performanceWorkouts,
    rotations: {
      4: ['perf_lower_strength', 'perf_upper_strength', 'perf_athletic', 'perf_upper_muscle'],
      5: ['perf_lower_strength', 'perf_upper_strength', 'perf_conditioning', 'perf_athletic', 'perf_upper_muscle'],
      6: ['perf_lower_strength', 'perf_upper_strength', 'perf_conditioning', 'perf_athletic', 'perf_upper_muscle', 'perf_engine_mobility'],
    },
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced',
    tagline: 'Most of the results, less time',
    description: 'Upper, lower and full body sessions with some cardio. 3–4 sessions a week of about 45 minutes.',
    minDays: 3,
    maxDays: 4,
    defaultDays: 3,
    workouts: balancedWorkouts,
    rotations: {
      3: ['bal_upper', 'bal_lower', 'bal_full'],
      4: ['bal_upper', 'bal_lower', 'bal_upper_b', 'bal_lower_b'],
    },
  },
  simple: {
    id: 'simple',
    name: 'Simple',
    tagline: 'A strong foundation, nothing extra',
    description: 'Short full body sessions with dumbbells and simple moves. 2–3 sessions a week of about 35 minutes.',
    minDays: 2,
    maxDays: 3,
    defaultDays: 3,
    workouts: simpleWorkouts,
    rotations: {
      2: ['simple_a', 'simple_b'],
      3: ['simple_a', 'simple_b', 'simple_c'],
    },
  },
};

export const TRAINING_PLAN_ORDER: TrainingPlanId[] = ['performance', 'balanced', 'simple'];

export function getWorkout(id: string | null | undefined): WorkoutTemplate | null {
  if (!id) return null;
  for (const plan of Object.values(TRAINING_PLANS)) {
    const w = plan.workouts.find((x) => x.id === id);
    if (w) return w;
  }
  return null;
}

/** Pick a plan that fits the days the user wants to train and their experience. */
export function recommendTrainingPlan(days: number, experience: string): TrainingPlanId {
  if (days >= 5) return 'performance';
  if (days === 4) return experience === 'beginner' ? 'balanced' : 'performance';
  if (days === 3) return experience === 'beginner' ? 'simple' : 'balanced';
  return 'simple';
}
