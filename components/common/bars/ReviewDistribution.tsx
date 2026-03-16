import { ReviewType } from '@/types/ReviewType';

import { FlatList, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface ReviewDistributionProps {
  reviews: ReviewType[];
}

export default function ReviewDistribution({
  reviews,
}: ReviewDistributionProps) {
  const { colors } = useTheme();

  const ratings = new Array(5).fill(0);
  reviews.forEach(review => {
    ratings[review.rating - 1]++;
  });

  return (
    <View className={'w-full px-4 py-2'} style={{ maxWidth: 400 }}>
      <FlatList
        data={ratings.reverse()}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View className={'h-4'} />}
        renderItem={({ item, index }) => (
          <View className={'flex-row gap-2'}>
            <CustomText
              className={'text-16 w-3 font-medium'}
              style={{ color: colors.theme.black.primary }}
            >
              {5 - index}
            </CustomText>
            <CustomIcon source={icons.starFilled} />

            <View className={'relative flex-1 justify-center '}>
              <View
                className={'absolute'}
                style={{
                  height: 12,
                  width: `${(item / reviews.length) * 100}%`,
                  backgroundColor: colors.components.bar.reviewDistribution.bgFilled,
                  zIndex: 10,
                  borderRadius: 10,
                }}
              />
              <View
                className={'absolute'}
                style={{
                  height: 12,
                  width: `100%`,
                  backgroundColor: colors.components.bar.reviewDistribution.bgEmpty,
                  borderRadius: 10,
                }}
              />
            </View>
            <CustomText
              className={'text-16 w-8'}
              style={{ color: colors.theme.blue.primary, textAlign: 'right' }}
            >
              {item}
            </CustomText>
          </View>
        )}
      />
    </View>
  );
}
