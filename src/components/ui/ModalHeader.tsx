import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Icon } from './Icon';

/** Title bar for modal and pushed screens: back/close on the left. */
export function ModalHeader({ title, close = false, right, onBack }: { title?: string; close?: boolean; right?: ReactNode; onBack?: () => void }) {
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <View style={styles.row}>
      <Pressable onPress={back} hitSlop={10} accessibilityRole="button" accessibilityLabel={close ? 'Close' : 'Back'} style={styles.btn}>
        <Icon name={close ? 'close' : 'chevron-left'} size={26} color={colors.text} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm },
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
