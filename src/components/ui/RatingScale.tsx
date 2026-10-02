import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

interface Props {
  value?: number;
  onChange: (v: number) => void;
  low?: string;
  high?: string;
}

/** 1–10 quick rating, two rows of five. */
export function RatingScale({ value, onChange, low = 'Low', high = 'High' }: Props) {
  return (
    <View style={styles.wrap}>
      {[[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]].map((row) => (
        <View key={row[0]} style={styles.row}>
          {row.map((n) => {
            const on = value === n;
            return (
              <Pressable
                key={n}
                onPress={() => onChange(n)}
                accessibilityRole="button"
                accessibilityLabel={`${n} out of 10`}
                accessibilityState={{ selected: on }}
                style={({ pressed }) => [styles.pill, on && styles.on, pressed && { opacity: 0.8 }]}
              >
                <Text style={[styles.num, on && styles.numOn]}>{n}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
      <View style={styles.labels}>
        <Text style={styles.label}>{low}</Text>
        <Text style={styles.label}>{high}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  pill: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: { backgroundColor: colors.primary, borderColor: colors.primary },
  num: { fontSize: 18, fontWeight: '700', color: colors.text },
  numOn: { color: '#fff' },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, color: colors.textSecondary },
});
