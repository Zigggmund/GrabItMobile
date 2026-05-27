import { UserType } from '@/types/entities/UserType';

import { createContext } from 'react';

interface ProfileContextType {
  user: UserType | null;
  isAuth: boolean;
  isLoading: boolean;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);
