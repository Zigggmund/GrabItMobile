import { ProductType } from '@/types/entities/AdType';
import { CategoryType } from '@/types/entities/CategoryType';

import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import { CategoryResponseDto } from '@/services/api/services/dto/category.dto';

// Получение категорий по productType
export class CategoryService {
  static async getCategories(
    productType: ProductType,
    lang: string = 'ru',
  ): Promise<CategoryType[]> {
    const res = await api.get('/rent/categories', { params: { lang } });

    const { categories } = unwrap<{ categories: CategoryResponseDto[] }>(res);

    return categories.map(dto => ({
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      productType: productType,
      parentId: dto.parent_id ?? null,
      sortOrder: dto.sort_order,
    }));
  }
}
