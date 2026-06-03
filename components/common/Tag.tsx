import { TouchableOpacity } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

interface TagProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  width?: number | null;
  isSmall?: boolean;
}

export function Tag({
  isSmall = false,
  label,
  selected,
  onPress,
  className = '',
  textClassName = '',
  width = null,
}: TagProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${isSmall ? 'px-2 py-1.5' : 'px-4 py-2'} rounded-full items-center justify-center ${className}`}
      style={{
        width: width ?? 'auto',
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
        className={`${isSmall ? 'text-15' : 'text-16'} ${textClassName}`}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
}
