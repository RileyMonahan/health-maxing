import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui';
import { colors, radius } from '@/theme';

/** Small banner shown while a feature runs on sample data. */
export function MockNotice({ text }: { text: string }) {
  return (
    <View style={styles.wrap}>
      <Icon name="information-outline" size={18} color="#B57E00" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.highlightSoft, borderRadius: radius.md, padding: 12 },
  text: { flex: 1, fontSize: 13, color: '#7A5600', lineHeight: 18 },
});
