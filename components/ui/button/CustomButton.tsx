import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

type buttonType = 'primary' | 'secondary' | 'red' | 'green' | 'highlighted';

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
    primary: colors.components.button.primary,
    secondary: colors.components.button.secondary,
    highlighted: { bg: colors.base.orange.dark },
    red: { bg: colors.base.red.bright },
    green: { bg: colors.base.green.bright },
  } as const;
  const colorRef = buttonColorMap[type];
  const borderWidth =
    type == 'primary' || type == 'highlighted' ? (isSmall ? 1 : 2) : 0;
  const isCircled = iconSource && !text.trim();

  const sizeClass = isCircled
    ? 'p-0 min-w-0'
    : isSmall
      ? 'px-4 py-2 gap-4'
      : 'px-8 py-3 gap-6 min-w-40';
  const radiusClass = isCircled ? 'rounded-full' : 'rounded-2xl';

  const circleSize = iconSize + (iconSize > 25 ? 24 : 20);
  const dynamicCircleStyle = isCircled
    ? { width: circleSize, height: circleSize }
    : {};

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
      style={[
        {
          backgroundColor: colorRef.bg,
          borderWidth: borderWidth,
          opacity: disabled ? 0.7 : 1,
        },
        dynamicCircleStyle,
      ]}
      className={`${radiusClass} items-center justify-center flex-row ${sizeClass} ${className}`}
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
