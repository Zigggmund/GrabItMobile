import { FC, ReactNode } from 'react';

import { useMe } from '@/hooks/user/useMe';

import { ProfileContext } from './ProfileContext';

interface ProfileContextProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileContextProviderProps> = ({
  children,
}) => {
  const { data: user, isLoading, isFetching } = useMe();
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
    // user ?? null против undefined
    <ProfileContext.Provider
      value={{ user: user ?? null, isLoading, isFetching, isAuth: !!user }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
