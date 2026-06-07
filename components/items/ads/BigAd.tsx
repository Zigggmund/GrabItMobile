import { AdPreviewType } from '@/types/entities/AdType';

import { Image, TouchableOpacity, View } from 'react-native';

import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { Category } from '@/components/common/Category';
import RatingStars from '@/components/common/RatingStars';
import { CustomText } from '@/components/ui/text/CustomText';

import { images } from '@/constants/images';

interface BigAdProps {
  ad: AdPreviewType;
  width: number;
}

export default function BigAd({ width, ad }: BigAdProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const { navigate } = useHistory();
  const price = ad.rub_per_hour;
  const rubPer = l.rubPerDay;

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
        className={'h-52 rounded-xl overflow-hidden flex-row'}
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
          source={
            ad.previewImage.url
              ? { uri: ad.previewImage.url }
              : images.defaultAd
          }
        />
        <View className={'flex-1 pt-3 px-2 pb-2 justify-between'}>
          <CustomText
            highlight
            style={{ color: colors.theme.blue.primary }}
            className={'text-18 font-bold pb-1'}
            numberOfLines={2}
          >
            {ad.title} asdasdasasdasd
          </CustomText>
          <Category
            categoryId={ad.categoryId}
            // isSmall
            productType={'product'}
          />
          <View className={'gap-1'}>
            <View
              style={{ width: '90%' }}
              className={'flex-row justify-between items-center'}
            >
              <RatingStars rating={ad.rating} />
              <CustomText
                style={{ color: colors.theme.blue.dark }}
                numberOfLines={1}
                className={'text-13'}
              >
                {l.revs}: {ad.reviewCount}
              </CustomText>
            </View>
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              className={'text-14 font-bold'}
            >
              {price} {rubPer}
            </CustomText>
            <CustomText
              style={{ color: colors.theme.blue.bright }}
              className={'text-13'}
              numberOfLines={2}
            >
              {ad.address}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
