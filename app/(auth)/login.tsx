import { View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';
import { useLogin } from '@/hooks/auth/useLogin';

export default function LoginPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const login = useLogin();

  return (
    <ScreenContainer className={'pt-6 px-10'}>
      <View className="gap-8 items-center w-full">
        <CustomText
          style={{ color: colors.base.orange.primary }}
          className="text-46 text-center pb-10 font-bold"
          highlight
        >
          {l.authorization}
        </CustomText>
      </View>
      <View className="w-full gap-6 items-center flex-1 justify-center">
        <CustomText
          className="text-18 font-bold text-center"
          style={{ color: colors.theme.blue.primary }}
        >
          {l.loginIsImportant}
        </CustomText>
        <CustomButton
          text={l.btnLoginViaSSO}
          type="secondary"
          onPress={login.mutate}
          textClassName="text-26"
          className={'w-full'}
        />
      </View>
    </ScreenContainer>
  );
}
