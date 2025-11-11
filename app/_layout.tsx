import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from '@/context/ThemeContext';

import 'react-native-reanimated';

import '../global.css'; // tailwind

import { store } from '@/state/store';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout() {
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
