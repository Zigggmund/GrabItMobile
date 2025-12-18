import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, usePathname, useSegments } from 'expo-router';

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
  const pathname = usePathname();

  // Скрывать header и tabs?
  const isAuthFlow = segments[0] === '(auth)' || segments[0] === 'loading';

  // Показывать настройки?
  const isUserProfile =
    pathname.startsWith('/users/') &&
    pathname.split('/').length === 3 &&
    pathname.endsWith(String(user?.id));

  // Подсвечивать настройки?
  const isSettingsScreen = segments.includes('settings');

  // Показывать back?
  const current = segments[segments.length - 1];
  const ROOT_TAB_SCREENS = pages.map(
    p => p.link.split('/')[p.link.split('/').length - 1],
  );
  const isRootTabScreen = ROOT_TAB_SCREENS.includes(current);
  const hasBack = !isRootTabScreen && !isUserProfile;

  return (
    // SafeAreaView для предотвращения наложения системных панелей на footer/header
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.theme.white.bright }}>
      {!isAuthFlow && (
        <CustomHeader
          isSettingsScreen={isSettingsScreen}
          hasBack={hasBack}
          isUserProfile={isUserProfile}
        />
      )}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.base.orange.primary,
          tabBarInactiveTintColor: colors.theme.grey.dark,
          tabBarStyle: {
            paddingTop: 5,
            height: 75,
            paddingBottom: 5,
            backgroundColor: colors.theme.white.bright,
            borderTopWidth: 1,
            borderTopColor: colors.components.line.headerFooter.bg,
          },
          tabBarLabelStyle: {
            paddingTop: 8,
            fontSize: 12,
          },
        }}
      >
        {/* Главные страницы */}
        {pages.map(page => (
          <Tabs.Screen
            key={page.link}
            name={page.link}
            options={{
              title: l[page.title],
              tabBarIcon: ({ color }) => (
                <CustomIcon source={icons[page.icon]} color={color} size={35} />
              ),
            }}
          />
        ))}
        {/* Второстепенные страницы */}
        <Tabs.Screen name={'users/settings'} options={{ href: null }} />
        <Tabs.Screen name={'users/landlordAds/[id]'} options={{ href: null }} />
        <Tabs.Screen name={'users/[id]'} options={{ href: null }} />
        <Tabs.Screen name={'chats/[id]'} options={{ href: null }} />
        <Tabs.Screen name={'ads/[id]'} options={{ href: null }} />
        <Tabs.Screen name={'ads/createAd'} options={{ href: null }} />
        <Tabs.Screen name={'ads/booking/[id]'} options={{ href: null }} />
        <Tabs.Screen name={'ads/reviews/[id]'} options={{ href: null }} />
      </Tabs>


      {/*<Stack screenOptions={{ headerShown: false }} />*/}
    </SafeAreaView>
  );
}
