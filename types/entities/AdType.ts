import { CostType } from '@/types/CostType';
import { MediaType } from '@/types/MediaType';
import { ReviewType } from '@/types/entities/ReviewType';
import { UserCardType } from '@/types/entities/UserType';

export type ProductType = 'product' | 'space' | 'service';

export interface AdPreviewType {
  id: string;
  title: string;
  cost: CostType[];
  rating: number | null;
  description: string;
  reviewCount: number;
  address: string;
  productType: ProductType;
  categoryId: string;
  previewImage: MediaType;
  createdDate: string; // no
}

export interface AdRentedType {
  id: string;
  chatId: number; // из bookingType
  landlord: UserCardType;
  title: string;
  endTime: string; // из bookingType
  previewImage: MediaType;
  // createdDate: string; // no
}

export interface AdDetailsType extends AdPreviewType {
  media: MediaType[] | null;
  specifications: string[] | null;
  landlord: UserCardType;
  bookingCalendar: string; // В ДАЛЬНЕЙШЕМ ИЗМЕНИТСЯ
  reviews: ReviewType[];
  myBooking?: {
    // id: number;
    endTime: string;
  } | null;
}
