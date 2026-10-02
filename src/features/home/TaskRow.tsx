import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, IconBadge, IconName } from '@/components/ui';
import { colors, spacing } from '@/theme';

interface Props {
  icon: IconName;
  title: string;
  subtitle: string;
  done: boolean;
  onPress: () => void;
  last?: boolean;
}

export function TaskRow({ icon, title, subtitle, done, onPress, last }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}${done ? ', done' : ''}`}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && { opacity: 0.7 }]}
    >
      <IconBadge icon={icon} size={56} />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.check, done && styles.checkOn]}>{done ? <Icon name="check" size={20} color="#fff" /> : null}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E3E8EE' },
  text: { flex: 1, gap: 3 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  check: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
