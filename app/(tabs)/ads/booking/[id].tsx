import { ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetAd } from '@/hooks/ad/useGetAd';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

export default function Booking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const { data: ad, isLoading: isLoading, isError: isError } = useGetAd(id);

  if (isLoading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (isError)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );

  if (!ad)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAdNotFound} />
      </ScreenContainer>
    );

  return (
    <ScreenContainer>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        className={'text-50'}
        highlight
      >
        Ad-{id} booking
      </CustomText>
      <CustomText style={{ color: colors.theme.blue.dark }}>
        {ad.title}
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
