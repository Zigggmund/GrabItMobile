import { View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import { CustomText } from '@/components/ui/text/CustomText';

interface LandlordAdsProps {
  landlordName: string;
  adsCount: number;
}

export default function LandlordAdsHeader({
  landlordName,
  adsCount,
}: LandlordAdsProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();

  return (
    <GreyBlock>
      <View className={`px-2 justify-between gap-4 flex-row items-center`}>
        <View className={'gap-1.5 items-center flex-1'}>
          <CustomText
            className={'text-18 font-medium'}
            style={{ color: colors.theme.blue.bright }}
          >
            {l.landlordAds}
          </CustomText>
          <CustomText
            className={'text-20 font-bold'}
            style={{ color: colors.theme.blue.dark }}
            numberOfLines={1}
          >
            {landlordName}
          </CustomText>
        </View>
        <CustomText
          className={'font-bold text-18'}
          style={{ color: colors.theme.blue.dark }}
        >
          ({adsCount})
        </CustomText>
      </View>
    </GreyBlock>
  );
}
