import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/ui';
import type { ExerciseKind, LoggedSet } from '@/domain/models';
import { colors } from '@/theme';

export type SetColumns = { weight: boolean; reps: boolean; rir: boolean };

export function columnsFor(kind: ExerciseKind, reps: string, trackRir: boolean): SetColumns {
  const numericReps = /^\d+(-\d+)?$/.test(reps);
  if (kind === 'strength') return { weight: true, reps: numericReps, rir: trackRir && numericReps };
  if (kind === 'bodyweight') return { weight: false, reps: numericReps, rir: false };
  return { weight: false, reps: false, rir: false };
}

interface Props {
  index: number;
  set: LoggedSet;
  cols: SetColumns;
  target: string;
  onChange: (patch: Partial<LoggedSet>) => void;
  onRemove?: () => void;
}

export function SetHeader({ cols }: { cols: SetColumns }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.head, styles.setCol]}>Set</Text>
      {cols.weight ? <Text style={[styles.head, styles.inputCol]}>kg</Text> : null}
      {cols.reps ? <Text style={[styles.head, styles.inputCol]}>Reps</Text> : null}
      {cols.rir ? <Text style={[styles.head, styles.rirCol]}>RIR</Text> : null}
      {!cols.weight && !cols.reps ? <Text style={[styles.head, { flex: 1 }]}>Target</Text> : null}
      <View style={styles.checkCol} />
    </View>
  );
}

export function SetRow({ index, set, cols, target, onChange, onRemove }: Props) {
  const toggle = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onChange({ done: !set.done });
  };
  return (
    <View style={[styles.row, set.done && styles.rowDone]}>
      <Pressable onLongPress={onRemove} style={styles.setCol} accessibilityLabel={`Set ${index + 1}`} accessibilityHint="Long press to remove">
        <Text style={styles.setNum}>{index + 1}</Text>
      </Pressable>
      {cols.weight ? <NumInput value={set.weightKg} onChange={(weightKg) => onChange({ weightKg })} decimal style={styles.inputCol} label="Weight in kilograms" /> : null}
      {cols.reps ? <NumInput value={set.reps} onChange={(reps) => onChange({ reps })} style={styles.inputCol} label="Reps" /> : null}
      {cols.rir ? <NumInput value={set.rir} onChange={(rir) => onChange({ rir })} style={styles.rirCol} label="Reps in reserve" placeholder="–" /> : null}
      {!cols.weight && !cols.reps ? <Text style={styles.target}>{target}</Text> : null}
      <Pressable
        onPress={toggle}
        style={[styles.check, set.done && styles.checkOn]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: set.done }}
        accessibilityLabel={`Complete set ${index + 1}`}
      >
        <Icon name="check" size={20} color={set.done ? '#fff' : colors.textTertiary} />
      </Pressable>
    </View>
  );
}

function NumInput({
  value,
  onChange,
  decimal,
  style,
  label,
  placeholder,
}: {
  value?: number;
  onChange: (v: number | undefined) => void;
  decimal?: boolean;
  style: object;
  label: string;
  placeholder?: string;
}) {
  const [text, setText] = useState(value != null ? String(value) : '');
  useEffect(() => {
    const parsed = parseFloat(text);
    if ((value ?? NaN) !== parsed && !(value == null && text === '')) setText(value != null ? String(value) : '');
    // only sync when the stored value changes from outside this input
  }, [value]);
  return (
    <TextInput
      value={text}
      onChangeText={(t) => {
        const clean = t.replace(',', '.').replace(decimal ? /[^0-9.]/g : /[^0-9]/g, '');
        setText(clean);
        const n = parseFloat(clean);
        onChange(Number.isFinite(n) ? n : undefined);
      }}
      keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
      placeholder={placeholder ?? '0'}
      placeholderTextColor={colors.textTertiary}
      selectTextOnFocus
      accessibilityLabel={label}
      style={[styles.input, style]}
      maxLength={6}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, paddingHorizontal: 4, borderRadius: 12 },
  rowDone: { backgroundColor: colors.successSoft },
  head: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },
  setCol: { width: 32, alignItems: 'center' },
  setNum: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
  inputCol: { flex: 1, minWidth: 0 },
  rirCol: { width: 56, minWidth: 0 },
  checkCol: { width: 40 },
  input: {
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.background,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    outlineStyle: 'none',
  } as object,
  target: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '600' },
  check: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.track, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.success },
});
