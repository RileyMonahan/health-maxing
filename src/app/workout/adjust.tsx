import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chip, Icon, ModalHeader, OptionCard, Screen } from '@/components/ui';
import { getWorkout, TRAINING_PLAN_ORDER, TRAINING_PLANS } from '@/content/trainingPlans';
import { WEEKDAY_LONG, WEEKDAY_SHORT } from '@/domain/dates';
import { WEEKDAYS, Weekday } from '@/domain/models';
import { trainingDaysOf } from '@/domain/schedule';
import { usePlanStore, useProfileStore } from '@/store';
import { colors, radius, spacing, type } from '@/theme';

export default function AdjustPlan() {
  const { trainingPlanId, schedule } = usePlanStore();
  const actions = usePlanStore.getState();
  const plan = TRAINING_PLANS[trainingPlanId];
  const days = trainingDaysOf(schedule);
  const [moving, setMoving] = useState<Weekday | null>(null);

  const afterChange = () => {
    const p = useProfileStore.getState().profile;
    if (p) usePlanStore.getState().recalcTargets(p);
  };

  const tapDay = (d: Weekday) => {
    if (moving == null) {
      if (schedule[d]) setMoving(d);
      return;
    }
    if (moving !== d) actions.swapDays(moving, d);
    setMoving(null);
  };

  const range = Array.from({ length: plan.maxDays - plan.minDays + 1 }, (_, i) => plan.minDays + i);

  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title="Adjust Plan" close />

      <Text style={type.heading}>Training plan</Text>
      {TRAINING_PLAN_ORDER.map((id) => {
        const p = TRAINING_PLANS[id];
        return (
          <OptionCard
            key={id}
            title={p.name}
            description={`${p.tagline}. ${p.minDays}–${p.maxDays} days a week.`}
            selected={id === trainingPlanId}
            onPress={() => {
              actions.setTrainingPlan(id);
              afterChange();
            }}
          />
        );
      })}

      <Text style={type.heading}>Days per week</Text>
      <View style={styles.chips}>
        {range.map((n) => (
          <Chip
            key={n}
            label={`${n} days`}
            selected={days.length === n}
            onPress={() => {
              actions.setDaysPerWeek(n);
              afterChange();
            }}
          />
        ))}
      </View>

      <Text style={type.heading}>Training days</Text>
      <Text style={styles.hint}>
        Tap to add or remove a day ({plan.minDays}–{plan.maxDays} days on {plan.name}).
      </Text>
      <View style={styles.week}>
        {WEEKDAYS.map((d) => {
          const on = schedule[d] != null;
          return (
            <Pressable
              key={d}
              onPress={() => {
                actions.toggleDay(d);
                afterChange();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[styles.day, on && styles.dayOn]}
            >
              <Text style={[styles.dayText, on && { color: '#fff' }]}>{WEEKDAY_SHORT[d]}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={type.heading}>This week's schedule</Text>
      <Text style={styles.hint}>{moving != null ? `Now tap the day to move ${getWorkout(schedule[moving])?.name} to.` : 'Tap a workout, then tap another day to move it there.'}</Text>
      <Card style={{ paddingVertical: spacing.xs }}>
        {WEEKDAYS.map((d, i) => {
          const w = getWorkout(schedule[d]);
          const isMoving = moving === d;
          return (
            <Pressable
              key={d}
              onPress={() => tapDay(d)}
              accessibilityRole="button"
              style={[styles.schedRow, i < 6 && styles.divider, isMoving && styles.moving, moving != null && !isMoving && styles.target]}
            >
              <Text style={styles.schedDay}>{WEEKDAY_LONG[d]}</Text>
              <Text style={[styles.schedWorkout, !w && styles.rest]} numberOfLines={1}>
                {w ? w.name : 'Rest'}
              </Text>
              {w ? <Icon name={isMoving ? 'cursor-move' : 'swap-vertical'} size={20} color={isMoving ? colors.primary : colors.textTertiary} /> : <View style={{ width: 20 }} />}
            </Pressable>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  hint: { fontSize: 14, color: colors.textSecondary, marginTop: -8 },
  week: { flexDirection: 'row', gap: 6 },
  day: { flex: 1, height: 48, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  dayOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { fontSize: 13, fontWeight: '700', color: colors.text },
  schedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14, paddingHorizontal: 4, borderRadius: 10 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E3E8EE' },
  moving: { backgroundColor: colors.primarySoft },
  target: { opacity: 0.85 },
  schedDay: { width: 100, fontSize: 15, fontWeight: '600', color: colors.text },
  schedWorkout: { flex: 1, fontSize: 15, color: colors.text },
  rest: { color: colors.textTertiary },
});
