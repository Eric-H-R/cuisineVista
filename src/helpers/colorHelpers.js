// helpers/colorHelpers.js
import colors, { withAlpha } from '../theme/colores';

export const getColor = (colorPath, alpha = null) => {
  const keys = colorPath.split('.');
  let value = colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return '#000000';
  }
  
  if (alpha && typeof value === 'string') {
    return withAlpha(value, colors.alpha[alpha] || alpha);
  }
  
  return value;
};

// Colores predefinidos para uso común
export const themeColors = {
  // Primarios
  primary: colors.primary.main,
  primaryLight: colors.primary.light,
  primaryDark: colors.primary.dark,
  
  // Secundarios
  secondary: colors.secondary.main,
  secondaryLight: colors.secondary.light,
  secondaryDark: colors.secondary.dark,
  
  // Acento
  accent: colors.accent.main,
  accentLight: colors.accent.light,
  accentDark: colors.accent.dark,
  
  // Estados
  success: colors.status.success,
  warning: colors.status.warning,
  error: colors.status.error,
  info: colors.status.info,
  
  // Fondos
  backgroundDefault: colors.background.default,
  backgroundPaper: colors.background.paper,
  backgroundLight: colors.background.light,
  
  // Textos
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,
  textDisabled: colors.text.disabled
};