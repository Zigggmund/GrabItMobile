import { MediaType } from '@/types/MediaType';
import { ReviewType } from '@/types/entities/ReviewType';
import { UserCardType } from '@/types/entities/UserType';

export type ProductType = 'product' | 'space' | 'service';
export interface SpecificationType {
  key: string;
  value: string;
}

export interface AdPreviewType {
  id: string;
  title: string;
  rub_per_hour: number;
  rating: number | null;
  description: string;
  reviewCount: number;
  address: string;
  // productType: ProductType;
  categoryId: string;
  previewImage: MediaType;
  // createdDate: string; // no
}

export interface AdRentedType {
  id: string;
  chatId: string; // из bookingType
  landlord: UserCardType;
  title: string;
  endTime: string; // из bookingType
  previewImage: MediaType;
  // createdDate: string; // no
}

export interface AdDetailsType extends AdPreviewType {
  lat: number | null;
  lon: number | null;
  media: MediaType[] | null;
  createdDate: string;
  specifications: SpecificationType[];
  landlord: UserCardType;
  bookingCalendar: string; // В ДАЛЬНЕЙШЕМ ИЗМЕНИТСЯ
  reviews: ReviewType[];
  myBooking?: {
    // id: number;
    endTime: string;
  } | null;
}
