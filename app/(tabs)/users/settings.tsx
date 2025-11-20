import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

export default function SettingsPage() {
  const { l, setLanguage } = useLanguage();
  const { setTheme, colors } = useTheme();

  return (
    <ScreenContainer>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        className={'text-50'}
        highlight
      >
        settings
      </CustomText>

      <CustomButton text={l.dark} onPress={() => setTheme('dark')} />
      <CustomButton text={l.light} onPress={() => setTheme('light')} />
      <CustomButton text={l.english} onPress={() => setLanguage('en')} />
      <CustomButton text={l.russian} onPress={() => setLanguage('ru')} />
    </ScreenContainer>
  );
}
