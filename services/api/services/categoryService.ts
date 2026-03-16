import { CategoryType } from '@/types/CategoryType';

import { AxiosResponse } from 'axios';

import { api } from '@/services/api/instance';

export class CategoryService {
  // получение всех категорий
  static async getAllCategories(): Promise<AxiosResponse<CategoryType[]>> {
    return api.get('/category');
  }
}
