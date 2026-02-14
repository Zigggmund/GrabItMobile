import { FlatList, View } from 'react-native';

import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';

import BigAd from '@/components/items/ads/BigAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';

import { mockAds } from '@/constants/mocks/mockAds';

export default function MyAdsPage() {
  const itemWidth = 340; // ширина BigAd
  const { l } = useLanguage();
  const { navigate } = useHistory();

  return (
    <ScreenContainer>
      <FlatList
        data={mockAds}
        renderItem={({ item }) => <BigAd width={itemWidth} ad={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
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
