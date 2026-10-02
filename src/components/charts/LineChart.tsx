import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '@/theme';

export interface Point {
  label: string;
  value: number;
}

interface Props {
  data: Point[];
  height?: number;
  color?: string;
  format?: (v: number) => string;
  /** force the y axis to include these bounds */
  minY?: number;
  maxY?: number;
}

const PAD = { top: 16, right: 16, bottom: 26, left: 34 };

export function LineChart({ data, height = 200, color = colors.primary, format = (v) => String(Math.round(v)), minY, maxY }: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const values = data.map((d) => d.value);
  let lo = Math.min(...values, minY ?? Infinity);
  let hi = Math.max(...values, maxY ?? -Infinity);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const span = hi - lo;
  lo -= span * 0.1;
  hi += span * 0.1;

  const w = Math.max(0, width - PAD.left - PAD.right);
  const h = height - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w);
  const y = (v: number) => PAD.top + h - ((v - lo) / (hi - lo)) * h;

  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = data.length > 1 ? `${line} L${x(data.length - 1)},${PAD.top + h} L${x(0)},${PAD.top + h} Z` : '';
  const ticks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3);
  let tickLabels = ticks.map(format);
  if (new Set(tickLabels).size < tickLabels.length) tickLabels = ticks.map((t) => t.toFixed(1));
  const xLabelIdx = pickLabels(data.length, 5);
  const last = data[data.length - 1];

  return (
    <View style={{ height }} onLayout={onLayout}>
      {width > 0 && data.length > 0 ? (
        <>
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.18} />
                <Stop offset="1" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {ticks.map((t) => (
              <Line key={t} x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={colors.border} strokeDasharray="4 6" />
            ))}
            {area ? <Path d={area} fill="url(#fill)" /> : null}
            <Path d={line} stroke={color} strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {data.length <= 12 &&
              data.map((d, i) => <Circle key={i} cx={x(i)} cy={y(d.value)} r={4} fill="#fff" stroke={color} strokeWidth={2} />)}
            <Circle cx={x(data.length - 1)} cy={y(last.value)} r={7} fill="#fff" stroke={color} strokeWidth={3} />
          </Svg>
          {ticks.map((t, i) => (
            <Text key={t} style={[styles.yLabel, { top: y(t) - 8 }]}>
              {tickLabels[i]}
            </Text>
          ))}
          {xLabelIdx.map((i) => (
            <Text key={i} style={[styles.xLabel, { left: x(i) - 30 }]} numberOfLines={1}>
              {data[i].label}
            </Text>
          ))}
          <View style={[styles.bubble, { left: Math.min(width - 72, Math.max(0, x(data.length - 1) - 36)), top: Math.max(0, y(last.value) - 42) }]}>
            <Text style={styles.bubbleText}>{format(last.value)}</Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

function pickLabels(n: number, max: number): number[] {
  if (n <= max) return Array.from({ length: n }, (_, i) => i);
  const out: number[] = [];
  for (let k = 0; k < max; k++) out.push(Math.round((k * (n - 1)) / (max - 1)));
  return out;
}

const styles = StyleSheet.create({
  yLabel: { position: 'absolute', left: 0, width: 30, fontSize: 11, color: colors.textSecondary },
  xLabel: { position: 'absolute', bottom: 0, width: 60, textAlign: 'center', fontSize: 11, color: colors.textSecondary },
  bubble: { position: 'absolute', width: 72, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 4, alignItems: 'center' },
  bubbleText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
