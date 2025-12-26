import { TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';

import { icons } from '@/constants/icons';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  containerClassName?: string;
}

export default function SearchBar({
  placeholder = '',
  containerClassName = '',
  value,
  onChangeText,
}: SearchBarProps) {
  const { colors } = useTheme();
  const handleTextChange = (text: string) => {
    onChangeText(text);
  };

  return (
    <View
      style={{
        backgroundColor: colors.components.bar.search.bg,
        // flex: 1,
        borderWidth: 1,
        borderColor: colors.components.bar.search.border,
      }}
      className={`flex-row gap-4 px-5 py-1 items-center rounded-full ${containerClassName}`}
    >
      <CustomIcon
        source={icons.search}
        color={colors.components.icon.navIcon.bg}
        size={30}
      />
      <TextInput
        style={{ color: colors.theme.black.primary }}
        className={`flex-1 text-17`}
        placeholder={placeholder}
        placeholderTextColor={colors.components.bar.search.text}
        value={value}
        onChangeText={handleTextChange}
        returnKeyType="search"
      />
    </View>
  );
}
