import { Pressable, View } from 'react-native';

import { useGetProductTypeCategories } from '@/hooks/category/useGetProductTypeCategories';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';
import { TranslationKey } from '@/types/LanguageType';
import { ProductType } from '@/types/entities/AdType';

interface CategoryProps {
  categoryId: string;
  isSmall?: boolean;
  productType: ProductType;
  onPress?: () => void;
}

export function Category({
  categoryId,
  productType,
  onPress,
  isSmall = false,
}: CategoryProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  // не нужно isError и isLoading, подгружаются при старте приложения
  const { data: categories = [] } = useGetProductTypeCategories(productType);
  const category = categories.find(c => c.id === Number(categoryId));

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
          {category?.name}
          {/*{l[category?.name as TranslationKey]}*/}
        </CustomText>
      </View>
    </Pressable>
  );
}
