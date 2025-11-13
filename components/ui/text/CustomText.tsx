import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  highlight?: boolean;
  className?: string; // для добавления других стилей Tailwind
}

export const CustomText = ({
  className = '',
  highlight,
  children,
  ...props
}: CustomTextProps) => {
  const fontClass = highlight ? 'font-mulish' : 'font-inter';
  const finalClassName = `${fontClass} ${className}`.trim();

  return (
    <Text {...props} className={finalClassName}>
      {children}
    </Text>
  );
};
