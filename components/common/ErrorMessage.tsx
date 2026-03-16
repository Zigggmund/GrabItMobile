import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

interface ErrorMessageProps {
  text: string;
}

export default function ErrorMessage({ text }: ErrorMessageProps) {
  const { colors } = useTheme();

  return (
    <CustomText
      style={{ color: colors.base.red.primary }}
      highlight
      className={'text-60 font-medium'}
    >
      {text}
    </CustomText>
  );
}
