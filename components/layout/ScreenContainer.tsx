import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export default function ScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.theme.white.bright }}>
      {children}
    </View>
  );
}
