import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, EmptyState, ModalHeader, Screen, Stepper } from '@/components/ui';
import { todayKey } from '@/domain/dates';
import type { MealType } from '@/domain/models';
import { MealPicker } from '@/features/nutrition/MealPicker';
import { defaultMeal, foodCache, isMealType, MEAL_LABEL } from '@/features/nutrition/meta';
import { useNutritionStore } from '@/store';
import { colors, spacing } from '@/theme';

/** Choose servings and meal, then log. Also used to edit a logged entry (entryId). */
export default function FoodDetail() {
  const params = useLocalSearchParams<{ id?: string; entryId?: string; meal?: string; back?: string }>();
  const entry = useNutritionStore((s) => s.entries.find((e) => e.id === params.entryId));
  const food = entry?.food ?? (params.id ? foodCache.get(params.id) : undefined);
  const [servings, setServings] = useState(entry?.servings ?? 1);
  const [meal, setMeal] = useState<MealType>(entry?.meal ?? (isMealType(params.meal) ? params.meal : defaultMeal()));
  const back = Math.max(1, parseInt(params.back ?? '1', 10) || 1);

  if (!food) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ModalHeader close />
        <EmptyState icon="food-off" title="Food not found" />
      </Screen>
    );
  }

  const done = () => (router.canDismiss() ? router.dismiss(back) : router.back());

  const save = () => {
    const store = useNutritionStore.getState();
    if (entry) store.updateEntry(entry.id, { servings, meal });
    else store.addEntry({ date: todayKey(), meal, food, servings });
    done();
  };

  const remove = () => {
    if (entry) useNutritionStore.getState().removeEntry(entry.id);
    done();
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button title={entry ? 'Save' : `Add to ${MEAL_LABEL[meal]}`} onPress={save} />
          {entry ? <Button title="Remove" variant="ghost" onPress={remove} /> : null}
        </View>
      }
    >
      <ModalHeader close />
      <View style={{ gap: 4 }}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.serving}>
          {food.brand ? `${food.brand} · ` : ''}
          {food.servingLabel} per serving
        </Text>
      </View>

      <Card tint style={styles.macros}>
        <Macro label="Calories" value={Math.round(food.calories * servings)} />
        <Macro label="Protein" value={Math.round(food.proteinG * servings)} unit="g" />
        <Macro label="Carbs" value={Math.round(food.carbsG * servings)} unit="g" />
        <Macro label="Fat" value={Math.round(food.fatG * servings)} unit="g" />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <Text style={styles.label}>Servings</Text>
        <Stepper value={servings} onChange={setServings} step={0.5} min={0.5} max={20} size="md" />
      </Card>

      <Text style={styles.label}>Meal</Text>
      <MealPicker value={meal} onChange={setMeal} />
    </Screen>
  );
}

function Macro({ label, value, unit }: { label: string; value: number; unit?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      <Text style={styles.mValue}>
        {value}
        {unit ? <Text style={styles.mUnit}>{unit}</Text> : null}
      </Text>
      <Text style={styles.mLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  serving: { fontSize: 15, color: colors.textSecondary },
  macros: { flexDirection: 'row', paddingVertical: spacing.lg },
  mValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  mUnit: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  mLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  label: { fontSize: 17, fontWeight: '700', color: colors.text },
});
