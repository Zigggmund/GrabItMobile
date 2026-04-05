import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetUserReviews } from '@/hooks/review/useGetUserReviews';
import { useLanguage } from '@/hooks/useLanguage';
import { useGetUser } from '@/hooks/user/useGetUser';
import { useTheme } from '@/hooks/useTheme';

import ReviewDistribution from '@/components/common/bars/ReviewDistribution';
import ErrorMessage from '@/components/common/ErrorMessage';
import { SortingMenu } from '@/components/common/SortingMenu';
import ReviewsHeader from '@/components/header/onePage/ReviewsHeader';
import { Review } from '@/components/items/reviews/Review';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

import { PAGE_SIZE } from '@/constants/sizes';

type SortingType = 'new' | 'old' | 'high' | 'low';

export default function UserReviews() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();

  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useGetUserReviews(id);
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useGetUser(Number(id));

  const [sortBy, setSortBy] = useState<SortingType>('new');
  const [ratingFilterBy, setRatingFilterBy] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Sorting + data filters
  const processedReviews = useMemo(() => {
    let result = [...reviews];

    if (ratingFilterBy != null)
      result = result.filter(v => v.rating == ratingFilterBy);
    switch (sortBy) {
      case 'new':
        result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case 'old':
        result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        break;
      case 'high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'low':
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    return result;
  }, [reviews, ratingFilterBy, sortBy]);

  // Pagination
  const paginatedReviews = useMemo(() => {
    return processedReviews.slice(0, page * PAGE_SIZE);
  }, [processedReviews, page]);

  // Сброс при изменении фильтров/режима сортировки
  useEffect(() => {
    setPage(1);
  }, [ratingFilterBy, sortBy]);

  const handleSorting = (value: SortingType) => {
    setSortBy(value);
    if (value) console.log(`Сортировка по критерию ${value} выполнена`);
  };

  const handleRatingFilter = (value: number | null) => {
    setRatingFilterBy(value);
    if (value) console.log(`Фильтрация по рейтингу ${value} выполнена`);
  };

  if (isLoadingUser || isLoadingReviews)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );
  if (isErrorUser || isErrorReviews) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );
  }

  if (!user) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorUserNotFound} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className={'px-4 gap-4'}>
        <ReviewsHeader
          adRating={user.stats.rating}
          reviewCount={user.stats.reviews}
          itemName={user.name}
        />

        <FlatList
          keyExtractor={item => item.id.toString()}
          data={paginatedReviews}
          renderItem={({ item, index }) => (
            <Review isUserReview review={item} index={index} />
          )}
          ItemSeparatorComponent={() => <View className={'h-4'} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          // infinite scroll
          onEndReached={() => {
            if (paginatedReviews.length < processedReviews.length) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListHeaderComponentStyle={{ paddingBottom: 14, zIndex: 10 }}
          ListHeaderComponent={() => (
            <View className={'items-center gap-4'}>
              <ReviewDistribution
                reviews={reviews}
                value={ratingFilterBy}
                onSelect={v => handleRatingFilter(v)}
              />
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
