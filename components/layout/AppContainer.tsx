// STATUSBAR в другом месте поменять нельзя - он может быть лишь один для приложения

import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router, Slot, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';
import ScreenContainer from '@/components/layout/ScreenContainer';

// !!!ЗДЕСЬ НЕ ИСПОЛЬЗУЕТСЯ useHistory.
// Блокировка маршрутов не должна сохраняться в стеке

// Гуарды
export default function AppContainer() {
  const { theme, colors } = useTheme();
  const { user, isAuth, isLoading, isFetching } = useProfile();
  const segments = useSegments();

  const isAuthGroup = segments[0] === '(auth)';

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!isAuth && !isAuthGroup) {
      router.replace('/(auth)/login');
    }
    if (isAuth && user?.isCompleted && isAuthGroup) {
      router.replace('/(tabs)/ads/search');
    }
  }, [isAuth, isLoading, isFetching, segments]);

  // Пустой экран: пока загружается ИЛИ пока редирект ещё не отработал
  const redirectPending =
    !isLoading &&
    !isFetching &&
    ((isAuth && !!user?.isCompleted && isAuthGroup) ||
      (!isAuth && segments.length > 0 && !isAuthGroup));

  if (isLoading || redirectPending) {
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Slot />
    </>
  );
}
