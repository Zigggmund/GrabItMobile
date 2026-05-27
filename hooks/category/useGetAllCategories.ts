import { CategoryType } from '@/types/entities/CategoryType';

import { useQuery } from '@tanstack/react-query';

import { CategoryService } from '@/services/api/services/categoryService';

export const useGetAllCategories = () => {
  return useQuery<CategoryType[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await CategoryService.getAllCategories();
      return res.data;
    },
    staleTime: Infinity,
  });
};
