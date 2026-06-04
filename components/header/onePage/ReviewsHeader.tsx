import { View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import RatingStars from '@/components/common/RatingStars';
import { CustomText } from '@/components/ui/text/CustomText';

interface ReviewsProps {
  itemRating: number | null;
  itemName: string;
  reviewCount: number;
}

export default function ReviewsHeader({
  itemRating,
  reviewCount,
  itemName,
}: ReviewsProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();

  return (
    <GreyBlock>
      <View className={`gap-1.5 px-2`}>
        <View className={'flex-row justify-between'}>
          {/*<View className={'flex-1 items-center'}>*/}
          <CustomText
            className={'text-18 font-medium'}
            style={{ color: colors.theme.blue.bright }}
          >
            {l.reviews}
          </CustomText>
          {/*</View>*/}
          <View className={'flex-row gap-2 items-center'}>
            {reviewCount > 0 && (
              <CustomText
                className={'text-18 font-bold'}
                style={{ color: colors.theme.blue.dark }}
              >
                {itemRating}
              </CustomText>
            )}
            <RatingStars rating={itemRating} />
          </View>
        </View>

        <View className={'justify-between flex-row items-center gap-4'}>
          <View className={'flex-1 items-start'}>
            <CustomText
              className={'text-20 font-bold'}
              style={{ color: colors.theme.blue.dark }}
              numberOfLines={1}
            >
              {itemName}
            </CustomText>
          </View>
          {/*<CustomText*/}
          {/*  className={'text-16'}*/}
          {/*  style={{ color: colors.theme.blue.primary }}*/}
          {/*>*/}
          {/*  ({reviewCount})*/}
          {/*</CustomText>*/}
        </View>
      </View>
    </GreyBlock>
  );
}
