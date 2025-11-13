// c ComponentColors
import { createContext } from 'react';

import { baseColors } from '@/constants/colors/baseColors';
import { componentColors } from '@/constants/colors/componentColors';
import { themeColors } from '@/constants/colors/themeColors';

export const defaultTheme = 'light';
export type ThemeType = 'light' | 'dark';

// тип для componentColors, поддерживающий варианты (primary, secondary)
export type ComponentColors = {
  [K in keyof typeof componentColors]: {
    [V in keyof (typeof componentColors)[K]]: {
      bg: string;
      text: string;
      [key: string]: string;
    };
  };
};

// тип цветовой палитры
export type colorType = {
  base: typeof baseColors;
  theme: (typeof themeColors)['light'];
  components: ComponentColors;
};

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: colorType;
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
    ) as ComponentColors,
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
