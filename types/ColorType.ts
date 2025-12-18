// тип для componentColors, поддерживающий варианты (primary, secondary)
import { baseColors } from '@/constants/colors/baseColors';
import { componentColors } from '@/constants/colors/componentColors';
import { themeColors } from '@/constants/colors/themeColors';

export type ComponentColorsType = {
  [K in keyof typeof componentColors]: {
    [V in keyof (typeof componentColors)[K]]: {
      bg: string;
      text: string;
      [key: string]: string;
    };
  };
};

// тип цветовой палитры
export interface ColorType {
  base: typeof baseColors;
  theme: (typeof themeColors)['light'];
  components: ComponentColorsType;
};
