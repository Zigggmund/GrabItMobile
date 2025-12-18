import { UserCardType } from '@/types/UserCardType';

export interface RenterCardType extends UserCardType {
  rating: number;
  reviewCount: number;
  phoneNumber: string;
}
