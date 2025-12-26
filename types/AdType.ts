import { CategoryType } from '@/types/CategoryType';
import { CostType } from '@/types/CostType';
import { MediaType } from '@/types/MediaType';
import { RenterType } from '@/types/UserType';
import { ReviewType } from '@/types/ReviewType';

type ProductType = 'product' | 'space' | 'service';

export interface AdPreviewType {
  id: number;
  title: string;
  cost: CostType[];
  rating: number | null;
  description: string;
  reviewCount: number;
  address: string;
  productType: ProductType;
  category: CategoryType;
  previewImage: MediaType;
  createdDate: string; // no
}

export interface AdRentedType {
  id: number;
  renter: RenterType;
  title: string;
  endTime: string;
  previewImage: MediaType;
  createdDate: string; // no
}

export interface AdDetailsType extends AdPreviewType {
  media: MediaType[];
  renter: RenterType;
  bookingCalendar: string; // В ДАЛЬНЕЙШЕМ ИЗМЕНИТСЯ
  reviews: ReviewType[];
}
