import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetUserAds } from '@/hooks/ad/useGetUserAds';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import LandlordAdsHeader from '@/components/header/onePage/LandlordAdsHeader';
import BigAd from '@/components/items/ads/BigAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

import { BIG_AD_WIDTH } from '@/constants/sizes';
import { useState } from 'react';
import { SortingMenu } from '@/components/common/SortingMenu';

type SortingType = 'new' | 'old' | 'cheap' | 'expensive' | 'popular';

export default function LandlordAds() {
  const { id, username } = useLocalSearchParams<{ id: string, username: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();

  const {
    data: ads = [],
    isLoading: isLoadingAds,
    isError: isErrorAds,
  } = useGetUserAds(id);

  const [sortBy, setSortBy] = useState<SortingType>('new');
  const handleSorting = (value: SortingType) => {
    setSortBy(value);
    console.log(`Сортировка по критерию ${value} выполнена`);
  };

  if (isLoadingAds)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );
  if (isErrorAds) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className={'px-4 gap-4'}>
        <LandlordAdsHeader landlordName={username} adsCount={ads.length} />

        <FlatList
          data={ads}
          renderItem={({ item }) => <BigAd width={BIG_AD_WIDTH} ad={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponentStyle={{ paddingBottom: 14, zIndex: 10 }}
          ListHeaderComponent={() => (
            <View className={'items-center'}>
              <SortingMenu<SortingType>
                items={[
                  { label: l.byNew, value: 'new' },
                  { label: l.byOld, value: 'old' },
                  { label: l.byCheap, value: 'cheap' },
                  { label: l.byExpensive, value: 'expensive' },
                  { label: l.byPopular, value: 'popular' },
                ]}
                value={sortBy}
                width={220}
                onSelect={v => {
                  if (v !== null) {
                    handleSorting(v);
                  }
                }}
              />
            </View>
          )}
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
      </View>
    </ScreenContainer>
  );
}
