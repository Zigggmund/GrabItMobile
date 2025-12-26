import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '@/hooks/useLanguage';
import { useProfileRegister } from '@/hooks/useRegister';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomInputMenu } from '@/components/ui/input/CustomInputMenu';
import { CustomText } from '@/components/ui/text/CustomText';

// маска для почты (без доменов, простейшая)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const profileRegister = useProfileRegister();

  const [form, setForm] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    email: '',
    language: null as 'ru' | 'en' | null,
  });
  const [errors, setErrors] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    email: '',
    language: '',
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
      confirmPassword: '',
      email: '',
      language: '',
    };

    if (form.login.length < 6) newErrors.login = l.validationLogin;
    if (!emailRegex.test(form.email)) newErrors.email = l.validationEmail;
    if (form.password.length < 8) newErrors.password = l.validationPassword;
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = l.validationConfirmPassword;
    if (!form.language) newErrors.language = l.validationLanguage;

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleRegistration = async () => {
    if (!validate()) return;

    console.log('Form data:', form);
    const payload = {
      login: form.login,
      password: form.password,
      email: form.email,
      language: form.language as string,
    };
    profileRegister.mutate(payload);
  };

  return (
    <ScreenContainer className={'pt-6 px-10 justify-between'}>
      <View className="gap-1 items-center w-full">
        <CustomText
          style={{ color: colors.base.orange.primary }}
          className="mb-2 text-46 font-bold text-center"
          highlight
        >
          {l.registration}
        </CustomText>
        <CustomInput
          label={l.login}
          placeholder={l.enterLogin}
          value={form.login}
          onChangeText={v => setField('login', v)}
          onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
          errorMessage={errors.login}
        />

        <CustomInput
          label={l.email}
          placeholder={l.enterEmail}
          value={form.email}
          onChangeText={v => setField('email', v)}
          onClearError={() => setErrors(prev => ({ ...prev, email: '' }))}
          errorMessage={errors.email}
        />

        <CustomInput
          label={l.password}
          placeholder={l.enterPassword}
          isPassword={true}
          value={form.password}
          onChangeText={v => setField('password', v)}
          onClearError={() => setErrors(prev => ({ ...prev, password: '' }))}
          errorMessage={errors.password}
        />

        <CustomInput
          label={l.confirmPassword}
          placeholder={l.enterPassword}
          isPassword={true}
          value={form.confirmPassword}
          onChangeText={v => setField('confirmPassword', v)}
          onClearError={() =>
            setErrors(prev => ({ ...prev, confirmPassword: '' }))
          }
          errorMessage={errors.confirmPassword}
        />

        <CustomInputMenu
          label={l.interfaceLanguage}
          items={[
            { label: l.russian, value: 'ru' },
            { label: l.english, value: 'en' },
          ]}
          value={form.language}
          placeholder={l.selectLanguage}
          onSelect={v => setField('language', v)}
          errorMessage={errors.language}
          onClearError={() => setErrors(prev => ({ ...prev, language: '' }))}
        />
      </View>

      <View style={{ paddingBottom: 24 }} className="w-full gap-4 items-center">
        <CustomButton
          text={l.btnSignUp}
          textClassName="text-24"
          onPress={handleRegistration}
          className={'w-full'}
        />

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="flex-col gap-2 items-center"
        >
          <CustomText
            className="text-20 underline font-bold"
            style={{ color: colors.base.orange.primary }}
          >
            {l.alreadyHaveAccount}
          </CustomText>

          {/*<CustomButton*/}
          {/*  text={l.btnRegister}*/}
          {/*  type="secondary"*/}
          {/*  onPress={() => router.push('/(auth)/login')}*/}
          {/*/>*/}
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
