import { MD3LightTheme, DefaultTheme } from 'react-native-paper';

const colors = {
  primary: '#4F46E5', // indigo-600
  primaryLight: '#818CF8', // indigo-400
  primaryDark: '#3730A3', // indigo-800
  secondary: '#F97316', // orange-500
  secondaryLight: '#FB923C', // orange-400
  secondaryDark: '#C2410C', // orange-700
  background: '#F9FAFB', // gray-50
  surface: '#FFFFFF',
  error: '#EF4444', // red-500
  text: '#1F2937', // gray-800
  onSurface: '#374151', // gray-700
  disabled: '#9CA3AF', // gray-400
  placeholder: '#6B7280', // gray-500
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#EF4444', // red-500
  success: '#10B981', // emerald-500
  warning: '#F59E0B', // amber-500
  info: '#3B82F6', // blue-500
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onSurface: colors.onSurface,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
    notification: colors.notification,
  },
  roundness: 8,
};

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.disabled,
    notification: colors.notification,
  },
};

export default colors;
