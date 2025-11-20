// c ComponentColors
import { createContext } from 'react';

import { baseColors } from '@/constants/colors/baseColors';
import { componentColors } from '@/constants/colors/componentColors';
import { themeColors } from '@/constants/colors/themeColors';
import { ColorType, ComponentColorsType } from '@/types/colorType';

export const defaultTheme = 'light';
export type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ColorType;
  isLoading: boolean;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: defaultTheme,
  setTheme: () => {},
  colors: {
    base: baseColors,
    theme: themeColors.light,
    components: Object.fromEntries(
      Object.entries(componentColors).map(([compKey, variants]) => [
        compKey,
        Object.fromEntries(
          Object.entries(variants).map(([variantKey, variantVal]) => [
            variantKey,
            variantVal.light,
          ]),
        ),
      ]),
    ) as ComponentColorsType,
  },
  isLoading: true,
});

// import { createContext } from 'react';
//
// import { themeColors } from '@/constants/colors/themeColors';
// import { baseColors } from '@/constants/colors/baseColors';
//
// export const defaultTheme = 'light';
// export type ThemeType = 'light' | 'dark';
// export type colorType = typeof baseColors & (typeof themeColors)['light'];
//
// interface ThemeContextProps {
//   theme: ThemeType;
//   setTheme: (theme: ThemeType) => void;
//   colors: colorType;
//   isLoading: boolean;
// }
//
// export const ThemeContext = createContext<ThemeContextProps>({
//   theme: defaultTheme,
//   setTheme: () => {},
//   colors: { ...baseColors, ...themeColors.light },
//   isLoading: true,
// });
