import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useLoginFinish } from '@/hooks/auth/useLoginFinish';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomInputMenu } from '@/components/ui/input/CustomInputMenu';
import { CustomText } from '@/components/ui/text/CustomText';

import { LoginFinishDto } from '@/services/api/services/dto/auth.dto';

// Простая проверка даты (ДД.ММ.ГГГГ)
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/;
// Простая маска для телефона (минимум 7 цифр, опциональный + в начале)
const phoneRegex = /^\+?[0-9]{7,15}$/;

// телефон и пол не обязательны
export default function LoginFinishPage() {
  const completedProfile = false;
  const { colors } = useTheme();
  const { l } = useLanguage();
  const loginFinish = useLoginFinish();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: null as 'male' | 'female' | 'other' | null,
    language: 'ru' as 'ru' | 'en',
    phoneNumber: '',
    username: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    language: '',
    phoneNumber: '',
    username: '',
    birthDate: '',
  });

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      gender: '', // no validation
      language: '', // no validation
      phoneNumber: '',
      username: '',
      birthDate: '',
    };

    if (form.firstName.length < 2 || form.firstName.length > 20)
      newErrors.firstName = l.validationFirstName;
    if (form.lastName.length < 2 || form.lastName.length > 20)
      newErrors.lastName = l.validationLastName;
    if (form.username.length < 6 || form.username.length > 20)
      newErrors.username = l.validationUsername;
    if (form.phoneNumber && !phoneRegex.test(form.phoneNumber.replace(/\s+/g, '')))
      newErrors.phoneNumber = l.validationPhone;

    if (!dateRegex.test(form.birthDate)) {
      newErrors.birthDate = l.validationBirthDate;
    } else {
      const [d, m, y] = form.birthDate.split('.').map(Number);
      const birthDateObj = new Date(y, m - 1, d);
      const today = new Date();

      if (birthDateObj > today || y < 1900) {
        newErrors.birthDate = l.validationBirthDate;
      }
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleLoginFinish = async () => {
    if (!validate()) return;

    console.log('Form data:', form);
    const payload: LoginFinishDto = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber.replace(/\s+/g, '') ?? null,
      username: form.username,
      birthDate: form.birthDate,
      gender: form.gender,
      // language: form.language as string,ns e
    };
    loginFinish.mutate(payload);
  };

  if (completedProfile) {
    return <Redirect href="/(tabs)/ads/search" />;
  }

  return (
    <ScreenContainer className={'pt-6 px-10 justify-between'}>
      <ScrollView>
        <View className="gap-6 items-center w-full">
          <CustomText
            style={{ color: colors.base.orange.primary }}
            className="mb-2 text-46 font-bold text-center"
            highlight
          >
            {l.registrationFinish}
          </CustomText>
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
          <CustomInput
            label={l.username}
            placeholder={l.username}
            value={form.username}
            onChangeText={v => setField('username', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.username}
          />
          <CustomInput
            label={l.firstName}
            placeholder={l.firstName}
            value={form.firstName}
            onChangeText={v => setField('firstName', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.firstName}
          />
          <CustomInput
            label={l.lastName}
            placeholder={l.lastName}
            value={form.lastName}
            onChangeText={v => setField('lastName', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.lastName}
          />
          <CustomInput
            label={l.birthDate}
            placeholder={l.birthDate}
            value={form.birthDate}
            onChangeText={v => setField('birthDate', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.birthDate}
          />
          <CustomInputMenu
            label={l.genderOptional}
            items={[
              { label: l.male, value: 'male' },
              { label: l.female, value: 'female' },
              { label: l.other, value: 'other' },
            ]}
            value={form.gender}
            placeholder={l.gender}
            onSelect={v => setField('gender', v)}
            errorMessage={errors.gender}
            onClearError={() => setErrors(prev => ({ ...prev, language: '' }))}
          />
          <CustomInput
            label={l.phoneNumber}
            placeholder={l.phoneNumber}
            value={form.phoneNumber}
            onChangeText={v => setField('phoneNumber', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.phoneNumber}
          />
        </View>

        <View
          style={{ paddingBottom: 24 }}
          className="w-full gap-4 items-center pt-8"
        >
          <CustomButton
            type={'secondary'}
            text={l.btnFinish}
            textClassName="text-24"
            onPress={handleLoginFinish}
            className={'w-full'}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
