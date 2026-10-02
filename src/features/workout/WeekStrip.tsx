import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { fromDateKey, WEEKDAY_SHORT, weekdayOf } from '@/domain/dates';
import type { DateKey, Schedule } from '@/domain/models';
import { colors } from '@/theme';

interface Props {
  dates: DateKey[];
  today: DateKey;
  selected: DateKey;
  schedule: Schedule;
  completed: Set<DateKey>;
  onSelect: (d: DateKey) => void;
}

export function WeekStrip({ dates, today, selected, schedule, completed, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {dates.map((d) => {
        const wd = weekdayOf(d);
        const training = schedule[wd] != null;
        const isSel = d === selected;
        const isToday = d === today;
        const done = completed.has(d);
        return (
          <Pressable
            key={d}
            onPress={() => onSelect(d)}
            style={styles.col}
            accessibilityRole="button"
            accessibilityLabel={`${WEEKDAY_SHORT[wd]}${training ? ', training day' : ', rest day'}${done ? ', completed' : ''}`}
            accessibilityState={{ selected: isSel }}
          >
            <Text style={[styles.day, isToday && styles.dayToday]}>{WEEKDAY_SHORT[wd]}</Text>
            <View style={[styles.circle, training && styles.training, isSel && styles.selected]}>
              <Text style={[styles.num, isSel && styles.numSel]}>{String(fromDateKey(d).getDate()).padStart(2, '0')}</Text>
            </View>
            <View style={styles.marker}>
              {done ? (
                <Icon name="check-circle" size={16} color={colors.success} />
              ) : training ? (
                <Icon name="dumbbell" size={16} color={colors.primary} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { alignItems: 'center', gap: 6, flex: 1 },
  day: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  dayToday: { color: colors.text, fontWeight: '700' },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  training: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  num: { fontSize: 16, fontWeight: '600', color: colors.text },
  numSel: { color: '#fff' },
  marker: { height: 16 },
});
