import { Pressable, View } from 'react-native';

import { useGetAllCategories } from '@/hooks/category/useGetAllCategories';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

interface CategoryProps {
  categoryId: number;
  isSmall?: boolean;
  onPress?: () => void;
}

export function Category({
  categoryId,
  onPress,
  isSmall = false,
}: CategoryProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  // не нужно isError и isLoading, подгружаются при старте приложения
  const { data: categories = [] } = useGetAllCategories();
  const category = categories.find(c => Number(c.id) === categoryId);

  return (
    <Pressable onPress={onPress}>
      <View
        className={'pl-1.5 pr-1.5 justify-start'}
        style={{
          borderWidth: 2,
          borderRadius: 20,
          borderColor: colors.base.orange.primary,
          maxWidth: isSmall ? 100 : 200,
        }}
      >
        <CustomText
          className={`font-bold text-center ${isSmall ? 'text-10' : 'text-15'}`}
          highlight
          style={{ color: colors.base.orange.primary }}
          numberOfLines={2}
        >
          {l[category!.name]}
        </CustomText>
      </View>
    </Pressable>
  );
}
