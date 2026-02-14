import { UserCardType } from '@/types/UserType';

export interface ReviewType {
  id: number;
  adName: string;
  text: string;
  author: UserCardType;
  createdAt: string;
  rating: number;
}

// изменить adName на ссылку на объявление/пользователя, которому адресован отзыв
// или сделать это 2 полями (adId - renterId)