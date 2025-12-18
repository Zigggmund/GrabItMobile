import { Image, ImageSourcePropType, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

type buttonType = 'primary' | 'secondary' | 'red' | 'green';

interface CustomButtonProps extends TouchableOpacityProps {
  type?: buttonType;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  text?: string;
  iconSource?: ImageSourcePropType;
  iconSize?: number;
  isSmall?: boolean;
}

export const CustomButton = ({
  onPress,
  disabled,
  className = '',
  textClassName = '',
  text = '',
  iconSource,
  iconSize = 20,
  type = 'primary',
  isSmall = false,
  ...props
}: CustomButtonProps) => {
  const { colors } = useTheme();

  const buttonColorMap = {
    primary: { bg: colors.base.orange.bright },
    secondary: colors.components.button.secondary,
    red: { bg: colors.base.orange.bright },
    green: { bg: colors.base.orange.bright },
  } as const;
  const colorRef = buttonColorMap[type];
  const borderWidth = type == 'primary' ? (isSmall ? 1 : 2) : 0;
  const sizeClass = isSmall ? 'px-4 py-2 gap-4' : 'px-8 py-3 gap-6 min-w-40';

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 0.6 : 1}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
      style={{ backgroundColor: colorRef.bg, borderWidth: borderWidth }}
      className={`rounded-2xl items-center justify-center flex-row ${sizeClass} ${className}`}
      {...props}
    >
      <CustomText
        highlight
        style={{ color: colors.base.neutral.whiteBright }}
        className={`font-medium ${textClassName}`.trim()}
      >
        {text}
      </CustomText>
      {iconSource && (
        <Image
          source={iconSource}
          style={{
            resizeMode: 'contain',
            height: iconSize,
            width: iconSize,
            tintColor: colors.base.neutral.whiteBright,
          }}
        />
      )}
    </TouchableOpacity>
  );
};
