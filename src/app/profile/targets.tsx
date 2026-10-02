import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Card, ModalHeader, Screen, TextField } from '@/components/ui';
import { usePlanStore, useProfileStore } from '@/store';
import { colors, spacing } from '@/theme';

const int = (s: string) => parseInt(s, 10);
const digits = (s: string) => s.replace(/[^0-9]/g, '');

export default function TargetsScreen() {
  const profile = useProfileStore((s) => s.profile)!;
  const t = usePlanStore((s) => s.targets);
  const [calories, setCalories] = useState(String(t.calories));
  const [protein, setProtein] = useState(String(t.proteinG));
  const [carbs, setCarbs] = useState(String(t.carbsG));
  const [fat, setFat] = useState(String(t.fatG));
  const [steps, setSteps] = useState(String(t.stepsGoal));
  const [sleep, setSleep] = useState(String(t.sleepGoalHours));

  const macroKcal = (int(protein) || 0) * 4 + (int(carbs) || 0) * 4 + (int(fat) || 0) * 9;
  const valid = int(calories) >= 1000 && int(protein) > 0 && int(steps) > 0 && parseFloat(sleep) > 0;

  const save = () => {
    const macrosChanged = int(calories) !== t.calories || int(protein) !== t.proteinG || int(carbs) !== t.carbsG || int(fat) !== t.fatG;
    usePlanStore.getState().setTargets({
      calories: int(calories),
      proteinG: int(protein),
      carbsG: int(carbs) || 0,
      fatG: int(fat) || 0,
      stepsGoal: int(steps),
      sleepGoalHours: parseFloat(sleep),
      custom: t.custom || macrosChanged,
    });
    router.back();
  };

  const recalc = () => {
    usePlanStore.getState().recalcTargets(profile, true);
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']} footer={<Button title="Save targets" onPress={save} disabled={!valid} />}>
      <ModalHeader title="Targets" />
      <Text style={styles.lead}>
        {t.custom ? 'You are using custom targets.' : 'These are calculated from your profile and nutrition plan.'} Edit any number to set your own.
      </Text>
      <Card style={{ gap: spacing.md }}>
        <TextField label="Calories" value={calories} onChangeText={(v) => setCalories(digits(v))} keyboardType="number-pad" suffix="kcal" />
        <TextField label="Protein" value={protein} onChangeText={(v) => setProtein(digits(v))} keyboardType="number-pad" suffix="g" />
        <TextField label="Carbs" value={carbs} onChangeText={(v) => setCarbs(digits(v))} keyboardType="number-pad" suffix="g" />
        <TextField label="Fat" value={fat} onChangeText={(v) => setFat(digits(v))} keyboardType="number-pad" suffix="g" />
        <Text style={styles.hint}>Macros add up to {macroKcal.toLocaleString()} kcal.</Text>
      </Card>
      <Card style={{ gap: spacing.md }}>
        <TextField label="Daily steps goal" value={steps} onChangeText={(v) => setSteps(digits(v))} keyboardType="number-pad" suffix="steps" />
        <TextField label="Sleep goal" value={sleep} onChangeText={(v) => setSleep(v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" suffix="hrs" />
      </Card>
      <Button title="Recalculate from my profile" variant="secondary" size="md" onPress={recalc} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { fontSize: 15, color: colors.textSecondary, lineHeight: 21 },
  hint: { fontSize: 13, color: colors.textSecondary },
});
