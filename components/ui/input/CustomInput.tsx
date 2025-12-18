import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface CompositeInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  isPassword?: boolean;
  onChangeText?: (value: string) => void;
  onClearError?: () => void;
  disable?: boolean;
  multiline?: boolean;
  errorMessage?: string;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export default function CustomInput({
  label,
  value,
  onChangeText,
  onClearError,
  placeholder = '',
  isPassword = false,
  disable = false,
  multiline = false,
  errorMessage = '',
  labelClassName = '',
  containerClassName = '',
  inputClassName = '',
}: CompositeInputProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleTextChange = (text: string) => {
    onChangeText?.(text);

    // пользователь начал ввод — очистить
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  return (
    <View className={`flex-col gap-2 w-full ${containerClassName}`}>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        highlight
        className={`pl-1 text-15 ${labelClassName}`}
      >
        {label.toUpperCase()}
      </CustomText>
      <View
        style={{
          backgroundColor: colors.base.grey.bright,
          borderWidth: errorMessage == '' ? 0 : 1,
          borderColor: colors.base.red.primary,
        }}
        className={`rounded-xl px-3 py-1 gap-2 flex-row items-center ${inputClassName}`}
      >
        <TextInput
          style={{ color: colors.base.neutral.blackPrimary }}
          className={`flex-1 text-18`}
          placeholder={placeholder}
          placeholderTextColor={colors.base.neutral.greyDark}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={handleTextChange}
          editable={!disable}
          multiline={multiline}
        />

        {isPassword &&
          (showPassword ? (
            <CustomIcon
              onPress={() => setShowPassword(false)}
              size={24}
              color={colors.base.neutral.blackPrimary}
              source={icons.eyeCrossedOut}
            />
          ) : (
            <CustomIcon
              onPress={() => setShowPassword(true)}
              size={24}
              color={colors.base.neutral.blackPrimary}
              source={icons.eye}
            />
          ))}
      </View>

      <View style={{ minHeight: 18 }}>
        {errorMessage && (
          <CustomText
            style={{ color: colors.base.red.primary }}
            className="text-red-500 text-12"
          >
            {errorMessage}
          </CustomText>
        )}
      </View>
    </View>
  );
}
//
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   label: {
//     fontWeight: 'bold',
//     width: '40%',
//     textAlign: 'center',
//     alignSelf: 'center',
//   },
//   valueWrapper: {
//     position: 'relative',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   text: {
//     width: '100%',
//     textAlign: 'center',
//     fontSize: 20,
//     color: '#000',
//     flexWrap: 'wrap', // пофиксить
//   },
//   underline: {
//     position: 'absolute',
//     left: 0,
//     bottom: '20%',
//     height: 1,
//     width: '100%', // или подбери под макет
//     backgroundColor: colors.black,
//   },
// });
