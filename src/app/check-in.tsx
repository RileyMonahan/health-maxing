import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, ModalHeader, RatingScale, Screen, Stepper, TextField } from '@/components/ui';
import { todayKey } from '@/domain/dates';
import { useDailyStore, useProfileStore } from '@/store';
import { colors, spacing } from '@/theme';

/** Quick daily check-in: energy, sleep and (optionally) steps. */
export default function CheckIn() {
  const today = todayKey();
  const existing = useDailyStore((s) => s.logs[today]);
  const typicalSleep = useProfileStore((s) => s.profile?.typicalSleepHours ?? 7.5);
  const [energy, setEnergy] = useState(existing?.energy);
  const [sleepHours, setSleepHours] = useState(existing?.sleepHours ?? typicalSleep);
  const [sleepQuality, setSleepQuality] = useState(existing?.sleepQuality);
  const [steps, setSteps] = useState(existing?.steps != null ? String(existing.steps) : '');

  const save = () => {
    const stepsNum = parseInt(steps, 10);
    useDailyStore.getState().upsertLog(today, {
      energy,
      sleepHours,
      sleepQuality,
      steps: Number.isFinite(stepsNum) ? stepsNum : undefined,
    });
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']} footer={<Button title="Save check-in" onPress={save} disabled={energy == null} />}>
      <ModalHeader title="Daily check-in" close />

      <Card style={styles.card}>
        <Text style={styles.q}>How is your energy today?</Text>
        <RatingScale value={energy} onChange={setEnergy} low="Drained" high="Unstoppable" />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.q}>How long did you sleep?</Text>
        <Stepper value={sleepHours} onChange={setSleepHours} step={0.5} min={0} max={14} unit="hrs" size="md" />
        <Text style={[styles.q, { marginTop: spacing.sm }]}>How well did you sleep?</Text>
        <RatingScale value={sleepQuality} onChange={setSleepQuality} low="Poorly" high="Great" />
      </Card>

      <Card style={styles.card}>
        <View>
          <Text style={styles.q}>Steps</Text>
          <Text style={styles.hint}>Optional. Enter yesterday's or today's so far.</Text>
        </View>
        <TextField value={steps} onChangeText={(t) => setSteps(t.replace(/[^0-9]/g, ''))} keyboardType="number-pad" placeholder="e.g. 8500" suffix="steps" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  q: { fontSize: 18, fontWeight: '700', color: colors.text },
  hint: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
});
