import { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '@/hooks/useLanguage';
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

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<'ru' | 'en' | null>(null);

  const [errors, setErrors] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    email: '',
    language: '',
  });

  const handleRegistration = async () => {
    let hasError = false;

    if (login.length < 6) {
      setErrors(prev => ({ ...prev, login: l.validationLogin }));
      hasError = true;
    }

    if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: l.validationPassword }));
      hasError = true;
    }

    if (password != confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: l.validationConfirmPassword,
      }));
      hasError = true;
    }

    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: l.validationEmail }));
      hasError = true;
    }

    if (language == null) {
      setErrors(prev => ({ ...prev, language: l.validationLanguage }));
      hasError = true;
    }

    if (hasError) return;

    console.log('Form data:', { login, email, password, language });
    Alert.alert(
      'Success',
      `Login: ${login}\nPassword: ${password}\nEmail: ${email}\nLanguage: ${language}`,
    );

    router.push('/(tabs)/ads/search');
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
          value={login}
          onChangeText={setLogin}
          onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
          errorMessage={errors.login}
        />

        <CustomInput
          label={l.email}
          placeholder={l.enterEmail}
          value={email}
          onChangeText={setEmail}
          onClearError={() => setErrors(prev => ({ ...prev, email: '' }))}
          errorMessage={errors.email}
        />

        <CustomInput
          label={l.password}
          placeholder={l.enterPassword}
          isPassword={true}
          value={password}
          onChangeText={setPassword}
          onClearError={() => setErrors(prev => ({ ...prev, password: '' }))}
          errorMessage={errors.password}
        />

        <CustomInput
          label={l.confirmPassword}
          placeholder={l.enterPassword}
          isPassword={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
          value={language}
          placeholder={l.selectLanguage}
          onSelect={v => setLanguage(v)}
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
