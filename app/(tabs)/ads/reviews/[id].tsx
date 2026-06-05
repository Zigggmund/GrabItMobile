import { ReviewType } from '@/types/entities/ReviewType';
import { SortingReviewsType } from '@/types/SortingType';

import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetAd } from '@/hooks/ad/useGetAd';
import { useGetAdReviews } from '@/hooks/review/useGetAdReviews';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ReviewDistribution from '@/components/common/bars/ReviewDistribution';
import ErrorMessage from '@/components/common/ErrorMessage';
import { SortingMenu } from '@/components/common/SortingMenu';
import ReviewsHeader from '@/components/header/onePage/ReviewsHeader';
import { Review } from '@/components/items/reviews/Review';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

export default function AdReviews() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();

  const [serverPage, setServerPage] = useState(1);
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const [sortBy, setSortBy] = useState<SortingReviewsType>('new');
  const [rating, setRating] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  const { data, isLoading, isFetching } = useGetAdReviews(
    id,
    serverPage,
    sortBy,
  );
  const { data: ad, isLoading: isLoadingAd, isError: isErrorAd } = useGetAd(id);

  useEffect(() => {
    setServerPage(1);
    setAllReviews([]);
    setTotal(0);
  }, [sortBy, rating]);

  useEffect(() => {
    if (!data?.items) return;
    if (data.total > 0) setTotal(data.total);
    setAllReviews(prev => {
      if (serverPage === 1) return data.items;
      const existingIds = new Set(prev.map(r => r.id));
      return [...prev, ...data.items.filter(r => !existingIds.has(r.id))];
    });
  }, [data]);

  if ((isLoading && allReviews.length === 0) || isLoadingAd)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (isErrorAd)
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
      <View className={'px-4 gap-4'}>
        <View className={'gap-2'}>
          <ReviewsHeader
            itemRating={ad.rating}
            reviewCount={ad.reviewCount}
            itemName={ad.title}
          />
          <CustomText
            className={'self-start text-14'}
            style={{ color: colors.theme.blue.bright }}
          >
            {l.reviewsFound}: {total}
          </CustomText>
        </View>

        <FlatList
          keyExtractor={item => item.id}
          data={allReviews}
          renderItem={({ item, index }) => (
            <Review review={item} index={index} />
          )}
          ItemSeparatorComponent={() => <View className={'h-4'} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={() => {
            if (allReviews.length < total && !isFetching) {
              setServerPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetching ? <ActivityIndicator /> : null
          }
          ListHeaderComponentStyle={{ paddingBottom: 14, zIndex: 10 }}
          ListHeaderComponent={() => (
            <View className={'items-center'}>
              <ReviewDistribution
                reviews={allReviews}
                value={rating}
                onSelect={v => setRating(v)}
              />
              <SortingMenu<SortingReviewsType>
                items={[
                  { label: l.byNew, value: 'new' },
                  { label: l.byOld, value: 'old' },
                  { label: l.byHigh, value: 'high' },
                  { label: l.byLow, value: 'low' },
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
              {l.emptyReviewList}
            </CustomText>
          )}
        />
      </View>
    </ScreenContainer>
  );
}
