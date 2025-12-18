import { FlatList, View } from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import BigAd from '@/components/items/BigAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { mockAds } from '@/constants/mocks/mockAds';

export default function MyAdsPage() {
  const itemWidth = 340; // ширина BigAd

  const { colors } = useTheme();
  const { l } = useLanguage();

  return (
    <ScreenContainer>
      <FlatList
        data={mockAds}
        renderItem={({ item }) => <BigAd width={itemWidth} ad={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <CustomButton
        text={l.btnNewAd}
        onPress={() => router.push('/(tabs)/ads/createAd')}
        textClassName="text-26"
        className={'bottom-4 absolute'}
      />
    </ScreenContainer>
  );
}
