import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  isCentered?: boolean;
}

export default function ScreenContainer({
  children,
  className,
  isCentered = true, // для некоторых страниц
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const centeredClass = isCentered ? 'items-center' : '';
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.theme.white.bright,
        paddingTop: 20,
      }}
      className={`${centeredClass} relative ${className}`}
    >
      {children}
    </View>
  );
}
