import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@/theme';

interface Props {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  right?: ReactNode;
}

export function PageTitle({ title, eyebrow, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.flex}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={type.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, marginTop: spacing.md },
  flex: { flex: 1 },
  eyebrow: { fontSize: 17, color: colors.textSecondary, fontWeight: '500', marginBottom: 2 },
  subtitle: { fontSize: 17, color: colors.textSecondary, marginTop: spacing.xs },
});
