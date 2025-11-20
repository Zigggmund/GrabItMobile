import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/hooks/useTheme';

import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  return (
    <ScreenContainer>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        className={'text-50'}
        highlight
      >
        Chat-{id}
      </CustomText>
    </ScreenContainer>
  );
}
