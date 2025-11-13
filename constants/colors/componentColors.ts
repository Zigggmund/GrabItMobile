import { baseColors } from './baseColors';

export const componentColors = {
  button: {
    primary: {
      light: {
        bg: baseColors.orange.primary,
        text: baseColors.neutral.whiteBright,
      },
      dark: {
        bg: baseColors.orange.primary,
        text: baseColors.neutral.whiteBright,
      },
    },
    secondary: {
      light: {
        bg: baseColors.neutral.blackPrimary,
        text: baseColors.neutral.whiteBright,
      },
      dark: {
        bg: baseColors.neutral.greyBlueBright,
        text: baseColors.neutral.whiteBright,
      },
    },
    tag: {
      light: {
        bg: baseColors.grey.bright,
        text: baseColors.neutral.whitePrimary,
      },
      dark: {
        bg: baseColors.neutral.greyBlueBright,
        text: baseColors.grey.bright,
      },
    },
  },
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
} as const;
