import { AdPreviewType } from '@/types/AdType';

import { Image, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import RatingStars from '@/components/common/RatingStars';
import { CustomText } from '@/components/ui/text/CustomText';

interface SmallAdProps {
  ad: AdPreviewType;
  width: number;
}

export default function SmallAd({ width, ad }: SmallAdProps) {
  const { colors } = useTheme();
  const { l } = useLanguage();

  return (
    <View
      className={'h-56 rounded-xl overflow-hidden'}
      style={{
        width: width,
        backgroundColor: colors.theme.white.primary,
        borderWidth: 1,
        borderColor: colors.components.card.rent.border,
      }}
    >
      <Image
        style={{
          borderWidth: 1,
          borderColor: colors.components.card.rent.border,
        }}
        source={{ uri: ad.previewImage.url }}
        height={100}
      />
      <View className={'pt-2 gap-1 px-2'}>
        <RatingStars rating={ad.rating} />
        <CustomText
          highlight
          style={{ color: colors.theme.blue.primary }}
          className={'text-14 font-bold'}
          numberOfLines={1}
        >
          {ad.title}
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'pt-1 text-11 font-bold'}
          numberOfLines={1}
        >
          {ad.cost[0].payment} {l[ad.cost[0].priceUnit]}
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.bright }}
          className={'text-11'}
          numberOfLines={1}
        >
          {ad.address}
        </CustomText>
      </View>
    </View>
  );
}
