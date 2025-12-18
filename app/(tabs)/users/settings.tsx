import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomInputMenu } from '@/components/ui/input/CustomInputMenu';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

export default function SettingsPage() {
  const { l, setLanguage, language } = useLanguage();
  const { setTheme, colors, theme } = useTheme();

  return (
    <ScreenContainer className={'px-8 gap-8'}>
      <CustomText
        style={{ color: colors.base.orange.primary }}
        className={'text-50 font-medium'}
        highlight
      >
        {l.settings}
      </CustomText>

      <CustomInputMenu
        label={l.interfaceLanguage}
        items={[
          { label: l.russian, value: 'ru' },
          { label: l.english, value: 'en' },
        ]}
        value={language}
        disable={false}
        onSelect={v => setLanguage(v)}
      />

      <CustomInputMenu
        label={l.designTheme}
        items={[
          { label: l.light, value: 'light', icon: icons.light },
          { label: l.dark, value: 'dark', icon: icons.dark },
        ]}
        value={theme}
        onSelect={v => setTheme(v)}
      />

      {/*<CustomButton text={l.dark} onPress={() => setTheme('dark')} />*/}
      {/*<CustomButton text={l.light} onPress={() => setTheme('light')} />*/}
      {/*<CustomButton text={l.english} onPress={() => setLanguage('en')} />*/}
      {/*<CustomButton text={l.russian} onPress={() => setLanguage('ru')} />*/}
    </ScreenContainer>
  );
}
