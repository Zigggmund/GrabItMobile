import { MediaType } from '@/types/MediaType';

export interface UserType {
  id: number;
  email: string;
  login: string;
  isVerified: boolean;
  language: string;
  userLogo: MediaType;
}
