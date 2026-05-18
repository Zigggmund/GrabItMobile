import { UserType } from '@/types/UserType';

import { FC, ReactNode, useEffect } from 'react';

import { useMe } from '@/hooks/user/useMe';

import { ProfileContext } from './ProfileContext';

interface ProfileContextProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileContextProviderProps> = ({
  children,
}) => {
  const { data: user, isLoading: isLoading } = useMe();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const accessToken = await SecureStore.getItemAsync('accessToken');
  //       if (!accessToken) {
  //         setUser(null);
  //       } else {
  //         const response = await UserService.infoUser();
  //         setUser(response.data);
  //       }
  //     } catch (err) {
  //       console.log('Not authorized or error fetching user', err);
  //       setUser(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchUser();
  // }, []);
  //
  // useEffect(() => {
  //   console.log('User was changed:', user);
  // }, [user]);

  return (
    <ProfileContext.Provider
      value={{ user: user ? user.data : null, isLoading, isAuth: !!user }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
