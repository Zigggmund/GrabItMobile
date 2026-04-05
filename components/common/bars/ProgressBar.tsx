import { View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

import { baseColors } from '@/constants/colors/baseColors';

interface ProgressBarProps {
  length: number;
  customStyle?: 'reviews' | 'default';
  progress: number;
  isNamed?: boolean;
}

export const ProgressBar = ({
  length,
  progress,
  customStyle = 'default',
  isNamed = true,
}: ProgressBarProps) => {
  const { l } = useLanguage();
  const { colors } = useTheme();

  return (
    <View
      className={`gap-2 justify-center ${customStyle == 'reviews' && 'flex-1'}`}
    >
      {isNamed && (
        <View className={'gap-1 flex-row justify-center'}>
          <CustomText
            style={{ color: colors.components.bar.reviewDistribution.bgFilled }}
            className={'text-20'}
          >
            {l.step}
          </CustomText>
          <CustomText
            style={{ color: colors.components.bar.reviewDistribution.bgFilled }}
            className={'text-20'}
          >
            {progress}/{length}
          </CustomText>
        </View>
      )}

      <View className={'relative justify-center'}>
        <View
          className={'absolute'}
          style={{
            height: 12,
            width: `${(progress / length) * 100}%`,
            backgroundColor:
              customStyle == 'reviews'
                ? colors.components.bar.reviewDistribution.bgFilled
                : baseColors.orange.primary,
            zIndex: 10,
            borderRadius: 10,
          }}
        />
        <View
          className={'absolute'}
          style={{
            height: 12,
            width: `100%`,
            backgroundColor:
              customStyle == 'reviews'
                ? colors.components.bar.reviewDistribution.bgEmpty
                : baseColors.grey.bright,
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  );
};
