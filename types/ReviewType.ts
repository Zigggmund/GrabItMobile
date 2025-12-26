import { UserCardType } from '@/types/UserType';

export interface ReviewType {
  id: number;
  adName: string;
  text: string;
  user: UserCardType;
  createdAt: string;
  rating: number;
}