import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { loadAsync } from 'expo-font'; // tailwind
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { LanguageProvider } from '@/context/LanguageProvider';
import { ThemeProvider } from '@/context/ThemeProvider';

import { store } from '@/state/store';

import 'react-native-reanimated';
import '../global.css';
import LoadingScreen from '@/app/loading';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    console.log('Загрузка шрифта...');
    const loadFonts = async () => {
      await loadAsync({
        // если подключать через import, увеличится bundle size
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        Inter: require('@/assets/fonts/Inter-VariableFont.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        Mulish: require('@/assets/fonts/Mulish-VariableFont.ttf'),
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

  if (!dbInitialized || !fontsLoaded) {
    return <LoadingScreen loading />;
  }

  if (!isAppReady) {
    return <LoadingScreen onPress={() => setIsAppReady(true)} />;
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <View style={{ flex: 1 }}>
              <StatusBar backgroundColor="#FFFFFF" />
              <Slot />
            </View>
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
