import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetUserReviews } from '@/hooks/review/useGetUserReviews';
import { useLanguage } from '@/hooks/useLanguage';
import { useGetUser } from '@/hooks/user/useGetUser';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import ReviewsHeader from '@/components/header/onePage/ReviewsHeader';
import { Review } from '@/components/items/reviews/Review';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';
import { SortingMenu } from '@/components/common/SortingMenu';
import { useState } from 'react';
import ReviewDistribution from '@/components/common/bars/ReviewDistribution';

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
  const handleSorting = (value: SortingType) => {
    setSortBy(value);
    console.log(`Сортировка по критерию ${value} выполнена`);
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
          data={reviews}
          renderItem={({ item, index }) => (
            <Review isUserReview review={item} index={index} />
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
