import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/theme';
import { Icon, IconName } from './Icon';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
}

export function Chip({ label, selected, onPress, icon }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && { opacity: 0.8 }]}
    >
      {icon ? <Icon name={icon} size={18} color={selected ? colors.primary : colors.textSecondary} /> : null}
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selected: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  text: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  selectedText: { color: colors.primaryDark },
});
