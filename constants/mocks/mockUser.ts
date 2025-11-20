import { UserType } from '@/types/userType';

export const mockUser: UserType = {
  id: 1,
  email: 'test@mail.com',
  login: 'test_user',
  isVerified: true,
  language: 'ru',
  userLogo: { id: 1, url: 'https://picsum.photos/200' },
};
