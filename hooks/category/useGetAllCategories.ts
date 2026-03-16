import { CategoryType } from '@/types/CategoryType';

import { useQuery } from '@tanstack/react-query';

import { CategoryService } from '@/services/api/services/categoryService';

export const useGetAllCategories = () => {
  return useQuery<CategoryType[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await CategoryService.getAllCategories();
      return data;
    },
    staleTime: Infinity,
  });
};
