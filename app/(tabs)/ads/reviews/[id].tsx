import { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetAd } from '@/hooks/ad/useGetAd';
import { useGetAdReviews } from '@/hooks/review/useGetAdReviews';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import { SortingMenu } from '@/components/common/SortingMenu';
import ReviewsHeader from '@/components/header/onePage/ReviewsHeader';
import { Review } from '@/components/items/reviews/Review';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';
import ReviewDistribution from '@/components/common/bars/ReviewDistribution';

type SortingType = 'new' | 'old' | 'high' | 'low';

export default function AdReviews() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();

  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useGetAdReviews(id);
  const {
    data: ad,
    isLoading: isLoadingAd,
    isError: isErrorAd,
  } = useGetAd(Number(id));

  const [sortBy, setSortBy] = useState<SortingType>('new');
  const handleSorting = (value: SortingType) => {
    setSortBy(value);
    console.log(`Сортировка по критерию ${value} выполнена`);
  };

  if (isLoadingReviews || isLoadingAd)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (isErrorReviews || isErrorAd) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );
  }

  if (!ad) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAdNotFound} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className={'px-4 gap-4'}>
        <ReviewsHeader
          adRating={ad.rating}
          reviewCount={ad.reviewCount}
          itemName={ad.title}
        />

        <FlatList
          data={reviews}
          renderItem={({ item, index }) => (
            <Review review={item} index={index} />
          )}
          ItemSeparatorComponent={() => <View className={'h-4'} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponentStyle={{ paddingBottom: 14, zIndex: 10 }}
          ListHeaderComponent={() => (
            <View className={'items-center gap-4'}>
              <ReviewDistribution reviews={reviews} />
              <SortingMenu<SortingType>
                items={[
                  { label: l.byNew, value: 'new' },
                  { label: l.byOld, value: 'old' },
                  { label: l.byHigh, value: 'high' },
                  { label: l.byLow, value: 'low' },
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
              {l.emptyReviewList}
            </CustomText>
          )}
        />
      </View>
    </ScreenContainer>
  );
}
