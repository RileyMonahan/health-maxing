import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from '@/components/ui';
import { MEALS, MealType } from '@/domain/models';
import { MEAL_LABEL } from './meta';

export function MealPicker({ value, onChange }: { value: MealType; onChange: (m: MealType) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {MEALS.map((m) => (
        <Chip key={m} label={MEAL_LABEL[m]} selected={m === value} onPress={() => onChange(m)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ row: { gap: 8 } });
