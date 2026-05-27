import { LanguageType } from '@/types/LanguageType';

export type LoginFinishDto = {
  username: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other' | null;
  phone: string | null;
  birth_date: string;
  // language: LanguageType;
};