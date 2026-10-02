import type { IconName } from '@/components/ui';
import type { ExerciseKind } from '@/domain/models';

export const KIND_ICON: Record<ExerciseKind, IconName> = {
  strength: 'dumbbell',
  bodyweight: 'human-handsup',
  cardio: 'heart-pulse',
  mobility: 'yoga',
};

export function setsLabel(sets: number, reps: string): string {
  const unit = /^\d+(-\d+)?$/.test(reps) ? ' reps' : '';
  return sets > 1 ? `${sets} sets × ${reps}${unit}` : `${reps}${unit}`;
}
