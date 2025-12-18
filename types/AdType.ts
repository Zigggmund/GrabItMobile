import { CategoryType } from '@/types/CategoryType';
import { CostType } from '@/types/CostType';
import { MediaType } from '@/types/MediaType';
import { RenterCardType } from '@/types/RenterCardType';
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
  renter: RenterCardType;
  title: string;
  endTime: string;
  previewImage: MediaType;
  createdDate: string; // no
}

export interface AdDetailsType extends AdPreviewType {
  media: MediaType[];
  renter: RenterCardType;
  bookingCalendar: string; // В ДАЛЬНЕЙШЕМ ИЗМЕНИТСЯ
  reviews: ReviewType[];
}
