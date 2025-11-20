import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { loadAsync } from 'expo-font'; // tailwind
import { useRootNavigationState } from 'expo-router';

import { LanguageProvider } from '@/context/LanguageProvider';
import { ProfileProvider } from '@/context/ProfileProvider';
import { ThemeProvider } from '@/context/ThemeProvider';

import { store } from '@/state/store';

import AppContainer from '@/components/layout/AppContainer';

import 'react-native-reanimated';
import '../global.css';
import LoadingScreen from '@/app/loading';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const rootNavigationState = useRootNavigationState();

  // ДЛЯ РАЗОВОЙ ОЧИСТКИ ПРИ ОШИБОЧНЫХ ДАННЫХ В ХРАНИЛИЩЕ
  // useEffect(() => {
  //   const clear = async () => {
  //     await storage.remove('theme');
  //     await storage.remove('language');
  //   };
  //   clear();
  // }, []);

  useEffect(() => {
    console.log('Загрузка шрифта...');
    const loadFonts = async () => {
      await loadAsync({
        // если подключать через import, увеличится bundle size
        /* eslint-disable */
        InterRegular: require('@/assets/fonts/Inter-Regular.ttf'),
        InterMedium: require('@/assets/fonts/Inter-Medium.ttf'),
        InterBold: require('@/assets/fonts/Inter-Bold.ttf'),
        MulishRegular: require('@/assets/fonts/Mulish-Regular.ttf'),
        MulishMedium: require('@/assets/fonts/Mulish-Medium.ttf'),
        MulishBold: require('@/assets/fonts/Mulish-Bold.ttf'),
        // eslint-enable */
      });
      setFontsLoaded(true);
    };
    loadFonts();

    console.log('Инициализация бд...');
    const initializeDb = async () => {
      // await initDatabase();
      // await checkDatabase();
      setDbInitialized(true);
    };
    initializeDb();
  }, []);

  // Проверка маршрутов
  useEffect(() => {
    if (rootNavigationState) {
      console.log("Root navigation state:", JSON.stringify(rootNavigationState, null, 2));
    }
  }, [rootNavigationState]);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ProfileProvider>
          <LanguageProvider>
            <ThemeProvider>
              {!dbInitialized || !fontsLoaded ? (
                <LoadingScreen loading />
              ) : !isAppReady ? (
                <LoadingScreen onPress={() => setIsAppReady(true)} />
              ) : (
                // для корректного взаимодействия с bgColor из Theme
                <AppContainer />
              )}
            </ThemeProvider>
          </LanguageProvider>
        </ProfileProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
