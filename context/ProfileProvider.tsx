import { UserType } from '@/types/UserType';

import { FC, ReactNode, useEffect, useState } from 'react';

import { ProfileContext } from './ProfileContext';
import { storage } from '@/services/storage/asyncStorageService';

interface ProfileContextProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuth = !!user;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ЧТО-ТО ТАКОЕ
        // const accessToken = storage.get('accessToken');
        //
        // if (!accessToken) {
        //   setUser(null);
        // } else {
        //   const response = await api.get('/me', {
        //     headers: { Authorization: `Bearer ${token}` },
        //   });
        //   setUser(response.data);
        // }
      } catch (err) {
        console.log('Not authorized or error fetching user', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('User was changed:', user);
  }, [user]);

  return (
    <ProfileContext.Provider value={{ user, setUser, isLoading, isAuth }}>
      {children}
    </ProfileContext.Provider>
  );
};
