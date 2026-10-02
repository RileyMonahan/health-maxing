import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Icon, ModalHeader, Screen, TextField } from '@/components/ui';
import { SAMPLE_BARCODES } from '@/content/sampleFoods';
import { defaultMeal, foodCache, isMealType } from '@/features/nutrition/meta';
import { MockNotice } from '@/features/nutrition/MockNotice';
import { foodService } from '@/services';
import { colors, radius, spacing } from '@/theme';

/**
 * Barcode scanner placeholder. The camera view is mocked; lookups already go
 * through FoodService.getByBarcode, so a real scanner only needs to supply the code.
 */
export default function ScanBarcode() {
  const params = useLocalSearchParams<{ meal?: string }>();
  const meal = isMealType(params.meal) ? params.meal : defaultMeal();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const lookup = async (barcode: string) => {
    setLoading(true);
    setNotFound(false);
    const food = await foodService.getByBarcode(barcode).catch(() => null);
    setLoading(false);
    if (!food) {
      setNotFound(true);
      return;
    }
    foodCache.put([food]);
    router.push({ pathname: '/nutrition/food', params: { id: food.id, meal, back: '2' } });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title="Scan Barcode" close />
      <View style={styles.viewfinder}>
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
        <Icon name="barcode-scan" size={72} color="rgba(255,255,255,0.85)" />
        <Text style={styles.vfText}>Camera scanning coming soon</Text>
      </View>
      {foodService.isMock ? <MockNotice text="Scanning is a preview for now. Enter a barcode or try a sample below." /> : null}

      <Card style={{ gap: spacing.md }}>
        <TextField value={code} onChangeText={(t) => setCode(t.replace(/[^0-9]/g, ''))} placeholder="Enter barcode number" keyboardType="number-pad" />
        <Button title="Look up" onPress={() => lookup(code)} disabled={code.length < 6} loading={loading} size="md" />
        {notFound ? (
          <View style={{ gap: spacing.sm }}>
            <Text style={styles.nf}>No match for that barcode.</Text>
            <Button title="Add it manually" variant="secondary" size="md" onPress={() => router.replace({ pathname: '/nutrition/quick-add', params: { meal } })} />
          </View>
        ) : null}
      </Card>

      <Text style={styles.section}>Try a sample</Text>
      <View style={styles.samples}>
        {SAMPLE_BARCODES.map((s) => (
          <Chip key={s.barcode} label={s.name} icon="barcode" onPress={() => lookup(s.barcode)} />
        ))}
      </View>
    </Screen>
  );
}

const C = 28;
const styles = StyleSheet.create({
  viewfinder: { height: 220, borderRadius: radius.xl, backgroundColor: '#1D2A3A', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  vfText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' },
  corner: { position: 'absolute', width: C, height: C, borderColor: colors.primary },
  tl: { top: 24, left: 40, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 10 },
  tr: { top: 24, right: 40, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 10 },
  bl: { bottom: 24, left: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 10 },
  br: { bottom: 24, right: 40, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 10 },
  nf: { fontSize: 15, color: colors.text, fontWeight: '600', textAlign: 'center' },
  section: { fontSize: 15, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  samples: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
