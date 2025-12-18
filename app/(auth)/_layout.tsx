import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/hooks/useTheme';

export default function AuthLayout() {
  const { colors, theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.theme.white.bright }}
    >
      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
        backgroundColor={colors.theme.white.bright}
      />
      <Slot />
    </SafeAreaView>
  );
}
