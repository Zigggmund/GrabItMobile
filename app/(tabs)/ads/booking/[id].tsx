import { useLocalSearchParams } from 'expo-router';

import { useHistory } from '@/hooks/useHistory';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

export default function Booking() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { navigate } = useHistory();

  return (
    <ScreenContainer>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        className={'text-50'}
        highlight
      >
        Ad-{id} booking
      </CustomText>

      <CustomButton onPress={() => navigate('/(auth)/login')} text={'login'} />
      <CustomButton
        onPress={() =>
          navigate({
            pathname: '/(tabs)/ads/booking/[id]',
            params: { id: String(123) },
          })
        }
        text={'booking-123'}
      />
      <CustomButton
        onPress={() => navigate('/(tabs)/users/settings')}
        text={'settings'}
      />
    </ScreenContainer>
  );
}
