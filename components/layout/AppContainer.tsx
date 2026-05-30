// STATUSBAR в другом месте поменять нельзя - он может быть лишь один для приложения

import { useEffect } from 'react';
import { router, Slot, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

// !!!ЗДЕСЬ НЕ ИСПОЛЬЗУЕТСЯ useHistory.
// Блокировка маршрутов не должна сохраняться в стеке

// Гуарды
export default function AppContainer() {
  const { theme } = useTheme();
  const { user, isAuth, isLoading, isFetching } = useProfile();
  const segments = useSegments();

  useEffect(() => {
    // если еще не загружено или идёт фоновый refetch — откладываем до завершения
    if (isLoading || isFetching) {
      return;
    }
    const isAuthGroup = segments[0] == '(auth)';
    // блокировка маршрутов для незалогинненых юзеров
    if (!isAuth && !isAuthGroup) {
      router.replace('/(auth)/login');
    }
    // ?блокировка auth маршрутов для залогиненнных юзеров (с заполненным профилем)
    if (isAuth && user?.isCompleted && isAuthGroup) {
      router.replace('/(tabs)/ads/search');
    }
  }, [isAuth, isLoading, isFetching, segments]);

  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Slot />
    </>
  );
}
