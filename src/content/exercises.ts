import type { Exercise } from '@/domain/models';

// Exercise library. Add an entry here and reference its id from any plan.
const list: Exercise[] = [
  // Lower
  { id: 'back_squat', name: 'Back Squat', muscle: 'Legs', equipment: 'Barbell', kind: 'strength' },
  { id: 'goblet_squat', name: 'Goblet Squat', muscle: 'Legs', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'trap_bar_deadlift', name: 'Trap Bar Deadlift', muscle: 'Posterior chain', equipment: 'Trap bar', kind: 'strength' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscle: 'Hamstrings', equipment: 'Barbell', kind: 'strength' },
  { id: 'db_rdl', name: 'Dumbbell RDL', muscle: 'Hamstrings', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscle: 'Legs', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'walking_lunge', name: 'Walking Lunge', muscle: 'Legs', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'leg_press', name: 'Leg Press', muscle: 'Quads', equipment: 'Machine', kind: 'strength' },
  { id: 'leg_curl', name: 'Leg Curl', muscle: 'Hamstrings', equipment: 'Machine', kind: 'strength' },
  { id: 'hip_thrust', name: 'Hip Thrust', muscle: 'Glutes', equipment: 'Barbell', kind: 'strength' },
  { id: 'calf_raise', name: 'Calf Raise', muscle: 'Calves', equipment: 'Machine', kind: 'strength' },
  // Upper push
  { id: 'bench_press', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', kind: 'strength' },
  { id: 'db_bench_press', name: 'Dumbbell Bench Press', muscle: 'Chest', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'incline_db_press', name: 'Incline Dumbbell Press', muscle: 'Upper chest', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'overhead_press', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', kind: 'strength' },
  { id: 'db_shoulder_press', name: 'Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'lateral_raise', name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'push_up', name: 'Push Ups', muscle: 'Chest', equipment: 'Bodyweight', kind: 'bodyweight' },
  { id: 'dip', name: 'Dips', muscle: 'Chest & triceps', equipment: 'Bodyweight', kind: 'bodyweight' },
  { id: 'triceps_pushdown', name: 'Triceps Pushdown', muscle: 'Triceps', equipment: 'Cable', kind: 'strength' },
  // Upper pull
  { id: 'pull_up', name: 'Pull Ups', muscle: 'Back', equipment: 'Bodyweight', kind: 'bodyweight' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable', kind: 'strength' },
  { id: 'bent_over_row', name: 'Bent Over Row', muscle: 'Back', equipment: 'Barbell', kind: 'strength' },
  { id: 'db_row', name: 'Dumbbell Row', muscle: 'Back', equipment: 'Dumbbell', kind: 'strength' },
  { id: 'seated_cable_row', name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', kind: 'strength' },
  { id: 'face_pull', name: 'Face Pull', muscle: 'Rear delts', equipment: 'Cable', kind: 'strength' },
  { id: 'db_curl', name: 'Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbell', kind: 'strength' },
  // Core & carries
  { id: 'plank', name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', kind: 'bodyweight' },
  { id: 'dead_bug', name: 'Dead Bug', muscle: 'Core', equipment: 'Bodyweight', kind: 'bodyweight' },
  { id: 'hanging_knee_raise', name: 'Hanging Knee Raise', muscle: 'Core', equipment: 'Bodyweight', kind: 'bodyweight' },
  { id: 'farmers_carry', name: "Farmer's Carry", muscle: 'Grip & core', equipment: 'Dumbbell', kind: 'strength' },
  // Athletic
  { id: 'box_jump', name: 'Box Jump', muscle: 'Power', equipment: 'Box', kind: 'bodyweight' },
  { id: 'kb_swing', name: 'Kettlebell Swing', muscle: 'Posterior chain', equipment: 'Kettlebell', kind: 'strength' },
  { id: 'med_ball_slam', name: 'Med Ball Slam', muscle: 'Power', equipment: 'Med ball', kind: 'bodyweight' },
  { id: 'sled_push', name: 'Sled Push', muscle: 'Legs & engine', equipment: 'Sled', kind: 'cardio' },
  // Cardio
  { id: 'zone2_cardio', name: 'Zone 2 Cardio', muscle: 'Engine', equipment: 'Bike, run or row', kind: 'cardio' },
  { id: 'intervals', name: 'Intervals', muscle: 'Engine', equipment: 'Bike, run or row', kind: 'cardio' },
  { id: 'brisk_walk', name: 'Brisk Walk', muscle: 'Engine', equipment: 'None', kind: 'cardio' },
  // Mobility
  { id: 'mobility_flow', name: 'Mobility Flow', muscle: 'Full body', equipment: 'None', kind: 'mobility' },
  { id: 'hip_mobility', name: 'Hip Mobility', muscle: 'Hips', equipment: 'None', kind: 'mobility' },
];

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(list.map((e) => [e.id, e]));

export function getExercise(id: string): Exercise {
  return EXERCISES[id] ?? { id, name: id, muscle: '', equipment: '', kind: 'strength' };
}
