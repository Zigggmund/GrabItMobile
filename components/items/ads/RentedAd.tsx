import { AdRentedType } from '@/types/AdType';

import { Image, View } from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { getRemainingTime } from '@/utils/getRemainingTime';
import { phoneNumberFormat } from '@/utils/phoneNumberFormat';

import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface RentedAdProps {
  ad: AdRentedType;
  width: number;
  isEnded: boolean;
}

export default function RentedAd({ width, ad, isEnded }: RentedAdProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const remainingTime = getRemainingTime(ad.endTime);

  return (
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
        source={{ uri: ad.previewImage.url }}
      />
      <View className={'flex-1 pt-2 px-2 pb-2 justify-between'}>
        <View className={'gap-2'}>
          <View className={'flex-row justify-between items-center'}>
            <CustomText
              style={{ color: colors.theme.blue.primary }}
              className={'text-12'}
            >
              {phoneNumberFormat(ad.renter.phoneNumber)}
            </CustomText>
            <ProfileAvatar
              size={30}
              source={ad.renter.avatar?.url}
              id={ad.renter.id}
            />
          </View>
          <CustomText
            highlight
            style={{ color: colors.theme.blue.primary, lineHeight: 22 }}
            className={'text-20 font-bold'}
            numberOfLines={2}
          >
            {ad.title}
          </CustomText>
          {isEnded ? (
            <CustomText
              highlight
              style={{ color: colors.base.red.primary }}
              className={'text-13'}
            >
              {l.rentEnded}
            </CustomText>
          ) : (
            <View>
              <CustomText
                style={{ color: colors.base.green.primary, lineHeight: 15 }}
                className={'text-13'}
              >
                {l.rentEndSoon}:
              </CustomText>
              <CustomText
                style={{ color: colors.base.green.primary, lineHeight: 15 }}
                className={'text-12 font-bold'}
              >
                {remainingTime} {l.hours}
              </CustomText>
            </View>
          )}
        </View>
        <CustomButton
          isSmall
          iconSize={15}
          iconSource={icons.chat}
          textClassName={'text-13'}
          text={l.btnMessage}
          className="self-center"
          onPress={() => router.push('/(tabs)/chats/myChats')}
        />
      </View>
    </View>
  );
}
