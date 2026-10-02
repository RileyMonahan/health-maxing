import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { todayKey } from '@/domain/dates';

/** Today's date key, refreshed whenever the screen regains focus (e.g. after midnight). */
export function useToday(): string {
  const [today, setToday] = useState(todayKey());
  useFocusEffect(
    useCallback(() => {
      const t = todayKey();
      setToday((prev) => (prev === t ? prev : t));
    }, []),
  );
  return today;
}
