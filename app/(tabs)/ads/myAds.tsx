import { ActivityIndicator, FlatList, View } from 'react-native';

import { useGetUserAds } from '@/hooks/ad/useGetUserAds';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import BigAd from '@/components/items/ads/BigAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { BIG_AD_WIDTH } from '@/constants/sizes';

export default function MyAdsPage() {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const { navigate } = useHistory();
  const profile = useProfile();
  const {
    data: ads = [],
    isLoading: isLoading,
    isError: isError,
  } = useGetUserAds(profile.user!.id);

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

  return (
    <ScreenContainer>
      <FlatList
        data={ads}
        renderItem={({ item }) => <BigAd width={BIG_AD_WIDTH} ad={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListEmptyComponent={() => (
          <CustomText
            highlight
            className={'text-28 text-center'}
            style={{ color: colors.theme.blue.primary }}
          >
            {l.emptyAdList}
          </CustomText>
        )}
      />

      <CustomButton
        text={l.btnNewAd}
        onPress={() => navigate('/(tabs)/ads/createAd')}
        textClassName="text-26"
        className={'bottom-4 absolute'}
      />
    </ScreenContainer>
  );
}
