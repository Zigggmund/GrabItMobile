import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useLoginFinish } from '@/hooks/auth/useLoginFinish';
import { useDebounce } from '@/hooks/useDebounce';
import { useLanguage } from '@/hooks/useLanguage';
import { useCheckUsername } from '@/hooks/user/useCheckUsername';
import { useTheme } from '@/hooks/useTheme';

const toApiDate = (date: string): string => {
  const [day, month, year] = date.split('.');
  return `${year}-${month}-${day}`;
};

import {
  isValidBirthDate,
  isValidPhone, validateUsername,
} from '@/utils/validate/userValidators';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomInputMenu } from '@/components/ui/input/CustomInputMenu';
import { CustomText } from '@/components/ui/text/CustomText';

import { LoginFinishDto } from '@/services/api/services/dto/auth.dto';

// телефон и пол не обязательны
export default function LoginFinishPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const loginFinish = useLoginFinish();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: null as 'male' | 'female' | 'other' | null,
    phoneNumber: '',
    username: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    gender: '',
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

  const debouncedUsername = useDebounce<string>(form.username, 500);
  const { data: isAvailable, isFetching: isCheckingUsername } =
    useCheckUsername(debouncedUsername);

  const usernameHint = (() => {
    if (!validateUsername(debouncedUsername)) return l.validationUsername;
    if (isCheckingUsername) return l.checkingUsername;
    if (isAvailable === true) return l.usernameAvailable;
    if (isAvailable === false) return l.usernameUnavailable;
    return '';
  })();

  const usernameHintColor = isCheckingUsername
    ? colors.base.yellow.primary
    : validateUsername(debouncedUsername) && isAvailable === true
      ? colors.base.green.primary
      : colors.base.red.primary;

  const validate = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      gender: '', // no validation
      phoneNumber: '',
      username: '',
      birthDate: '',
    };

    if (form.firstName.length < 2 || form.firstName.length > 20)
      newErrors.firstName = l.validationFirstName;
    if (form.lastName.length < 2 || form.lastName.length > 20)
      newErrors.lastName = l.validationLastName;
    if (
      form.username.length < 6 ||
      form.username.length > 20 ||
      form.username.includes(' ')
    ) {
      newErrors.username = l.validationUsername;
    } else if (isCheckingUsername || isAvailable === undefined) {
      newErrors.username = l.checkingUsername;
    } else if (isAvailable === false) {
      newErrors.username = l.validationUsernameAlreadyTaken;
    }
    if (form.phoneNumber.trim() && !isValidPhone(form.phoneNumber)) {
      newErrors.phoneNumber = l.validationPhone;
    }
    if (!form.birthDate.trim() || !isValidBirthDate(form.birthDate)) {
      newErrors.birthDate = l.validationBirthDate;
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleLoginFinish = async () => {
    if (!validate()) return;

    const payload: LoginFinishDto = {
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phoneNumber.replace(/\s+/g, '') ?? null,
      username: form.username,
      birth_date: toApiDate(form.birthDate),
      gender: form.gender,
    };
    loginFinish.mutate(payload);
  };

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
          {/*<CustomInputMenu*/}
          {/*  label={l.interfaceLanguage}*/}
          {/*  items={[*/}
          {/*    { label: l.russian, value: 'ru' },*/}
          {/*    { label: l.english, value: 'en' },*/}
          {/*  ]}*/}
          {/*  value={form.language}*/}
          {/*  placeholder={l.selectLanguage}*/}
          {/*  onSelect={v => setField('language', v)}*/}
          {/*  errorMessage={errors.language}*/}
          {/*  onClearError={() => setErrors(prev => ({ ...prev, language: '' }))}*/}
          {/*/>*/}
          <View className="w-full">
            <CustomInput
              label={l.username}
              placeholder={l.enterUsername}
              value={form.username}
              onChangeText={v => setField('username', v)}
              onClearError={() =>
                setErrors(prev => ({ ...prev, username: '' }))
              }
              errorMessage={errors.username}
            />
            {usernameHint !== '' && !errors.username && (
              <CustomText
                className="text-12 mt-1 ml-1"
                style={{ color: usernameHintColor }}
              >
                {usernameHint}
              </CustomText>
            )}
          </View>
          <CustomInput
            label={l.firstName}
            placeholder={l.enterFirstName}
            value={form.firstName}
            onChangeText={v => setField('firstName', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.firstName}
          />
          <CustomInput
            label={l.lastName}
            placeholder={l.enterLastName}
            value={form.lastName}
            onChangeText={v => setField('lastName', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.lastName}
          />
          <CustomInput
            label={`${l.birthDate} (${l.dateFormat})`}
            placeholder={l.enterBirthDate}
            value={form.birthDate}
            onChangeText={v => setField('birthDate', v)}
            onClearError={() => setErrors(prev => ({ ...prev, login: '' }))}
            errorMessage={errors.birthDate}
          />
          <CustomInputMenu
            label={`${l.gender} (${l.optional})`}
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
            label={`${l.phoneNumber} (${l.optional})`}
            placeholder={l.enterPhoneNumber}
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
            disabled={loginFinish.isPending}
            className={'w-full'}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
