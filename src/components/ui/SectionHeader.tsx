import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, type } from '@/theme';
import { Icon } from './Icon';

export function SectionHeader({ title, right, onPress }: { title: string; right?: string; onPress?: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={type.heading}>{title}</Text>
      {right ? (
        <Pressable onPress={onPress} disabled={!onPress} hitSlop={8} style={styles.right}>
          <Text style={[styles.rightText, onPress && styles.link]}>{right}</Text>
          {onPress ? <Icon name="chevron-right" size={20} color={colors.primary} /> : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  right: { flexDirection: 'row', alignItems: 'center' },
  rightText: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  link: { color: colors.primary, fontWeight: '600' },
});
