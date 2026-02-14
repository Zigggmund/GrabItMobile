// STATUSBAR в другом месте поменять нельзя - он может быть лишь один для приложения

import { useEffect } from 'react';
import { router, Slot, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';

// !!!ЗДЕСЬ НЕ ИСПОЛЬЗУЕТСЯ useHistory.
// Блокировка маршрутов не должна сохраняться в стеке
export default function AppContainer() {
  const { theme } = useTheme();
  const { isAuth, isLoading } = useProfile();
  const segments = useSegments();

  useEffect(() => {
    // если еще не загружено - откладываем до загрузки
    if (isLoading) {
      return;
    }
    const isAuthGroup = segments[0] == '(auth)';
    // блокировка маршрутов для незалогинненых юзеров
    if (!isAuth && !isAuthGroup) {
      router.replace('/(auth)/login');
    }
    // ?блокировка auth маршрутов для залогиненнных юзеров
    if (isAuth && isAuthGroup) {
      router.replace('/(tabs)/ads/search');
    }
  }, [isAuth, isLoading, segments]);

  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Slot />
    </>
  );
}
