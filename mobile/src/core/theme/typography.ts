import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
  display: 'Manrope_300Light',
  displayMedium: 'Manrope_500Medium',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: fontFamily.display,
    fontSize: fontSize['3xl'],
    fontWeight: '300',
    lineHeight: 38,
    letterSpacing: -1.2,
  },
  h2: {
    fontFamily: fontFamily.displayMedium,
    fontSize: fontSize['2xl'],
    fontWeight: '500',
    lineHeight: 32,
    letterSpacing: -0.8,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    fontWeight: '400',
    lineHeight: 16,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    fontWeight: '500',
    lineHeight: 20,
  },
  eyebrow: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base,
    fontWeight: '600',
    lineHeight: 24,
  },
};
