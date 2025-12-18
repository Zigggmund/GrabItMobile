import { UserType } from '@/types/UserType';

import { createContext } from 'react';

interface ProfileContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  logout: () => void;
  isLoading: boolean;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);
