import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Card, ModalHeader, Screen, TextField } from '@/components/ui';
import { todayKey } from '@/domain/dates';
import { useDailyStore, usePlanStore, useProfileStore } from '@/store';
import { spacing } from '@/theme';

const parse = (s: string) => parseFloat(s.replace(',', '.'));
const ok = (s: string, min: number, max: number) => {
  const n = parse(s);
  return Number.isFinite(n) && n >= min && n <= max;
};

export default function PersonalInfo() {
  const profile = useProfileStore((s) => s.profile)!;
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [height, setHeight] = useState(String(profile.heightCm));
  const [weight, setWeight] = useState(String(profile.weightKg));
  const [goal, setGoal] = useState(String(profile.goalWeightKg));
  const valid = name.trim() && ok(age, 13, 99) && ok(height, 120, 230) && ok(weight, 35, 250) && ok(goal, 35, 250);

  const save = () => {
    const weightKg = parse(weight);
    if (weightKg !== profile.weightKg) useDailyStore.getState().upsertLog(todayKey(), { weightKg });
    useProfileStore.getState().updateProfile({ name: name.trim(), age: parse(age), heightCm: parse(height), weightKg, goalWeightKg: parse(goal) });
    usePlanStore.getState().recalcTargets(useProfileStore.getState().profile!);
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']} footer={<Button title="Save" onPress={save} disabled={!valid} />}>
      <ModalHeader title="Personal info" />
      <Card style={{ gap: spacing.md }}>
        <TextField label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
        <TextField label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" suffix="years" />
        <TextField label="Height" value={height} onChangeText={setHeight} keyboardType="decimal-pad" suffix="cm" />
        <TextField label="Current weight" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" suffix="kg" />
        <TextField label="Goal weight" value={goal} onChangeText={setGoal} keyboardType="decimal-pad" suffix="kg" />
      </Card>
    </Screen>
  );
}
