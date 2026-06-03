import { AdPreviewType } from '@/types/entities/AdType';
import { SortingAdsType } from '@/types/SortingType';

import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetUserAds } from '@/hooks/ad/useGetUserAds';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import { SortingMenu } from '@/components/common/SortingMenu';
import LandlordAdsHeader from '@/components/header/onePage/LandlordAdsHeader';
import BigAd from '@/components/items/ads/BigAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

import { BIG_AD_WIDTH } from '@/constants/sizes';

export default function LandlordAds() {
  const { id, username } = useLocalSearchParams<{ id: string; username: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();

  const [serverPage, setServerPage] = useState(1);
  const [allAds, setAllAds] = useState<AdPreviewType[]>([]);
  const [sortBy, setSortBy] = useState<SortingAdsType>('new');

  const { data, isLoading, isError, isFetching } = useGetUserAds(id, sortBy, serverPage);

  const total = data?.total ?? 0;

  useEffect(() => {
    setServerPage(1);
    setAllAds([]);
  }, [sortBy]);

  useEffect(() => {
    if (!data?.items) return;
    setAllAds(prev => {
      if (serverPage === 1) return data.items;
      const existingIds = new Set(prev.map(a => a.id));
      return [...prev, ...data.items.filter(a => !existingIds.has(a.id))];
    });
  }, [data]);

  if (isLoading && allAds.length === 0)
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
      <View className={'px-4 gap-4'}>
        <LandlordAdsHeader landlordName={username} adsCount={total} />

        <FlatList
          data={allAds}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <BigAd width={BIG_AD_WIDTH} ad={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={() => {
            if (allAds.length < total && !isFetching) {
              setServerPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (isFetching ? <ActivityIndicator /> : null)}
          ListHeaderComponentStyle={{ paddingBottom: 14, zIndex: 10 }}
          ListHeaderComponent={() => (
            <View className={'items-center'}>
              <SortingMenu<SortingAdsType>
                items={[
                  { label: l.byNew, value: 'new' },
                  { label: l.byOld, value: 'old' },
                  { label: l.byCheap, value: 'cheap' },
                  { label: l.byExpensive, value: 'expensive' },
                  { label: l.byPopular, value: 'popular' },
                ]}
                value={sortBy}
                width={220}
                onSelect={v => setSortBy(v)}
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