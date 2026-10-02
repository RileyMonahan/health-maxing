import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Card, EmptyState, Icon, ModalHeader, Screen, TextField } from '@/components/ui';
import type { Food, MealType } from '@/domain/models';
import { FoodRow } from '@/features/nutrition/FoodRow';
import { MealPicker } from '@/features/nutrition/MealPicker';
import { defaultMeal, foodCache, isMealType } from '@/features/nutrition/meta';
import { MockNotice } from '@/features/nutrition/MockNotice';
import { foodService } from '@/services';
import { useNutritionStore } from '@/store';
import { recentFoods } from '@/store/nutrition';
import { colors, spacing } from '@/theme';

export default function SearchFood() {
  const params = useLocalSearchParams<{ meal?: string }>();
  const [meal, setMeal] = useState<MealType>(isMealType(params.meal) ? params.meal : defaultMeal());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const entries = useNutritionStore((s) => s.entries);
  const customFoods = useNutritionStore((s) => s.customFoods);
  const recent = useMemo(() => recentFoods(entries), [entries]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      const remote = await foodService.search(query).catch(() => []);
      const q = query.trim().toLowerCase();
      const mine = customFoods.filter((f) => !q || f.name.toLowerCase().includes(q));
      if (!cancelled) {
        setResults([...mine, ...remote]);
        setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, customFoods]);

  const open = (food: Food) => {
    foodCache.put([food]);
    router.push({ pathname: '/nutrition/food', params: { id: food.id, meal, back: '2' } });
  };

  const showRecent = !query.trim() && recent.length > 0;

  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title="Search Food" close />
      <TextField value={query} onChangeText={setQuery} placeholder="Search foods" autoFocus returnKeyType="search" />
      <MealPicker value={meal} onChange={setMeal} />
      {foodService.isMock ? <MockNotice text="Showing sample foods. The full food database connects in a later version." /> : null}

      {showRecent ? (
        <>
          <Text style={styles.section}>Recent</Text>
          <Card style={styles.list}>
            {recent.map((f, i) => (
              <FoodRow key={f.id} food={f} onPress={() => open(f)} last={i === recent.length - 1} />
            ))}
          </Card>
        </>
      ) : null}

      <View style={styles.headRow}>
        <Text style={styles.section}>{query.trim() ? 'Results' : 'Foods'}</Text>
        {loading ? <ActivityIndicator color={colors.primary} /> : null}
      </View>
      {results.length ? (
        <Card style={styles.list}>
          {results.map((f, i) => (
            <FoodRow key={f.id} food={f} onPress={() => open(f)} last={i === results.length - 1} />
          ))}
        </Card>
      ) : !loading ? (
        <EmptyState icon="magnify" title="No foods found" body="Try another word, or add it yourself." />
      ) : null}

      <Card onPress={() => router.replace({ pathname: '/nutrition/quick-add', params: { meal } })} style={styles.create}>
        <Icon name="plus-circle-outline" size={22} color={colors.primary} />
        <Text style={styles.createText}>Can't find it? Add a custom food</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 15, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { paddingVertical: spacing.xs },
  create: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.lg },
  createText: { fontSize: 15, fontWeight: '600', color: colors.primary },
});
