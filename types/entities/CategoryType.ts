import { ProductType } from '@/types/entities/AdType';

export interface CategoryType {
  id: number;
  name: string;
  productType: ProductType;
  // null - корневая категория (нет родителя)
  parentId: number | null;
  sortOrder: number;
}
