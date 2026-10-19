import { MD3LightTheme, configureFonts } from 'react-native-paper';

/** Centraliza cores, espaçamentos e medidas do GUIA-VISUAL.MD; as telas reutilizam estes valores. */
export const tokens = {
  color: {
    primary: '#166534', primaryPressed: '#14532D', onPrimary: '#FFFFFF',
    background: '#F7FAF7', surface: '#FFFFFF', surfaceMuted: '#EEF2EF',
    text: '#17251C', textSecondary: '#526158', border: '#D4DED6',
    controlBorder: '#6B7C70', success: '#166534', successBg: '#DCFCE7',
    warning: '#92400E', warningBg: '#FEF3C7', error: '#B91C1C',
    errorBg: '#FEE2E2', info: '#1E40AF', infoBg: '#DBEAFE',
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { input: 12, card: 16, badge: 999 },
  size: { button: 52, input: 56, touch: 48, formWidth: 480 },
} as const;

/** Traduz a identidade do cultiva-e para os papéis de cor e tipografia do React Native Paper. */
export const theme = {
  ...MD3LightTheme,
  roundness: tokens.radius.input / 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: tokens.color.primary,
    onPrimary: tokens.color.onPrimary,
    primaryContainer: tokens.color.successBg,
    onPrimaryContainer: tokens.color.primaryPressed,
    secondary: tokens.color.primary,
    onSecondary: tokens.color.onPrimary,
    secondaryContainer: tokens.color.surfaceMuted,
    onSecondaryContainer: tokens.color.text,
    tertiary: tokens.color.primary,
    onTertiary: tokens.color.onPrimary,
    tertiaryContainer: tokens.color.infoBg,
    onTertiaryContainer: tokens.color.info,
    background: tokens.color.background,
    onBackground: tokens.color.text,
    surface: tokens.color.surface,
    onSurface: tokens.color.text,
    surfaceVariant: tokens.color.surfaceMuted,
    onSurfaceVariant: tokens.color.textSecondary,
    outline: tokens.color.controlBorder,
    outlineVariant: tokens.color.border,
    error: tokens.color.error,
    onError: tokens.color.onPrimary,
    errorContainer: tokens.color.errorBg,
    onErrorContainer: tokens.color.error,
    surfaceDisabled: tokens.color.surfaceMuted,
    onSurfaceDisabled: tokens.color.textSecondary,
    inverseSurface: tokens.color.text,
    inverseOnSurface: tokens.color.surface,
    inversePrimary: tokens.color.successBg,
    elevation: {
      level0: 'transparent', level1: tokens.color.surface, level2: tokens.color.surfaceMuted,
      level3: tokens.color.surfaceMuted, level4: tokens.color.surfaceMuted, level5: tokens.color.surfaceMuted,
    },
  },
  fonts: configureFonts({ config: {
    headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
    titleLarge: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
    titleMedium: { fontSize: 18, lineHeight: 26, fontWeight: '600' },
    bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    bodySmall: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
    labelLarge: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
    labelMedium: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  } }),
};
