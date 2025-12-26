import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface GreyBlockProps {
  className?: string;
  index?: number;
  px?: number;
  py?: number;
  children?: React.ReactNode;
}

export default function GreyBlock({
  className = '',
  children,
  index = 0,
  px = 4,
  py = 6,
}: GreyBlockProps) {
  const { colors } = useTheme();
  const isGrey = index % 2 == 0;

  return (
    <View
      style={[
        isGrey && {
          backgroundColor: colors.theme.white.primary,
          paddingHorizontal: px,
          paddingVertical: py,
          borderRadius: 8,
        },
      ]}
      className={`${className}`}
    >
      {children}
    </View>
  );
}
