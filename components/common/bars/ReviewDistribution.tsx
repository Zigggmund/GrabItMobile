import { ReviewType } from '@/types/ReviewType';

import { FlatList, Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { ProgressBar } from '@/components/common/bars/ProgressBar';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface ReviewDistributionProps {
  reviews: ReviewType[];
  value: number | null;
  onSelect: (value: number | null) => void;
}

export default function ReviewDistribution({
  reviews,
  value,
  onSelect,
}: ReviewDistributionProps) {
  const { colors } = useTheme();

  const ratings = new Array(5).fill(0);
  reviews.forEach(review => {
    ratings[review.rating - 1]++;
  });

  return (
    <View className={'w-full px-2 py-2'} style={{ maxWidth: 400 }}>
      <FlatList
        data={ratings.reverse()}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View className={'h-4'} />}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => onSelect(value == 5 - index ? null : 5 - index)}
            className={'flex-row gap-1 px-2 py-1'}
            style={{
              borderWidth: 5 - index == value ? 4 : 0,
              borderColor: colors.components.bar.reviewDistribution.border,
              borderRadius: 10,
            }}
          >
            <CustomText
              className={'text-16 w-3 font-medium'}
              style={{ color: colors.theme.black.primary }}
            >
              {5 - index}
            </CustomText>
            <CustomIcon source={icons.starFilled} />

            {/*<View className={'flex-1'}>*/}
            <ProgressBar
              length={reviews.length}
              customStyle={'reviews'}
              progress={item}
              isNamed={false}
            />
            {/*</View>*/}

            <CustomText
              className={'text-16 w-8'}
              style={{ color: colors.theme.blue.primary, textAlign: 'right' }}
            >
              {item}
            </CustomText>
          </Pressable>
        )}
      />
    </View>
  );
}
