import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, ModalHeader, Screen, TextField } from '@/components/ui';
import { todayKey } from '@/domain/dates';
import type { MealType } from '@/domain/models';
import { MealPicker } from '@/features/nutrition/MealPicker';
import { defaultMeal, isMealType, MEAL_LABEL } from '@/features/nutrition/meta';
import { useNutritionStore } from '@/store';
import { colors, spacing } from '@/theme';

const n = (s: string) => {
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : 0;
};
const clean = (t: string) => t.replace(',', '.').replace(/[^0-9.]/g, '');

/** Add a food by hand. It's saved to "my foods" so it shows up in search next time. */
export default function QuickAdd() {
  const params = useLocalSearchParams<{ meal?: string }>();
  const [meal, setMeal] = useState<MealType>(isMealType(params.meal) ? params.meal : defaultMeal());
  const [name, setName] = useState('');
  const [serving, setServing] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const macroKcal = n(protein) * 4 + n(carbs) * 4 + n(fat) * 9;
  const kcal = calories ? n(calories) : Math.round(macroKcal);
  const valid = name.trim().length > 0 && kcal > 0;

  const save = () => {
    const store = useNutritionStore.getState();
    const food = store.addCustomFood({
      name: name.trim(),
      servingLabel: serving.trim() || '1 serving',
      calories: kcal,
      proteinG: n(protein),
      carbsG: n(carbs),
      fatG: n(fat),
    });
    store.addEntry({ date: todayKey(), meal, food, servings: 1 });
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']} footer={<Button title={`Add to ${MEAL_LABEL[meal]}`} onPress={save} disabled={!valid} />}>
      <ModalHeader title="Add Food" close />
      <MealPicker value={meal} onChange={setMeal} />
      <Card style={{ gap: spacing.md }}>
        <TextField label="Food name" value={name} onChangeText={setName} placeholder="e.g. Chicken pasta" autoFocus />
        <TextField label="Serving" value={serving} onChangeText={setServing} placeholder="e.g. 1 bowl" />
        <TextField label="Calories" value={calories} onChangeText={(t) => setCalories(clean(t))} placeholder={macroKcal ? String(Math.round(macroKcal)) : '0'} keyboardType="decimal-pad" suffix="kcal" />
        <View style={styles.row}>
          <View style={styles.flex}>
            <TextField label="Protein" value={protein} onChangeText={(t) => setProtein(clean(t))} placeholder="0" keyboardType="decimal-pad" suffix="g" />
          </View>
          <View style={styles.flex}>
            <TextField label="Carbs" value={carbs} onChangeText={(t) => setCarbs(clean(t))} placeholder="0" keyboardType="decimal-pad" suffix="g" />
          </View>
          <View style={styles.flex}>
            <TextField label="Fat" value={fat} onChangeText={(t) => setFat(clean(t))} placeholder="0" keyboardType="decimal-pad" suffix="g" />
          </View>
        </View>
        <Text style={styles.hint}>Leave calories empty to calculate them from the macros.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  hint: { fontSize: 13, color: colors.textSecondary },
});
