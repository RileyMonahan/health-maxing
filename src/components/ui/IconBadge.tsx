import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { Icon, IconName } from './Icon';

export type Tone = 'blue' | 'yellow' | 'green' | 'grey';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  blue: { bg: colors.primarySoft, fg: colors.primary },
  yellow: { bg: colors.highlightSoft, fg: '#F5A800' },
  green: { bg: colors.successSoft, fg: colors.success },
  grey: { bg: colors.track, fg: colors.textSecondary },
};

export function IconBadge({ icon, tone = 'blue', size = 44, rounded = 'circle' }: { icon: IconName; tone?: Tone; size?: number; rounded?: 'circle' | 'square' }) {
  const t = TONES[tone];
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: rounded === 'circle' ? size / 2 : size * 0.28, backgroundColor: t.bg },
      ]}
    >
      <Icon name={icon} size={size * 0.5} color={t.fg} />
    </View>
  );
}

const styles = StyleSheet.create({ badge: { alignItems: 'center', justifyContent: 'center' } });
