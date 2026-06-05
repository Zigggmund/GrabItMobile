import { ProductType } from '@/types/entities/AdType';

export interface CategoryType {
  id: number;
  name: string;
  slug: string;
  productType: ProductType;
  parentId: number | null;
  sortOrder: number;
}
