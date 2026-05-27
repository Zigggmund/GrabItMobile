import { LanguageType } from '@/types/LanguageType';

export interface UserResponseDto {
  avatar_url: string | null;
  avg_rating_as_owner: number | null;
  avg_rating_as_renter: number | null;
  birth_date: string;
  created_at: string;
  email: string;
  first_name: string;
  gender: 'male' | 'female' | 'other' | null;
  language: LanguageType;
  id: string;
  last_name: string;
  phone: string | null;
  profile_complete: boolean;
  review_count_as_owner: number;
  review_count_as_renter: number;
  username: string;
}

export interface UserChangingDto {
  birth_date: string | null;
  first_name: string;
  gender: 'male' | 'female' | 'other' | null;
  last_name: string;
  phone: string | null;
}