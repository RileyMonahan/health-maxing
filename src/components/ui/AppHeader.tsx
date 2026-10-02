import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Icon } from './Icon';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <View style={[styles.logo, { width: size, height: size, borderRadius: size * 0.3 }]}>
      <Icon name="leaf" size={size * 0.62} color={colors.primary} />
    </View>
  );
}

/** Brand row shown at the top of every tab, with the profile button. */
export function AppHeader() {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <Logo />
        <Text style={styles.name}>Health Maxing</Text>
      </View>
      <Pressable
        onPress={() => router.push('/profile')}
        accessibilityRole="button"
        accessibilityLabel="Profile and settings"
        hitSlop={8}
        style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.7 }]}
      >
        <Icon name="account" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.sm },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.track, alignItems: 'center', justifyContent: 'center' },
});
