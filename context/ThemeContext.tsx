import { createContext } from 'react';

import { baseColors, themeColors } from '@/constants/colors';

export const defaultTheme = 'light';
export type ThemeType = 'light' | 'dark';
export type colorType = typeof baseColors & (typeof themeColors)['light'];

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: colorType;
  isLoading: boolean;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: defaultTheme,
  setTheme: () => {},
  colors: { ...baseColors, ...themeColors.light },
  isLoading: true,
});
