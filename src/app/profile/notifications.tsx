import { StyleSheet, Switch, Text, View } from 'react-native';
import { Card, ModalHeader, Screen } from '@/components/ui';
import type { NotificationPrefs } from '@/domain/models';
import { useProfileStore } from '@/store';
import { colors, spacing } from '@/theme';

const ITEMS: { key: keyof NotificationPrefs; title: string; subtitle: string }[] = [
  { key: 'checkIn', title: 'Morning check-in', subtitle: 'A nudge to log energy and sleep' },
  { key: 'workout', title: 'Workout days', subtitle: "A reminder on days you're training" },
  { key: 'meals', title: 'Meal logging', subtitle: 'Reminders to log meals' },
  { key: 'coach', title: 'Coach messages', subtitle: 'When your coach replies' },
];

export default function Notifications() {
  const prefs = useProfileStore((s) => s.notifications);
  const set = useProfileStore((s) => s.setNotifications);
  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title="Notifications" />
      <Card style={{ paddingVertical: spacing.xs }}>
        {ITEMS.map((it, i) => (
          <View key={it.key} style={[styles.row, i < ITEMS.length - 1 && styles.divider]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.title}>{it.title}</Text>
              <Text style={styles.sub}>{it.subtitle}</Text>
            </View>
            <Switch
              value={prefs[it.key]}
              onValueChange={(v) => set({ [it.key]: v })}
              trackColor={{ true: colors.primary, false: colors.track }}
              thumbColor="#fff"
              accessibilityLabel={it.title}
            />
          </View>
        ))}
      </Card>
      <Text style={styles.note}>Your choices are saved now. Push reminders switch on when notifications are connected in a later version.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E3E8EE' },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  sub: { fontSize: 13, color: colors.textSecondary },
  note: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
