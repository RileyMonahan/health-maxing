import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart, Point } from '@/components/charts/LineChart';
import { AppHeader, Card, Chip, EmptyState, Icon, IconBadge, PageTitle, ProgressBar, Screen, SectionHeader, SegmentedControl, WeekDots } from '@/components/ui';
import { getExercise } from '@/content/exercises';
import { addDays, dateRange, formatMonth, formatMonthDay, toDateKey, weekDates } from '@/domain/dates';
import type { DailyLog, DateKey } from '@/domain/models';
import { nutritionConsistency, trainingConsistency } from '@/domain/scoring';
import { activeDates, currentStreak } from '@/domain/streak';
import { strengthTrends, trimNum } from '@/domain/strength';
import { useToday } from '@/hooks/useToday';
import { useDailyStore, useNutritionStore, usePlanStore, useProfileStore, useWorkoutStore } from '@/store';
import { currentWeight } from '@/store/daily';
import { colors, spacing } from '@/theme';
import { confirm } from '@/utils/confirm';

type Range = '30' | '90' | '180' | '365' | 'all';
type Metric = 'weightKg' | 'energy' | 'sleepHours' | 'steps';

const RANGES: { value: Range; label: string }[] = [
  { value: '30', label: '30D' },
  { value: '90', label: '90D' },
  { value: '180', label: '6M' },
  { value: '365', label: '1Y' },
  { value: 'all', label: 'All' },
];

const METRICS: { value: Metric; label: string; unit: string; digits: number }[] = [
  { value: 'weightKg', label: 'Weight', unit: 'kg', digits: 1 },
  { value: 'energy', label: 'Energy', unit: '/10', digits: 1 },
  { value: 'sleepHours', label: 'Sleep', unit: 'hrs', digits: 1 },
  { value: 'steps', label: 'Steps', unit: '', digits: 0 },
];

export default function Progress() {
  const today = useToday();
  const [range, setRange] = useState<Range>('90');
  const [metric, setMetric] = useState<Metric>('weightKg');
  const profile = useProfileStore((s) => s.profile);
  const logs = useDailyStore((s) => s.logs);
  const photos = useDailyStore((s) => s.photos);
  const sessions = useWorkoutStore((s) => s.sessions);
  const entries = useNutritionStore((s) => s.entries);
  const { schedule, targets } = usePlanStore();

  const firstDate = useMemo(() => {
    const all = [...Object.keys(logs), ...entries.map((e) => e.date), ...sessions.map((s) => s.date), (profile ? toDateKey(new Date(profile.createdAt)) : today)];
    return all.sort()[0];
  }, [logs, entries, sessions, profile, today]);
  const from = range === 'all' ? firstDate : maxDate(firstDate, addDays(today, -(Number(range) - 1)));
  const dates = useMemo(() => dateRange(from, today), [from, today]);

  const weight = currentWeight(logs, profile?.weightKg ?? 0);
  const startWeight = useMemo(() => {
    const d = Object.keys(logs).filter((k) => logs[k].weightKg != null).sort();
    return d.length ? logs[d[0]].weightKg! : weight;
  }, [logs, weight]);
  const goal = profile?.goalWeightKg ?? weight;
  const goalProgress = startWeight === goal ? (weight === goal ? 1 : 0) : (startWeight - weight) / (startWeight - goal);

  const active = useMemo(() => activeDates(logs, entries, sessions), [logs, entries, sessions]);
  const streak = currentStreak(active, today);

  const m = METRICS.find((x) => x.value === metric)!;
  const series = useMemo(() => buildSeries(logs, dates, metric), [logs, dates, metric]);
  const delta = series.length > 1 ? series[series.length - 1].value - series[0].value : null;

  const training = trainingConsistency(sessions, schedule, dates);
  const loggedDates = dates.filter((d) => entries.some((e) => e.date === d));
  const nutrition = nutritionConsistency(entries, loggedDates, targets);
  const strength = useMemo(() => strengthTrends(sessions.filter((s) => s.date >= from)).slice(0, 4), [sessions, from]);

  const addPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [3, 4] });
    if (!res.canceled && res.assets[0]) useDailyStore.getState().addPhoto(today, res.assets[0].uri);
  };

  return (
    <Screen>
      <AppHeader />
      <PageTitle title="Progress" />

      <View style={styles.row}>
        <Card style={styles.half} onPress={() => router.push('/log-weight')} accessibilityLabel="Log weight">
          <View style={styles.halfTop}>
            <IconBadge icon="scale-bathroom" size={40} rounded="square" />
            <Text style={styles.smallLabel}>Weight</Text>
          </View>
          <View>
            <Text style={styles.big}>
              {trimNum(weight)}
              <Text style={styles.bigUnit}> kg</Text>
            </Text>
            <Text style={styles.smallLabel}>Goal {trimNum(goal)} kg</Text>
          </View>
          <ProgressBar value={goalProgress} />
        </Card>
        <Card style={styles.half}>
          <View style={styles.halfTop}>
            <IconBadge icon="fire" tone="yellow" size={40} rounded="square" />
            <Text style={styles.smallLabel}>Day Streak</Text>
          </View>
          <Text style={styles.big}>
            {streak}
            <Text style={styles.bigUnit}> {streak === 1 ? 'day' : 'days'}</Text>
          </Text>
          <WeekDots filled={weekDates(today).map((d) => active.has(d))} size={14} />
        </Card>
      </View>

      <SegmentedControl options={RANGES} value={range} onChange={setRange} />

      <Card style={{ gap: spacing.md }}>
        <View style={styles.trendHead}>
          <Text style={styles.cardTitle}>{m.label} Progress</Text>
          {delta != null ? (
            <View style={styles.delta}>
              <Icon name={delta < 0 ? 'arrow-down' : 'arrow-up'} size={16} color={colors.primary} />
              <Text style={styles.deltaText}>
                {delta > 0 ? '+' : ''}
                {delta.toFixed(m.digits)} {m.unit}
              </Text>
            </View>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {METRICS.map((x) => (
            <Chip key={x.value} label={x.label} selected={x.value === metric} onPress={() => setMetric(x.value)} />
          ))}
        </ScrollView>
        {series.length ? (
          <>
            <LineChart data={series} format={(v) => (m.digits ? v.toFixed(m.value === 'weightKg' ? 0 : 1) : formatSteps(v))} />
            {delta != null ? <Text style={styles.since}>since {formatMonthDay(from)}</Text> : null}
          </>
        ) : (
          <EmptyState
            icon="chart-line"
            title={`No ${m.label.toLowerCase()} data yet`}
            body={metric === 'weightKg' ? 'Tap your weight above to log it.' : 'Add it in your daily check-in on Home.'}
          />
        )}
      </Card>

      <SectionHeader title="Consistency" />
      <View style={styles.row}>
        <ConsistencyTile icon="dumbbell" label="Training" value={training.completed} total={training.scheduled} suffix="sessions" />
        <ConsistencyTile
          icon="bowl-mix"
          tone="yellow"
          label="Nutrition"
          value={nutrition.onTarget}
          total={nutrition.total}
          suffix="logged days on target"
          color={colors.highlight}
        />
      </View>

      <SectionHeader title="Strength" />
      <Card style={{ paddingVertical: spacing.xs }}>
        {strength.length ? (
          strength.map((t, i) => (
            <View key={t.exerciseId} style={[styles.strRow, i < strength.length - 1 && styles.divider]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.strName}>{getExercise(t.exerciseId).name}</Text>
                <Text style={styles.strSub}>Estimated 1 rep max</Text>
              </View>
              <Text style={styles.strValue}>{trimNum(Math.round(t.latest * 2) / 2)} kg</Text>
              <Text style={[styles.strChange, { color: t.change >= 0 ? colors.success : colors.danger }]}>
                {Math.abs(t.change) < 0.5 ? '' : `${t.change > 0 ? '+' : ''}${trimNum(Math.round(t.change * 2) / 2)}`}
              </Text>
            </View>
          ))
        ) : (
          <EmptyState icon="weight-lifter" title="No lifts logged yet" body="Finish a workout to start tracking strength." />
        )}
      </Card>

      <SectionHeader title="Progress Photos" right={photos.length ? `${photos.length}` : undefined} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
        <Pressable onPress={addPhoto} style={styles.addPhoto} accessibilityRole="button" accessibilityLabel="Add progress photo">
          <Icon name="camera-plus" size={28} color={colors.primary} />
          <Text style={styles.addPhotoText}>Add</Text>
        </Pressable>
        {[...photos].reverse().map((p) => (
          <Pressable
            key={p.id}
            onLongPress={async () => (await confirm('Delete photo?', 'This removes it from your progress photos.', 'Delete', true)) && useDailyStore.getState().removePhoto(p.id)}
            accessibilityLabel={`Progress photo from ${formatMonthDay(p.date)}`}
          >
            <Image source={{ uri: p.uri }} style={styles.photo} />
            <Text style={styles.photoDate}>{formatMonthDay(p.date)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

function ConsistencyTile({
  icon,
  label,
  value,
  total,
  suffix,
  tone = 'blue',
  color,
}: {
  icon: 'dumbbell' | 'bowl-mix';
  label: string;
  value: number;
  total: number;
  suffix: string;
  tone?: 'blue' | 'yellow';
  color?: string;
}) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <Card style={[styles.half, { gap: spacing.sm }]}>
      <View style={styles.halfTop}>
        <IconBadge icon={icon} tone={tone} size={40} />
        <Text style={styles.smallLabel}>{label}</Text>
      </View>
      <Text style={styles.big}>
        {pct}
        <Text style={styles.bigUnit}>%</Text>
      </Text>
      <ProgressBar value={total ? value / total : 0} color={color} />
      <Text style={styles.tiny}>
        {value} / {total} {suffix}
      </Text>
    </Card>
  );
}

function maxDate(a: DateKey, b: DateKey) {
  return a > b ? a : b;
}

function formatSteps(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v));
}

/** Daily points for short ranges; weekly averages when there are too many days. */
function buildSeries(logs: Record<DateKey, DailyLog>, dates: DateKey[], metric: Metric): Point[] {
  const daily = dates.filter((d) => logs[d]?.[metric] != null).map((d) => ({ date: d, value: logs[d][metric] as number }));
  const longRange = dates.length > 120;
  if (daily.length <= 40) return daily.map((p) => ({ label: longRange ? formatMonth(p.date) : formatMonthDay(p.date), value: p.value }));
  const buckets = new Map<string, number[]>();
  daily.forEach((p) => {
    const key = dates[Math.floor(dates.indexOf(p.date) / 7) * 7];
    buckets.set(key, [...(buckets.get(key) ?? []), p.value]);
  });
  return [...buckets.entries()].map(([d, vs]) => ({ label: longRange ? formatMonth(d) : formatMonthDay(d), value: vs.reduce((a, b) => a + b, 0) / vs.length }));
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1, gap: spacing.md, padding: spacing.lg },
  halfTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  smallLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  big: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  bigUnit: { fontSize: 16, fontWeight: '500', color: colors.textSecondary },
  tiny: { fontSize: 12, color: colors.textSecondary },
  trendHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primarySoft, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  deltaText: { fontSize: 15, fontWeight: '700', color: colors.text },
  since: { fontSize: 12, color: colors.textSecondary, textAlign: 'right', marginTop: -6 },
  strRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E3E8EE' },
  strName: { fontSize: 16, fontWeight: '600', color: colors.text },
  strSub: { fontSize: 12, color: colors.textSecondary },
  strValue: { fontSize: 17, fontWeight: '800', color: colors.text },
  strChange: { width: 48, textAlign: 'right', fontSize: 14, fontWeight: '700' },
  addPhoto: { width: 96, height: 128, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center', gap: 4 },
  addPhotoText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  photo: { width: 96, height: 128, borderRadius: 18, backgroundColor: colors.track },
  photoDate: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
});
