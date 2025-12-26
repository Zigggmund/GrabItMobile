import { UserType } from '@/types/UserType';

import { FC, ReactNode, useEffect, useState } from 'react';

import { ProfileContext } from './ProfileContext';

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
        // setUser()
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
