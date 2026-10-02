import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Card } from './Card';
import type { IconName } from './Icon';
import { IconBadge, Tone } from './IconBadge';
import { ProgressBar } from './ProgressBar';

interface Props {
  icon: IconName;
  tone?: Tone;
  label: string;
  value: string;
  unit?: string;
  progress?: number;
  barColor?: string;
  onPress?: () => void;
}

export function StatTile({ icon, tone = 'blue', label, value, unit, progress, barColor, onPress }: Props) {
  return (
    <Card onPress={onPress} style={styles.card} accessibilityLabel={`${label} ${value} ${unit ?? ''}`}>
      <IconBadge icon={icon} tone={tone} size={40} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.valueRow}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        {unit ? (
          <Text style={styles.unit} numberOfLines={1}>
            {unit}
          </Text>
        ) : null}
      </View>
      {progress != null ? <ProgressBar value={progress} color={barColor} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: spacing.lg, gap: 6 },
  label: { fontSize: 15, fontWeight: '500', color: colors.text, marginTop: 6 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 4, marginBottom: 4 },
  value: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  unit: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
});
