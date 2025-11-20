import { baseColors } from './baseColors';

export const componentColors = {
  // кнопки
  button: {
    secondary: {
      light: {
        bg: baseColors.neutral.blackPrimary,
      },
      dark: {
        bg: baseColors.neutral.greyBlueBright,
      },
    },
  },
  // теги
  tag: {
    default: {
      light: {
        bg: baseColors.grey.bright,
        border: baseColors.neutral.blackPrimary,
      },
      dark: {
        bg: baseColors.neutral.greyBlueBright,
        border: baseColors.neutral.greyBlueBright,
      },
    },
  },
  // карточки
  card: {
    rent: {
      light: {
        border: baseColors.neutral.blackPrimary,
      },
      dark: {
        border: baseColors.neutral.greyBlueBright,
      },
    },
  },
  // панельки
  bar: {
    search: {
      light: {
        bg: baseColors.grey.bright,
        text: baseColors.neutral.greyDark,
        border: baseColors.grey.primary,
      },
      dark: {
        bg: baseColors.neutral.greyBluePrimary,
        text: baseColors.grey.primary,
        border: baseColors.neutral.greyBluePrimary,
      },
    },
  },
  // линии
  line: {
    header: {
      light: {
        bg: baseColors.orange.dark,
      },
      dark: {
        bg: baseColors.neutral.greyBlueBright,
      },
    },
  },
} as const;
