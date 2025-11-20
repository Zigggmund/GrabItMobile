import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, useLocalSearchParams, useSegments } from 'expo-router';

import { useLanguage } from '@/hooks/useLanguage';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';

import CustomHeader from '@/components/header/CustomHeader';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';

import { icons } from '@/constants/icons';
import { pages } from '@/constants/pages';

// Установка здесь backgroundColor: colors.theme.white.bright не сработает по той причине, что экраны рисуются поверх навигации
// В appContainer это работает, так как там указан Slot, куда он подставляет экраны. Но Slot может быть объявлен лишь в одном месте
// По этим причинам за цвет экрана отвечает отдельный компонент ScreenContainer
export default function TabsLayout() {
  const { l } = useLanguage();
  const { user } = useProfile();
  const { colors } = useTheme();

  const segments = useSegments() as string[];
  const params = useLocalSearchParams();

  // Скрывать header и tabs?
  const isAuthFlow = segments[0] === '(auth)' || segments[0] === 'loading';

  // Показывать настройки?
  const isUserScreen =
    segments.includes('users') && typeof params.id === 'string';
  const isUserProfile = isUserScreen && params.id === String(user?.id);

  // Показывать back?
  const current = segments[1];
  const ROOT_TAB_SCREENS = pages.map(p => p.link);
  const isRootTabScreen = ROOT_TAB_SCREENS.includes(current);
  const hasBack = !isRootTabScreen && !isUserProfile;

  return (
    // SafeAreaView для предотвращения наложения системных панелей на footer/header
    <SafeAreaView style={{ flex: 1 }}>
      {!isAuthFlow && (
        <CustomHeader hasBack={hasBack} isUserProfile={isUserProfile} />
      )}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.base.orange.primary,
          tabBarInactiveTintColor: colors.theme.grey.dark,
        }}
      >
        {pages.map(page => (
          <Tabs.Screen
            key={page.link}
            name={page.link}
            options={{
              title: l[page.title],
              tabBarIcon: ({ color }) => (
                <CustomIcon source={icons[page.icon]} color={color} size={35} />
              ),
              tabBarStyle: {
                paddingTop: 10,
                height: 75,
                paddingBottom: 5,
                backgroundColor: colors.theme.white.bright,
              },
            }}
          />
        ))}
      </Tabs>
    </SafeAreaView>
  );
}
