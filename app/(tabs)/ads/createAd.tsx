import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { router } from 'expo-router';

export default function CreateAd() {
  const { colors } = useTheme();

  return (
    <ScreenContainer>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        className={'text-50'}
        highlight
      >
        createAd
      </CustomText>

      <CustomButton
        onPress={() => router.push('/(auth)/login')}
        text={'login'}
      />
      <CustomButton
        onPress={() => router.push('/(tabs)/ads/booking/123')}
        text={'booking-123'}
      />
      <CustomButton
        onPress={() => router.push('/(tabs)/users/settings')}
        text={'settings'}
      />
    </ScreenContainer>
  );
}
