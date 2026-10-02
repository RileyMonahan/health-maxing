import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { Icon, IconName } from './Icon';

interface Props {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  badge?: string;
}

/** Large selectable card used for single/multi choice questions. */
export function OptionCard({ title, description, selected, onPress, icon, badge }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.card, selected && styles.selected, pressed && { opacity: 0.85 }]}
    >
      {icon ? (
        <View style={[styles.icon, selected && styles.iconSelected]}>
          <Icon name={icon} size={22} color={selected ? '#fff' : colors.primary} />
        </View>
      ) : null}
      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <Icon name="check" size={16} color="#fff" /> : null}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.primary, backgroundColor: '#F4FAFF' },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  iconSelected: { backgroundColor: colors.primary },
  text: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  badge: { backgroundColor: colors.highlightSoft, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#B57E00' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
