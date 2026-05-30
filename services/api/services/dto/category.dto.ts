export interface CategoryResponseDto {
  id: number;
  name: string;
  slug: string;
  parent_id?: number; // отсутствует у корневых категорий
  // product_type: number;
  sort_order: number;
}
