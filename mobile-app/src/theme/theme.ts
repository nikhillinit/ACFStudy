import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563eb',
    primaryContainer: '#dbeafe',
    secondary: '#7c3aed',
    secondaryContainer: '#ede9fe',
    tertiary: '#059669',
    tertiaryContainer: '#d1fae5',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#f1f5f9',
    error: '#dc2626',
    errorContainer: '#fecaca',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onTertiary: '#ffffff',
    onSurface: '#1e293b',
    onSurfaceVariant: '#64748b',
    onBackground: '#0f172a',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60a5fa',
    primaryContainer: '#1e40af',
    secondary: '#a78bfa',
    secondaryContainer: '#5b21b6',
    tertiary: '#34d399',
    tertiaryContainer: '#047857',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    background: '#0f172a',
    error: '#f87171',
    errorContainer: '#991b1b',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onTertiary: '#ffffff',
    onSurface: '#f1f5f9',
    onSurfaceVariant: '#94a3b8',
    onBackground: '#f8fafc',
  },
};

export const theme = lightTheme; // Default to light theme

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  padding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    lineHeight: 24,
  },
  smallText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
};