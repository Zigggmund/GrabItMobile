import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

type sizeType = 'small' | 'medium' | 'big';

interface RatingStarsProps {
  size?: sizeType;
  rating: number | null;
}

const starConfig = {
  small: { size: 12, gap: 4 },
  medium: { size: 16, gap: 6 },
  big: { size: 22, gap: 8 },
};

export default function RatingStars({
  size = 'medium',
  rating,
}: RatingStarsProps) {
  const { size: starSize, gap: starGap } = starConfig[size];
  const stars = [];
  const { colors } = useTheme();
  let star;

  if (rating != null) {
    // при таком значении маленький процент почти не видно
    // const percent = (rating % 1) * 100;
    const basePercent = (rating % 1) * 100;
    // S-образная ease-in-out
    const percent = (0.5 + (basePercent / 100 - 0.5) * 0.6) * 100;
    // console.log(basePercent, percent);

    for (let i = 1; i <= 5; i++) {
      const diff = rating - i;
      if (diff >= 1) {
        // Полная звезда
        star = <CustomIcon key={i} source={icons.starFilled} size={starSize} />;
      } else if (diff > 0) {
        // Частично закрашенная звезда
        star = (
          <View
            key={i}
            style={{ width: starSize, height: starSize, position: 'relative' }}
          >
            <CustomIcon
              source={icons.starEmpty}
              size={starSize}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
            <View
              style={{
                width: `${percent}%`,
                height: starSize,
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'hidden',
              }}
            >
              <CustomIcon source={icons.starFilled} size={starSize} />
            </View>
          </View>
        );
      } else {
        // Пустая звезда
        star = <CustomIcon key={i} source={icons.starEmpty} size={starSize} />;
      }
      stars.push(star);
    }
    return <View style={{ flexDirection: 'row', gap: starGap }}>{stars}</View>;
  } else {
    return (
      <CustomText
        style={{
          color: colors.theme.blue.primary,
          fontSize: starSize * 1.5,
          lineHeight: starSize,
        }}
      >
        -
      </CustomText>
    );
  }
}
