import { MediaType } from '@/types/MediaType';

export interface UserType {
  id: number;
  email: string;
  login: string;
  isVerified?: boolean;
  language: string;
  avatar?: MediaType;
  phoneNumber: string;
  name: string;
  description: string;
  stats: {
    reviews: number;
    rating: number;
    offers: number;
  };
}
