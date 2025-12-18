import { UserCardType } from '@/types/UserCardType';

export interface ReviewType {
  id: number;
  text: string;
  user: UserCardType;
  createdAt: string;
  rating: number;
}