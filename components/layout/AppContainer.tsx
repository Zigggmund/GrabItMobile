// STATUSBAR в другом месте поменять нельзя - он может быть лишь один для приложения

import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/hooks/useTheme';

export default function AppContainer() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Slot />
    </>
  );
}
