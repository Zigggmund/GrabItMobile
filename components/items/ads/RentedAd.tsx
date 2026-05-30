import { AdRentedType } from '@/types/entities/AdType';

import { Image, TouchableOpacity, View } from 'react-native';

import { useHistory } from '@/hooks/useHistory';
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
  const { navigate } = useHistory();

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
          source={{ uri: ad.previewImage.url }}
        />
        <View className={'flex-1 pt-2 px-2 pb-2 justify-between'}>
          <View className={'gap-2'}>
            <View className={'flex-row justify-between items-center'}>
              {ad.landlord.phoneNumber && (
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-12'}
                >
                  {phoneNumberFormat(ad.landlord.phoneNumber)}
                </CustomText>
              )}
              <ProfileAvatar
                size={30}
                source={ad.landlord.avatar}
                username={ad.landlord.username}
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
                  {remainingTime} {l.hour}
                </CustomText>
              </View>
            )}
          </View>
          {/* переход сразу в чат? */}
          <CustomButton
            isSmall
            iconSize={15}
            iconSource={icons.chat}
            textClassName={'text-13'}
            text={l.btnMessage}
            className="self-center"
            onPress={() => navigate('/(tabs)/chats/myChats')}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
