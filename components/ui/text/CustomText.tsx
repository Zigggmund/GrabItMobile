import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  numberOfLines?: number;
  highlight?: boolean;
  className?: string; // для добавления других стилей Tailwind
}

export const CustomText = ({
  numberOfLines = 0,
  className = '',
  highlight, // true - mulish, false - inter
  children,
  ...props
}: CustomTextProps) => {
  const family = highlight ? 'mulish' : 'inter';
  // унификация передачи fontWeight: без привязки к fontFamily (пример - font-bold)
  const isBold = className.includes('font-bold');
  const isMedium = className.includes('font-medium');

  const weightClass = isBold
    ? `font-${family}Bold`
    : isMedium
      ? `font-${family}Medium`
      : `font-${family}`;

  // удаление font-bold / font-medium
  const clean = className
    .replace('font-bold', '')
    .replace('font-medium', '')
    .trim();

  const final = `${weightClass} ${clean}`.trim();

  return (
    <Text
      {...props}
      className={final}
      numberOfLines={numberOfLines > 0 ? numberOfLines : undefined}
      ellipsizeMode={numberOfLines > 0 ? 'tail' : undefined}
    >
      {children}
    </Text>
  );
};
