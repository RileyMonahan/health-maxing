import { StyleSheet, Text, View } from 'react-native';
import { formatTime } from '@/domain/dates';
import type { CoachMessage } from '@/domain/models';
import { colors } from '@/theme';

export function MessageBubble({ message }: { message: CoachMessage }) {
  const mine = message.sender === 'client';
  return (
    <View style={[styles.wrap, mine ? styles.right : styles.left]}>
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        <Text style={[styles.text, mine && { color: '#fff' }]}>{message.body}</Text>
      </View>
      <Text style={[styles.time, mine && { textAlign: 'right' }]}>
        {formatTime(message.createdAt)}
        {mine && message.status === 'sending' ? ' · Sending' : ''}
        {mine && message.status === 'failed' ? ' · Not sent' : ''}
      </Text>
    </View>
  );
}

export function DayDivider({ label }: { label: string }) {
  return <Text style={styles.day}>{label}</Text>;
}

const styles = StyleSheet.create({
  wrap: { maxWidth: '82%', gap: 4, marginVertical: 4 },
  left: { alignSelf: 'flex-start' },
  right: { alignSelf: 'flex-end' },
  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 6 },
  theirs: { backgroundColor: colors.surface, borderBottomLeftRadius: 6, borderWidth: 1, borderColor: colors.border },
  text: { fontSize: 16, lineHeight: 22, color: colors.text },
  time: { fontSize: 11, color: colors.textTertiary, paddingHorizontal: 6 },
  day: { textAlign: 'center', fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginVertical: 12 },
});
