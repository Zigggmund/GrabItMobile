import { Image, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import RatingStars from '@/components/common/RatingStars';
import { CustomText } from '@/components/ui/text/CustomText';
import { AdPreviewType } from '@/types/AdType';

interface BigAdProps {
  ad: AdPreviewType;
  width: number;
}

export default function BigAd({ width, ad }: BigAdProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();

  return (
    <View
      className={'h-48 rounded-xl overflow-hidden flex-row'}
      style={{
        width: width,
        backgroundColor: colors.theme.white.primary,
        borderWidth: 1,
        borderColor: colors.components.card.rent.border,
      }}
    >
      <Image
        style={{
          width: '45%',
          borderWidth: 1,
          borderColor: colors.components.card.rent.border,
          borderRadius: 10,
        }}
        source={{ uri: ad.previewImage.url }}
      />
      <View className={'flex-1 pt-2 px-2 pb-1 justify-between'}>
        <View className={'gap-1'}>
          <CustomText
            highlight
            style={{ color: colors.theme.blue.primary }}
            className={'text-15 font-bold'}
            numberOfLines={2}
          >
            {ad.title}
          </CustomText>
          <CustomText
            highlight
            style={{ color: colors.theme.blue.primary }}
            className={'text-11'}
            numberOfLines={3}
          >
            {ad.description}
          </CustomText>
        </View>
        <View className={'gap-1'}>
          <View
            style={{ width: '90%' }}
            className={'flex-row justify-between items-center'}
          >
            <RatingStars rating={ad.rating} />
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              numberOfLines={1}
              className={'text-10'}
            >
              {l.revs}: {ad.reviewCount}
            </CustomText>
          </View>
          <View className={'flex-row justify-between items-center'}>
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              className={'pt-1 text-11 font-bold'}
              numberOfLines={1}
            >
              {ad.cost[0].payment} {l[ad.cost[0].priceUnit]}
            </CustomText>
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              className={'pt-1 text-11 font-bold'}
              numberOfLines={2}
            >
              {ad.category.name}
            </CustomText>
          </View>
          <CustomText
            style={{ color: colors.theme.blue.bright }}
            className={'text-11'}
            numberOfLines={1}
          >
            {ad.address}
          </CustomText>
        </View>
      </View>
    </View>
  );
}
