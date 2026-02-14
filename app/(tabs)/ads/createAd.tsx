import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { useHistory } from '@/hooks/useHistory';

export default function CreateAd() {
  const { colors } = useTheme();
  const { navigate } = useHistory();

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
        onPress={() => navigate('/(auth)/login')}
        text={'login'}
      />
      <CustomButton
        onPress={() => navigate('/(tabs)/ads/booking/123')}
        text={'booking-123'}
      />
      <CustomButton
        onPress={() => navigate('/(tabs)/users/settings')}
        text={'settings'}
      />
    </ScreenContainer>
  );
}
