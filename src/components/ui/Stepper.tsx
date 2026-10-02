import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';
import { Icon } from './Icon';

interface Props {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  format?: (v: number) => string;
  size?: 'lg' | 'md';
}

export function Stepper({ value, onChange, step = 1, min = 0, max = 999, unit, format, size = 'lg' }: Props) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, Math.round(v * 100) / 100)));
  const big = size === 'lg';
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => set(value - step)}
        accessibilityLabel="Decrease"
        style={({ pressed }) => [styles.btn, !big && styles.btnSm, pressed && { opacity: 0.7 }]}
      >
        <Icon name="minus" size={big ? 26 : 20} color={colors.primary} />
      </Pressable>
      <Text style={[styles.value, !big && styles.valueSm]}>
        {format ? format(value) : value}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>
      <Pressable
        onPress={() => set(value + step)}
        accessibilityLabel="Increase"
        style={({ pressed }) => [styles.btn, !big && styles.btnSm, pressed && { opacity: 0.7 }]}
      >
        <Icon name="plus" size={big ? 26 : 20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  btn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  btnSm: { width: 40, height: 40, borderRadius: 20 },
  value: { fontSize: 44, fontWeight: '800', color: colors.text, letterSpacing: -1, textAlign: 'center', flex: 1 },
  valueSm: { fontSize: 22, letterSpacing: 0 },
  unit: { fontSize: 18, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0 },
});
