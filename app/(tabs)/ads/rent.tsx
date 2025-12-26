import { useState } from 'react';
import { Animated, FlatList, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { getRemainingTime } from '@/utils/getRemainingTime';

import RentedAd from '@/components/items/ads/RentedAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { mockRentedAds } from '@/constants/mocks/mockRentedAds';
import ScrollView = Animated.ScrollView;

export default function RentPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const [isOpenCurrent, setIsOpenCurrent] = useState(true);
  const [isOpenEnded, setIsOpenEnded] = useState(true);
  const itemWidth = 340; // ширина RentedAd

  return (
    <ScreenContainer>
      <ScrollView>
        <View
          style={{ width: itemWidth }}
          className={'pb-2 flex-row items-center justify-between'}
        >
          <CustomText
            style={{ color: colors.base.orange.primary,  }}
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
            data={mockRentedAds.filter(
              item => getRemainingTime(item.endTime) > 0,
            )}
            renderItem={({ item }) => (
              <RentedAd width={itemWidth} ad={item} isEnded={false} />
            )}
          />
        )}
        <View style={{ width: itemWidth }} className={'pt-4 pb-2 flex-row justify-between items-center'}>
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
            data={mockRentedAds.filter(
              item => getRemainingTime(item.endTime) == 0,
            )}
            renderItem={({ item }) => (
              <RentedAd width={itemWidth} ad={item} isEnded={true} />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
