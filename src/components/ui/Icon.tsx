import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors } from '@/theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// The dumbbell glyph is drawn diagonally; the brand uses it level.
const ROTATED: Partial<Record<IconName, string>> = { dumbbell: '-45deg' };

export function Icon({ name, size = 22, color = colors.text }: { name: IconName; size?: number; color?: string }) {
  const rotate = ROTATED[name];
  return <MaterialCommunityIcons name={name} size={size} color={color} style={rotate ? { transform: [{ rotate }] } : undefined} />;
}
