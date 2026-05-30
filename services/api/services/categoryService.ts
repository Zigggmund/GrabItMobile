import { ProductType } from '@/types/entities/AdType';
import { CategoryType } from '@/types/entities/CategoryType';

import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import { CategoryResponseDto } from '@/services/api/services/dto/category.dto';

// Получение категорий по productType
export class CategoryService {
  static async getCategories(
    productType: ProductType,
  ): Promise<CategoryType[]> {
    // const res = await api.get(`/${productType}/categories`);
    // ЗАГЛУШКА, пока нет категорий
    const res = await api.get('/rent/categories');

    const { categories } = unwrap<{ categories: CategoryResponseDto[] }>(res);

    return categories.map(dto => ({
      id: dto.id,
      name: dto.name,
      productType: productType,
      parentId: dto.parent_id ?? null,
      sortOrder: dto.sort_order,
    }));
  }
}
