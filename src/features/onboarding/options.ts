import type { IconName } from '@/components/ui';
import type { Experience, GoalId } from '@/domain/models';

export const GOAL_OPTIONS: { id: GoalId; label: string; icon: IconName }[] = [
  { id: 'build_muscle', label: 'Build muscle', icon: 'arm-flex' },
  { id: 'lose_fat', label: 'Lose fat', icon: 'fire' },
  { id: 'strength', label: 'Get stronger', icon: 'weight-lifter' },
  { id: 'energy', label: 'More energy', icon: 'lightning-bolt' },
  { id: 'sleep', label: 'Sleep better', icon: 'weather-night' },
  { id: 'athleticism', label: 'Be more athletic', icon: 'run-fast' },
  { id: 'habits', label: 'Build healthy habits', icon: 'check-circle-outline' },
];

export const EXPERIENCE_OPTIONS: { id: Experience; label: string; description: string; icon: IconName }[] = [
  { id: 'beginner', label: 'Beginner', description: 'New to training or less than a year', icon: 'sprout' },
  { id: 'intermediate', label: 'Intermediate', description: '1–3 years of consistent training', icon: 'leaf' },
  { id: 'advanced', label: 'Advanced', description: '3+ years and comfortable with heavy lifts', icon: 'tree' },
];
