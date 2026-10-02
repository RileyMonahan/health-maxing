import { StyleSheet, Text, View } from 'react-native';
import { WEEKDAY_LETTER } from '@/domain/dates';
import { colors } from '@/theme';

/** Seven dots (Mon–Sun), filled yellow for active days. */
export function WeekDots({ filled, size = 18 }: { filled: boolean[]; size?: number }) {
  return (
    <View style={styles.row}>
      {filled.map((on, i) => (
        <View key={i} style={styles.col}>
          <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2 }, on && styles.on]} />
          <Text style={styles.letter}>{WEEKDAY_LETTER[i]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  col: { alignItems: 'center', gap: 4 },
  dot: { backgroundColor: colors.track },
  on: { backgroundColor: colors.highlight },
  letter: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
});
