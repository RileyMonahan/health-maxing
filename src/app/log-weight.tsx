import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { BigNumberField, Button, ModalHeader, Screen } from '@/components/ui';
import { todayKey } from '@/domain/dates';
import { currentWeight } from '@/store/daily';
import { useDailyStore, usePlanStore, useProfileStore } from '@/store';
import { colors } from '@/theme';

export default function LogWeight() {
  const profile = useProfileStore((s) => s.profile);
  const logs = useDailyStore((s) => s.logs);
  const [value, setValue] = useState(String(currentWeight(logs, profile?.weightKg ?? 0)));
  const n = parseFloat(value);
  const valid = Number.isFinite(n) && n >= 35 && n <= 250;

  const save = () => {
    useDailyStore.getState().upsertLog(todayKey(), { weightKg: n });
    useProfileStore.getState().updateProfile({ weightKg: n });
    const updated = useProfileStore.getState().profile;
    if (updated) usePlanStore.getState().recalcTargets(updated);
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']} footer={<Button title="Save weight" onPress={save} disabled={!valid} />}>
      <ModalHeader title="Log weight" close />
      <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 24 }}>
        Weigh yourself in the morning for the most consistent trend.
      </Text>
      <BigNumberField value={value} onChangeText={setValue} suffix="kg" />
    </Screen>
  );
}
