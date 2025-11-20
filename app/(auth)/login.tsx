import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

export default function LoginPage() {
  const { colors } = useTheme();

  return (
    <SafeAreaView>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        className={'text-50'}
        highlight
      >
        Login
      </CustomText>
    </SafeAreaView>
  );
}
