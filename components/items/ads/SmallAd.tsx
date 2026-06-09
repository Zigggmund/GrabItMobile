import { AdPreviewType } from '@/types/entities/AdType';

import { Image, TouchableOpacity, View } from 'react-native';

import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { PremiumBadge } from '@/components/common/PremiumBadge';
import RatingStars from '@/components/common/RatingStars';
import { CustomText } from '@/components/ui/text/CustomText';

import { images } from '@/constants/images';

interface SmallAdProps {
  ad: AdPreviewType;
  width: number;
}

export default function SmallAd({ width, ad }: SmallAdProps) {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { navigate } = useHistory();
  // const isSpace = ad.productType == 'space';
  const price = ad.rub_per_hour;
  const rubPer = l.rubPerHour;

  return (
    <TouchableOpacity
      onPress={() =>
        navigate({
          pathname: '/(tabs)/ads/[id]',
          params: { id: ad.id.toString() },
        })
      }
    >
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
          source={
            ad.previewImage.url
              ? { uri: ad.previewImage.url }
              : images.defaultAd
          }
          height={100}
        />
        <View className={'pt-2 gap-1 px-2'}>
          <View className="flex-row items-center gap-1.5">
            <RatingStars rating={ad.rating} />
            {ad.ownerIsPremium && <PremiumBadge />}
          </View>
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
            {price} {rubPer}
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
    </TouchableOpacity>
  );
}
