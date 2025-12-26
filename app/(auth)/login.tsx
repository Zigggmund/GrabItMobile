import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '@/hooks/useLanguage';
import { useProfileLogin } from '@/hooks/useLogin';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

export default function LoginPage() {
  const profileLogin = useProfileLogin();
  const { colors } = useTheme();
  const { l } = useLanguage();

  const [form, setForm] = useState({
    login: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    login: '',
    password: '',
  });

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors = {
      login: '',
      password: '',
    };

    if (form.login.length < 6) newErrors.login = l.validationLogin;
    if (form.password.length < 8) newErrors.password = l.validationPassword;

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleLogin = async () => {
    if (!validate()) return;

    console.log('Form data:', form);
    profileLogin.mutate(form);
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
          value={form.login}
          onChangeText={v => setField('login', v)}
          onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
          errorMessage={errors.login}
        />

        <CustomInput
          inputClassName={'py-3'}
          label={l.password}
          placeholder={l.enterPassword}
          isPassword={true}
          value={form.password}
          onChangeText={v => setField('password', v)}
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
