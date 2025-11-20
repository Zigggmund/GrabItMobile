import { View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

export default function Index() {
  const { colors } = useTheme();

  return (
    <ScreenContainer>
      <View className={'justify-between flex-row'}>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30'}
        >
          Hello there
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30'}
        >
          Привет всем
        </CustomText>
      </View>
      <View className={'justify-between flex-row'}>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-medium'}
        >
          Hello there
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-medium'}
        >
          Привет всем
        </CustomText>
      </View>
      <View className={'justify-between flex-row'}>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-bold'}
        >
          Hello there
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-bold'}
        >
          Привет всем
        </CustomText>
      </View>
      <View className={'justify-between flex-row'}>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30'}
          highlight
        >
          Hello there
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30'}
          highlight
        >
          Привет всем
        </CustomText>
      </View>
      <View className={'justify-between flex-row'}>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-medium'}
          highlight
        >
          Hello there
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-medium'}
          highlight
        >
          Привет всем
        </CustomText>
      </View>
      <View className={'justify-between flex-row'}>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-bold'}
          highlight
        >
          Hello there
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-30 font-bold'}
          highlight
        >
          Привет всем
        </CustomText>
      </View>

      <CustomButton onPress={() => router.push('/(auth)/login')} text={'login'} />
      <CustomButton
        onPress={() => router.push('/(tabs)/ads/booking/123')}
        text={'booking-123'}
      />
      <CustomButton
        onPress={() => router.push('/(tabs)/users/1')}
        text={'settings'}
      />

      {/* Тест */}
      {/*<View className={'top-3 justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-inter'}*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-mulish'}*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}
      {/*<View className={'top-3 justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-interMedium'}*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-mulishMedium'}*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}
      {/*<View className={'top-3 justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-interBold'}*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-mulishBold'}*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}

      {/*ТЕСТ 2*/}
      {/*<CustomButton text={l.dark} onPress={() => setTheme('dark')} />*/}
      {/*<CustomButton text={l.light} onPress={() => setTheme('light')} />*/}
      {/*<CustomButton text={l.english} onPress={() => setLanguage('en')} />*/}
      {/*<CustomButton text={l.russian} onPress={() => setLanguage('ru')} />*/}
    </ScreenContainer>
  );
}
