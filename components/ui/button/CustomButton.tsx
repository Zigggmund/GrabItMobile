import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

type buttonType = 'primary' | 'secondary' | 'red' | 'green';

interface CustomButtonProps {
  type?: buttonType;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  text?: string;
  iconSource?: ImageSourcePropType;
  iconSize?: number;
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
}: CustomButtonProps) => {
  const { colors } = useTheme();

  const buttonColorMap = {
    primary: { bg: colors.base.orange.bright },
    secondary: colors.components.button.secondary,
    red: { bg: colors.base.orange.bright },
    green: { bg: colors.base.orange.bright },
  } as const;
  const colorRef = buttonColorMap[type];
  const borderClass = type == 'primary' ? 'border-2' : '';

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 0.6 : 1}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
      style={{ backgroundColor: colorRef.bg }}
      className={`${borderClass} rounded-2xl items-center justify-center gap-2 px-4 py-3 ${className}`}
    >
      <CustomText
        highlight
        style={{ color: colors.base.neutral.whiteBright}}
        className={`font-bold ${textClassName}`.trim()}
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
