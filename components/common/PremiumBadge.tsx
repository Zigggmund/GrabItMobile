import { View } from 'react-native';

import { CustomText } from '@/components/ui/text/CustomText';
import { useTheme } from '@/hooks/useTheme';

interface PremiumBadgeProps {
  size?: 'small' | 'medium';
}

export function PremiumBadge({ size = 'small' }: PremiumBadgeProps) {
  const isSmall = size === 'small';
  const { colors } = useTheme();

  return (
    <View
      className="rounded-full items-center justify-center"
      style={{
        backgroundColor: colors.base.yellow.soft,
        borderWidth: 1,
        borderColor: colors.base.yellow.darkSoft,
        paddingHorizontal: isSmall ? 5 : 8,
        paddingVertical: isSmall ? 1 : 2,
      }}
    >
      <CustomText
        highlight
        style={{
          color: colors.base.yellow.darkSoft,
          fontSize: isSmall ? 9 : 11,
          fontWeight: '700',
          lineHeight: isSmall ? 13 : 16,
        }}
      >
        PRO
      </CustomText>
    </View>
  );
}
