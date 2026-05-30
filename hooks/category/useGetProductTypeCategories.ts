import { CategoryType } from '@/types/entities/CategoryType';

import { useQuery } from '@tanstack/react-query';

import { CategoryService } from '@/services/api/services/categoryService';
import { ProductType } from '@/types/entities/AdType';

export const useGetProductTypeCategories = (productType: ProductType) => {
  return useQuery<CategoryType[]>({
    // productType в ключе - разные типы кешируются отдельно
    queryKey: ['categories', productType],
    queryFn: async () => {
      if (!productType) return [];
      return CategoryService.getCategories(productType);
    },
    staleTime: Infinity,
    // \запрос только если slug известен
    enabled: productType != null,
  });
};
