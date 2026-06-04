import { CategoryType } from '@/types/entities/CategoryType';
import { ProductType } from '@/types/entities/AdType';

import { useQuery } from '@tanstack/react-query';

import { useLanguage } from '@/hooks/useLanguage';
import { CategoryService } from '@/services/api/services/categoryService';

export const useGetProductTypeCategories = (productType: ProductType) => {
  const { language } = useLanguage();

  return useQuery<CategoryType[]>({
    queryKey: ['categories', productType, language],
    queryFn: async () => {
      if (!productType) return [];
      return CategoryService.getCategories(productType, language);
    },
    staleTime: Infinity,
    enabled: productType != null,
  });
};
