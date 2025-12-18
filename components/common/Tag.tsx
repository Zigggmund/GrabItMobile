import { TouchableOpacity, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

interface TagProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  className?: string;
  textClassName?: string;
}

export function Tag({
  label,
  selected,
  onPress,
  className = '',
  textClassName = '',
}: TagProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full items-center justify-center ${className}`}
      style={{
        borderWidth: 1,
        borderColor: colors.base.neutral.blackPrimary,
        backgroundColor: !selected
          ? colors.components.tag.default.bg
          : colors.base.orange.primary,
      }}
    >
      <CustomText
        style={{
          color: !selected
            ? colors.components.tag.default.text
            : colors.base.neutral.whitePrimary,
        }}
        className={`text-16 ${textClassName}`}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
}
