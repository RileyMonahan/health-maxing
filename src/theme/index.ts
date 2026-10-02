import { Platform, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  background: '#F7FAFD',
  surface: '#FFFFFF',
  primary: '#2E9BF0',
  primaryDark: '#1C7FD0',
  primarySoft: '#EAF5FE',
  primaryMuted: '#CFE7FC',
  highlight: '#FFC93C',
  highlightSoft: '#FFF6DC',
  text: '#0B1220',
  textSecondary: '#6B7785',
  textTertiary: '#A3ADB8',
  border: '#EDF1F5',
  track: '#EEF2F6',
  success: '#22B07D',
  successSoft: '#E5F7F0',
  danger: '#E5484D',
  dangerSoft: '#FDECEC',
  overlay: 'rgba(11, 18, 32, 0.4)',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 24, pill: 999 } as const;

export const type = {
  hero: { fontSize: 56, fontWeight: '800', letterSpacing: -1.5, color: colors.text },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.6, color: colors.text },
  heading: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: colors.text },
  subheading: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { fontSize: 16, fontWeight: '500', color: colors.text },
  bodySecondary: { fontSize: 15, fontWeight: '400', color: colors.textSecondary },
  caption: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  stat: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4, color: colors.text },
} satisfies Record<string, TextStyle>;

export const shadow: ViewStyle = Platform.select({
  web: { boxShadow: '0 6px 24px rgba(46, 82, 128, 0.08)' } as ViewStyle,
  default: {
    shadowColor: '#2E5280',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
})!;

export const theme = { colors, spacing, radius, type, shadow };
