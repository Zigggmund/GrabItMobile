import { TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';

import { icons } from '@/constants/icons';

interface TypingBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAddMedia: () => void;
  containerClassName?: string;
}

export default function TypingBar({
  placeholder = '',
  containerClassName = '',
  value,
  onChangeText,
  onSend,
  onAddMedia,
}: TypingBarProps) {
  const { colors } = useTheme();

  const handleTextChange = (text: string) => {
    onChangeText(text);
  };

  return (
    <>
      <View className={'flex-row gap-4 items-center'}>
        <CustomIcon
          source={icons.add}
          onPress={onAddMedia}
          size={34}
          color={colors.components.icon.navIcon.bg}
        />
        <View
          style={{
            backgroundColor: colors.components.bar.search.bg,
            flex: 1,
            borderWidth: 1,
            borderColor: colors.components.bar.search.border,
          }}
          className={`flex-row gap-4 px-5 py-1 items-center rounded-full ${containerClassName}`}
        >
          <TextInput
            style={{ color: colors.theme.black.primary }}
            className={`text-17 flex-1`}
            placeholder={placeholder}
            placeholderTextColor={colors.components.bar.search.text}
            value={value}
            onChangeText={handleTextChange}
            returnKeyType="search"
          />
          <CustomIcon
            onPress={onSend}
            source={icons.message}
            color={
              value
                ? colors.base.orange.primary
                : colors.components.icon.navIcon.bg
            }
            size={24}
          />
        </View>
      </View>
    </>
  );
}
