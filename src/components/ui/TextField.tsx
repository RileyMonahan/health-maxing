import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  suffix?: string;
}

export function TextField({ label, suffix, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.field}>
        <TextInput placeholderTextColor={colors.textTertiary} style={[styles.input, style]} {...rest} />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

/** Very large centred number entry used for single-question onboarding steps. */
export function BigNumberField({ value, onChangeText, suffix, placeholder }: { value: string; onChangeText: (t: string) => void; suffix: string; placeholder?: string }) {
  return (
    <View style={styles.bigRow}>
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.replace(',', '.').replace(/[^0-9.]/g, ''))}
        keyboardType="decimal-pad"
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.bigInput}
        autoFocus
        maxLength={5}
        accessibilityLabel={suffix}
      />
      <Text style={styles.bigSuffix}>{suffix}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  input: { flex: 1, minWidth: 0, height: 52, fontSize: 17, color: colors.text, outlineStyle: 'none' } as never,
  suffix: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  bigRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8, paddingVertical: 24 },
  bigInput: { minWidth: 120, maxWidth: 220, fontSize: 64, fontWeight: '800', color: colors.text, textAlign: 'center', letterSpacing: -1.5, outlineStyle: 'none' } as never,
  bigSuffix: { fontSize: 24, fontWeight: '700', color: colors.textSecondary },
});
