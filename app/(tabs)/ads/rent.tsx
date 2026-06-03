import { useState } from 'react';
import { ActivityIndicator, Animated, FlatList, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { getRemainingTime } from '@/utils/getRemainingTime';

import RentedAd from '@/components/items/ads/RentedAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import ScrollView = Animated.ScrollView;
import { useGetUserRentedAds } from '@/hooks/ad/useGetUserRentedAds';
import { useProfile } from '@/hooks/user/useProfile';

import ErrorMessage from '@/components/common/ErrorMessage';
import { Tag } from '@/components/common/Tag';

import { BIG_AD_WIDTH } from '@/constants/sizes';

export default function RentPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const profile = useProfile();
  const [isOpenCurrent, setIsOpenCurrent] = useState(true);
  const [isOpenEnded, setIsOpenEnded] = useState(false);
  const [status, setStatus] = useState();

  const {
    data: rentedAds = [],
    isLoading: isLoading,
    isError: isError,
  } = useGetUserRentedAds(profile.user!.id);

  if (isLoading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (isError)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );

  return (
    <ScreenContainer>
      <ScrollView>
        <View
          className={'gap-x-2 px-2 gap-y-3 flex-row  justify-center flex-wrap'}
        >
          <Tag
            isSmall
            label={l.active}
            selected={status == 'active'}
            onPress={() => setStatus('active')}
          />
          <Tag
            isSmall
            label={l.paused}
            selected={status == 'paused'}
            onPress={() => setStatus('paused')}
          />
          <Tag
            isSmall
            label={l.deleted}
            selected={status == 'deleted'}
            onPress={() => setStatus('deleted')}
          />
        </View>
        <CustomText
          className={'text-14'}
          style={{ color: colors.theme.blue.bright }}
        >
          {/*{l.adsFound}: {total}*/}
        </CustomText>
        <View
          style={{ width: BIG_AD_WIDTH }}
          className={'pb-2 flex-row items-center justify-between'}
        >
          <CustomText
            style={{ color: colors.base.orange.primary }}
            className={'text-33 font-medium flex-1 text-center'}
            highlight
          >
            {l.current}
          </CustomText>
          <CustomIcon
            source={isOpenCurrent ? icons.pointerDown : icons.pointerDownFilled}
            size={32}
            onPress={() => setIsOpenCurrent(!isOpenCurrent)}
            className={'left-0'}
          />
        </View>
        {isOpenCurrent && (
          <FlatList
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            data={rentedAds.filter(item => getRemainingTime(item.endTime) > 0)}
            renderItem={({ item }) => (
              <RentedAd width={BIG_AD_WIDTH} ad={item} isEnded={false} />
            )}
            ListEmptyComponent={() => (
              <CustomText
                highlight
                className={'text-28 text-center'}
                style={{ color: colors.theme.blue.primary }}
              >
                {l.emptyAdList}
              </CustomText>
            )}
          />
        )}
        <View
          style={{ width: BIG_AD_WIDTH }}
          className={'pt-4 pb-2 flex-row justify-between items-center'}
        >
          <CustomText
            style={{ color: colors.base.orange.primary }}
            className={'text-33 font-medium flex-1 text-center'}
            highlight
          >
            {l.ended}
          </CustomText>
          <CustomIcon
            source={isOpenEnded ? icons.pointerDown : icons.pointerDownFilled}
            size={32}
            onPress={() => setIsOpenEnded(!isOpenEnded)}
            className={'left-0'}
          />
        </View>
        {isOpenEnded && (
          <FlatList
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            data={rentedAds.filter(item => getRemainingTime(item.endTime) == 0)}
            renderItem={({ item }) => (
              <RentedAd width={BIG_AD_WIDTH} ad={item} isEnded={true} />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={() => (
              <CustomText
                highlight
                className={'text-28 text-center'}
                style={{ color: colors.theme.blue.primary }}
              >
                {l.emptyAdList}
              </CustomText>
            )}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
