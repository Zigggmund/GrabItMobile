import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

interface LoadingScreenProps {
  onPress?: () => void;
  loading?: boolean;
}

// STATUSBAR поменять нельзя - он может быть лишь один для приложения
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onPress, loading }) => {
  const { l, language } = useLanguage();
  const { colors, theme } = useTheme();
  console.log('НАЧАЛЬНАЯ ТЕМА:', theme);
  console.log('НАЧАЛЬНАЯ ТЕМА:', language);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.theme.white.bright }}
    >
      <LinearGradient
        colors={
          theme === 'light'
            ? [colors.base.orange.dark, colors.theme.white.bright]
            : [
                colors.base.neutral.greyBlueBright,
                colors.base.neutral.greyBlueDark,
              ]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ width: '100%', height: '50%' }}
      />

      <View className={'px-8'}>
        <CustomText
          highlight
          style={{ color: colors.theme.blue.dark }}
          className={'text-60 font-bold'}
        >
          GrabIt
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'mb-10 text-28 italic'}
        >
          {l.welcome}
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.bright }}
          className={'mb-16 text-16'}
        >
          {l.slogan}
        </CustomText>
        {!loading ? (
          <CustomButton
            textClassName={'text-28'}
            text={l.btnStart}
            onPress={onPress}
          />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     zIndex: 0,
//   },
//   label: {
//     borderWidth: 3,
//     borderRadius: 20,
//     // borderColor: colors.black,
//     position: 'absolute',
//     top: 60,
//     alignSelf: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     // backgroundColor: colors.green.textBlock, // Пример фона для текста
//   },
//   wrapper: {
//     zIndex: 1,
//     height: '100%',
//     width: '100%',
//   },
// });

export default LoadingScreen;
