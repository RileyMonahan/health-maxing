import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, IconBadge, IconName, ListRow, ModalHeader, Screen } from '@/components/ui';
import { NUTRITION_PLANS } from '@/content/nutritionPlans';
import { TRAINING_PLANS } from '@/content/trainingPlans';
import { trainingDaysOf } from '@/domain/schedule';
import { trimNum } from '@/domain/strength';
import { GOAL_OPTIONS } from '@/features/onboarding/options';
import { resetAllData, usePlanStore, useProfileStore } from '@/store';
import { colors, spacing } from '@/theme';
import { confirm } from '@/utils/confirm';

export default function Profile() {
  const profile = useProfileStore((s) => s.profile);
  const { trainingPlanId, nutritionPlanId, schedule, targets } = usePlanStore();
  if (!profile) return null;

  const goals = GOAL_OPTIONS.filter((g) => profile.goals.includes(g.id)).map((g) => g.label);
  const reset = async () => {
    if (await confirm('Reset all data?', 'This deletes your profile, workouts, food log and check-ins from this device.', 'Reset', true)) {
      await resetAllData();
    }
  };

  const row = (icon: IconName, title: string, subtitle: string, href: Parameters<typeof router.push>[0], last = false) => (
    <ListRow left={<IconBadge icon={icon} size={40} />} title={title} subtitle={subtitle} onPress={() => router.push(href)} divider={!last} />
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title="Profile" />
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.sub}>
          {profile.age} yrs · {trimNum(profile.heightCm)} cm · {trimNum(profile.weightKg)} kg
        </Text>
      </View>

      <Card style={styles.group}>
        {row('account-outline', 'Personal info', 'Name, age, height, weight', '/profile/personal')}
        {row('target', 'Goals', goals.join(', ') || 'Not set', '/profile/goals', true)}
      </Card>

      <Card style={styles.group}>
        {row('dumbbell', 'Training plan & days', `${TRAINING_PLANS[trainingPlanId].name} · ${trainingDaysOf(schedule).length} days a week`, '/workout/adjust')}
        {row('food-apple', 'Nutrition plan', NUTRITION_PLANS[nutritionPlanId].name, '/profile/plans')}
        {row('fire', 'Calorie & macro targets', `${targets.calories} kcal · ${targets.proteinG} g protein${targets.custom ? ' · custom' : ''}`, '/profile/targets', true)}
      </Card>

      <Card style={styles.group}>
        {row('bell-outline', 'Notifications', 'Reminders and coach messages', '/profile/notifications')}
        <ListRow left={<IconBadge icon="shield-check-outline" size={40} />} title="Account" subtitle="Stored on this device. Sign in coming soon." divider={false} />
      </Card>

      <Card style={styles.group}>
        <ListRow left={<IconBadge icon="trash-can-outline" tone="grey" size={40} />} title="Reset all data" onPress={reset} chevron={false} divider={false} />
      </Card>
      <Text style={styles.version}>Health Maxing v1.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 34, fontWeight: '800' },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  sub: { fontSize: 15, color: colors.textSecondary },
  group: { paddingVertical: spacing.xs },
  version: { textAlign: 'center', fontSize: 12, color: colors.textTertiary },
});
