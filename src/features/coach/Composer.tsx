import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors } from '@/theme';

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    onSend(text);
    setText('');
  };
  return (
    <View style={styles.row}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message your coach"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        multiline
        numberOfLines={1}
        maxLength={2000}
        onSubmitEditing={send}
        blurOnSubmit={false}
        accessibilityLabel="Message"
      />
      <Pressable onPress={send} disabled={!canSend} style={[styles.send, !canSend && { opacity: 0.4 }]} accessibilityRole="button" accessibilityLabel="Send message">
        <Icon name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 16,
    color: colors.text,
    outlineStyle: 'none',
  } as object,
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
