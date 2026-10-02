import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import type { Food } from '@/domain/models';
import { colors, spacing } from '@/theme';

export function FoodRow({ food, servings = 1, onPress, right, last }: { food: Food; servings?: number; onPress?: () => void; right?: React.ReactNode; last?: boolean }) {
  const kcal = Math.round(food.calories * servings);
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.row, !last && styles.divider, pressed && { opacity: 0.6 }]} accessibilityRole={onPress ? 'button' : undefined}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.name} numberOfLines={1}>
          {food.name}
          {food.brand ? <Text style={styles.brand}>  {food.brand}</Text> : null}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {servings !== 1 ? `${servings} × ` : ''}
          {food.servingLabel} · P {Math.round(food.proteinG * servings)} C {Math.round(food.carbsG * servings)} F {Math.round(food.fatG * servings)}
        </Text>
      </View>
      <Text style={styles.kcal}>{kcal} kcal</Text>
      {right ?? (onPress ? <Icon name="plus-circle" size={26} color={colors.primary} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E3E8EE' },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  brand: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  meta: { fontSize: 13, color: colors.textSecondary },
  kcal: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
});
