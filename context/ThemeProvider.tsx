// c ComponentColors
import { ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ComponentColors,
  defaultTheme,
  ThemeContext,
  ThemeType,
} from '@/context/ThemeContext';

import { baseColors } from '@/constants/colors/baseColors';
import { componentColors } from '@/constants/colors/componentColors';
import { themeColors } from '@/constants/colors/themeColors';

import { storage } from '@/services/storage/asyncStorageService';

const THEME_KEY = 'theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await storage.get<ThemeType>(THEME_KEY, defaultTheme);
      setThemeState(saved ?? defaultTheme);
      setIsLoading(false);
    };

    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    AsyncStorage.setItem(THEME_KEY, newTheme);
  };

  // для componentColors
  const components: ComponentColors = Object.fromEntries(
    Object.entries(componentColors).map(([compKey, variants]) => [
      compKey,
      Object.fromEntries(
        Object.entries(variants).map(([variantKey, variantVal]) => [
          variantKey,
          variantVal[theme],
        ]),
      ),
    ]),
  ) as ComponentColors;

  // Итоговая палитра
  const colors = {
    base: baseColors,
    theme: themeColors[theme],
    components,
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

// import { ReactNode, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// import { defaultTheme, ThemeContext, ThemeType } from '@/context/ThemeContext';
//
// import { baseColors } from '@/constants/colors/baseColors';
// import { themeColors } from '@/constants/colors/themeColors';
//
// import { storage } from '@/services/storage/asyncStorageService';
//
// const THEME_KEY = 'theme';
//
// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//   const [theme, setThemeState] = useState<ThemeType>(defaultTheme);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     const loadTheme = async () => {
//       const saved = await storage.get<ThemeType>(THEME_KEY, defaultTheme);
//       setThemeState(saved ?? defaultTheme);
//       setIsLoading(false);
//     };
//
//     loadTheme();
//   }, []);
//
//   const setTheme = async (newTheme: ThemeType) => {
//     setThemeState(newTheme);
//     AsyncStorage.setItem(THEME_KEY, newTheme);
//   };
//
//   const colors = { ...baseColors, ...themeColors[theme] };
//
//   return (
//     <ThemeContext.Provider value={{ theme, setTheme, colors, isLoading }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
