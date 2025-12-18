import { UserType } from '@/types/UserType';

import { FC, ReactNode, useEffect, useState } from 'react';

import { ProfileContext } from './ProfileContext';
import { mockCurrentUser } from '@/constants/mocks/mockUser';

interface ProfileContextProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const res = await UserService.getUser();
        // setUser(res.data);

        // Временно — тестовый юзер
        setUser(mockCurrentUser);
      } catch (err) {
        console.log('Not authorized or error fetching user', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    // await SecureStore.deleteItemAsync('accessToken');
    // await SecureStore.deleteItemAsync('refreshToken');
    // router.replace('/login');

    setUser(null);
  };

  return (
    <ProfileContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};
