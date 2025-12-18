import { useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

export default function LoginPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({ login: '', password: '' });

  const handleLogin = async () => {
    let hasError = false;

    if (login.length < 6) {
      setErrors(prev => ({ ...prev, login: l.validationLogin }));
      hasError = true;
    }

    if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: l.validationPassword }));
      hasError = true;
    }

    if (hasError) return;

    console.log('Form data:', { login, password });
    Alert.alert('Success', `Login: ${login}\nPassword: ${password}`);

    router.push('/(tabs)/ads/search');
  };

  return (
    <ScreenContainer className={'pt-6 px-10 justify-between'}>
      <View className="gap-4 items-center w-full">
        <CustomText
          style={{ color: colors.base.orange.primary }}
          className="text-46 text-center pb-10 font-bold"
          highlight
        >
          {l.authorization}
        </CustomText>

        <CustomInput
          inputClassName={'py-3'}
          label={l.login}
          placeholder={l.enterLogin}
          value={login}
          onChangeText={setLogin}
          onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
          errorMessage={errors.login}
        />

        <CustomInput
          inputClassName={'py-3'}
          label={l.password}
          placeholder={l.enterPassword}
          isPassword={true}
          value={password}
          onChangeText={setPassword}
          onClearError={() => setErrors(prev => ({ ...prev, password: '' }))}
          errorMessage={errors.password}
        />

        <CustomButton
          text={l.btnLogin}
          className={'w-full'}
          textClassName="text-28"
          onPress={handleLogin}
        />
      </View>
      <View className="w-full pb-20 gap-6 items-center">
        <CustomText
          className="text-16 font-bold"
          style={{ color: colors.theme.blue.dark }}
        >
          {l.noAccountYet}
        </CustomText>

        <CustomButton
          text={l.btnCreateAccount}
          type="secondary"
          onPress={() => router.push('/(auth)/registration')}
          textClassName="text-26"
          className={'w-full'}
        />
      </View>
    </ScreenContainer>
  );
}
