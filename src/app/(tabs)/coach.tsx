import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, Card, Icon } from '@/components/ui';
import { formatShortDate, todayKey, toDateKey } from '@/domain/dates';
import type { Coach, CoachMessage } from '@/domain/models';
import { Composer } from '@/features/coach/Composer';
import { DayDivider, MessageBubble } from '@/features/coach/MessageBubble';
import { MockNotice } from '@/features/nutrition/MockNotice';
import { coachService } from '@/services';
import { isWithinSupportHours, SUPPORT_HOURS } from '@/services/coach/CoachService';
import { colors, spacing, type } from '@/theme';

type Row = { kind: 'day'; key: string; label: string } | { kind: 'msg'; key: string; message: CoachMessage };

export default function CoachChat() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const list = useRef<FlatList<Row>>(null);
  const online = isWithinSupportHours();

  useEffect(() => {
    coachService.getCoach().then(setCoach);
    coachService.listMessages().then(setMessages);
    return coachService.subscribe((m) => setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev.map((x) => (x.id === m.id ? m : x)) : [...prev, m])));
  }, []);

  const rows: Row[] = [];
  let lastDay = '';
  messages.forEach((m) => {
    const day = toDateKey(new Date(m.createdAt));
    if (day !== lastDay) {
      rows.push({ kind: 'day', key: `d${day}`, label: day === todayKey() ? 'Today' : formatShortDate(day) });
      lastDay = day;
    }
    rows.push({ kind: 'msg', key: m.id, message: m });
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <AppHeader />
          <Text style={type.title}>Coach</Text>
          <Card style={styles.coachCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{coach?.initials ?? ''}</Text>
              <View style={[styles.dot, { backgroundColor: online ? colors.success : colors.textTertiary }]} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.coachName}>{coach?.name ?? ' '}</Text>
              <Text style={styles.coachRole} numberOfLines={1}>
                {coach?.role ?? ' '}
              </Text>
              <View style={styles.hours}>
                <Icon name="clock-outline" size={14} color="#B57E00" />
                <Text style={styles.hoursText}>Support: {SUPPORT_HOURS.label}</Text>
              </View>
            </View>
          </Card>
          {!online ? <Text style={styles.offline}>The team is offline now and will reply after 8am.</Text> : null}
        </View>
        <FlatList
          ref={list}
          data={rows}
          keyExtractor={(r) => r.key}
          renderItem={({ item }) => (item.kind === 'day' ? <DayDivider label={item.label} /> : <MessageBubble message={item.message} />)}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={coachService.isMock ? <MockNotice text="Preview chat: messages stay on this device until live coaching is connected." /> : null}
          keyboardShouldPersistTaps="handled"
        />
        <View style={styles.composer}>
          <Composer onSend={(text) => coachService.sendMessage(text)} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: spacing.sm },
  coachCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  dot: { position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
  coachName: { fontSize: 17, fontWeight: '700', color: colors.text },
  coachRole: { fontSize: 13, color: colors.textSecondary },
  hours: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.highlightSoft, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, marginTop: 4 },
  hoursText: { fontSize: 12, fontWeight: '700', color: '#7A5600' },
  offline: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  list: { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, gap: 2 },
  composer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.background },
});
