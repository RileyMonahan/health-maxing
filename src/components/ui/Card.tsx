import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  tint?: boolean;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
  accessibilityLabel?: string;
}

export function Card({ children, onPress, tint, style, padded = true, accessibilityLabel }: Props) {
  const content = [styles.card, tint && styles.tint, padded && styles.padded, style];
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [...content, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={content}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow },
  tint: { backgroundColor: '#F1F8FF', borderWidth: 1, borderColor: '#E3F0FC' },
  padded: { padding: spacing.xl },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
