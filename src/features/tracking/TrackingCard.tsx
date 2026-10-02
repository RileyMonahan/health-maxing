import { StyleSheet, Text, View } from 'react-native';
import { Card, Icon, IconName } from '@/components/ui';
import { colors, spacing } from '@/theme';

interface Props {
  icon: IconName;
  title: string;
  subtitle: string;
  metaIcon: IconName;
  meta: string;
  metaSuffix?: string;
  onPress: () => void;
}

export function TrackingCard({ icon, title, subtitle, metaIcon, meta, metaSuffix, onPress }: Props) {
  return (
    <Card onPress={onPress} style={styles.card} accessibilityLabel={`${title}. ${subtitle}. ${meta} ${metaSuffix ?? ''}`}>
      <View style={styles.icon}>
        <Icon name={icon} size={40} color={colors.primary} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.meta}>
          <Icon name={metaIcon} size={18} color={colors.primary} />
          <Text style={styles.metaText}>
            {meta}
            {metaSuffix ? <Text style={styles.metaSuffix}>{metaSuffix}</Text> : null}
          </Text>
        </View>
      </View>
      <View style={styles.chev}>
        <Icon name="chevron-right" size={22} color={colors.textSecondary} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xxl },
  icon: { width: 76, height: 76, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 4 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  metaText: { fontSize: 17, fontWeight: '700', color: colors.text },
  metaSuffix: { fontSize: 15, fontWeight: '500', color: colors.textSecondary },
  chev: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.track, alignItems: 'center', justifyContent: 'center' },
});
