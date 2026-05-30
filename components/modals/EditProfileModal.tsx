import { UserType } from '@/types/entities/UserType';

import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { useLanguage } from '@/hooks/useLanguage';
import { useChangeProfile } from '@/hooks/user/useChangeProfile';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomInputMenu } from '@/components/ui/input/CustomInputMenu';
import { CustomText } from '@/components/ui/text/CustomText';

interface Props {
  visible: boolean;
  onClose: () => void;
  user: UserType;
}

// yyyy-mm-dd → dd.mm.yyyy для отображения в поле ввода
const isoToDisplay = (iso: string | null): string => {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
};

// dd.mm.yyyy → yyyy-mm-dd для отправки на сервер
const displayToIso = (display: string): string | null => {
  if (!display.trim()) return null;
  const parts = display.split('.');
  if (parts.length !== 3) return null;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const isValidBirthDate = (date: string): boolean => {
  if (!date.trim()) return true; // необязательно
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return false;
  const [d, m, y] = date.split('.').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return (
    dateObj.getFullYear() === y &&
    dateObj.getMonth() === m - 1 &&
    dateObj.getDate() === d &&
    y >= 1900 &&
    y <= new Date().getFullYear()
  );
};

const isValidPhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // необязательно
  return /^(\+7|8)\d{10}$/.test(phone.replace(/[\s\-()]/g, ''));
};

export default function EditProfileModal({ visible, onClose, user }: Props) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const changeProfile = useChangeProfile();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState(user.firstName ?? '');
  const [lastName, setLastName] = useState(user.lastName ?? '');
  const [phone, setPhone] = useState(user.phoneNumber ?? '');
  const [birthDate, setBirthDate] = useState(isoToDisplay(user.birthDate));
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(
    (user.gender as 'male' | 'female' | 'other' | null) ?? null,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (firstName.trim().length < 2 || firstName.trim().length > 20) {
      next.firstName = l.validationFirstName;
    }
    if (lastName.trim().length < 2 || lastName.trim().length > 20) {
      next.lastName = l.validationLastName;
    }
    if (phone.trim() && !isValidPhone(phone)) {
      next.phone = l.validationPhone;
    }
    if (birthDate.trim() && !isValidBirthDate(birthDate)) {
      next.birthDate = l.validationBirthDate;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    changeProfile.mutate(
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        birth_date: displayToIso(birthDate),
        gender,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['me'] });
          onClose();
        },
        onError: () => {
          setErrors(prev => ({ ...prev, general: l.errorSaveProfile }));
        },
      },
    );
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000066',
            justifyContent: 'flex-end',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />

          <View
            style={{
              backgroundColor: colors.theme.white.primary,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              maxHeight: '88%',
            }}
          >
            {/* Заголовок */}
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              className={'text-24 font-bold mb-4 text-center'}
              highlight
            >
              {l.editProfileTitle}
            </CustomText>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View className={'gap-4'}>
                <CustomInput
                  label={l.firstName}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={l.enterFirstName}
                  errorMessage={errors.firstName}
                  onClearError={() => setErrors(p => ({ ...p, firstName: '' }))}
                />

                <CustomInput
                  label={l.lastName}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={l.enterLastName}
                  errorMessage={errors.lastName}
                  onClearError={() => setErrors(p => ({ ...p, lastName: '' }))}
                />

                <CustomInput
                  label={l.phoneNumber}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder={l.enterPhoneNumber}
                  keyboardType="phone-pad"
                  errorMessage={errors.phone}
                  onClearError={() => setErrors(p => ({ ...p, phone: '' }))}
                />

                <CustomInput
                  label={l.birthDate}
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder={l.enterBirthDate}
                  keyboardType="numeric"
                  errorMessage={errors.birthDate}
                  onClearError={() => setErrors(p => ({ ...p, birthDate: '' }))}
                />

                <CustomInputMenu
                  label={l.gender}
                  items={[
                    { label: l.male, value: 'male' },
                    { label: l.female, value: 'female' },
                    { label: l.otherGender, value: 'other' },
                  ]}
                  value={gender}
                  placeholder={'—'}
                  onSelect={v => setGender(v as 'male' | 'female' | 'other')}
                />

                {errors.general && (
                  <CustomText
                    style={{ color: colors.base.red.primary }}
                    className={'text-14 text-center'}
                  >
                    {errors.general}
                  </CustomText>
                )}

                <View className={'flex-row gap-3 mt-2 mb-4'}>
                  <CustomButton
                    type={'red'}
                    text={l.btnCancel}
                    className={'flex-1'}
                    onPress={onClose}
                  />
                  <CustomButton
                    type={'green'}
                    text={changeProfile.isPending ? l.loading : l.btnSave}
                    className={'flex-1'}
                    disabled={changeProfile.isPending}
                    onPress={handleSave}
                  />
                </View>
              </View>
            </ScrollView>

            {changeProfile.isPending && (
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  bottom: 80,
                }}
                color={colors.base.orange.primary}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
