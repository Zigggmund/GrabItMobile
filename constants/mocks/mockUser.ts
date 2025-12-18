import { UserType } from '@/types/UserType';

export const mockCurrentUser: UserType = {
  id: 1,
  email: 'test@mail.com',
  login: 'test_user',
  isVerified: true,
  language: 'ru',
  avatar: { id: 1, url: 'https://picsum.photos/200' },
  userPhoneNumber: '89999999999',
};

export const mockUsers: UserType[] = [
  {
    id: 3,
    email: 'elMusk@mail.com',
    login: 'Elon Musk',
    isVerified: true,
    language: 'en',
    avatar: {
      id: 3,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1-MXUc6ZkxBNNdj3-YW8SSJX-WGgjUXsxWg&s',
    },
    userPhoneNumber: '80003330033',
  },
  {
    id: 3,
    email: 'thomas@mail.com',
    login: 'Thomas Selby',
    isVerified: true,
    language: 'en',
    avatar: {
      id: 3,
      url: 'https://i.pinimg.com/736x/ef/72/12/ef72124884b8b7844de311e24d8bbec0.jpg',
    },
    userPhoneNumber: '81111111111',
  },
  {
    id: 4,
    email: 'patrick@mail.com',
    login: 'Patrick Bateman',
    isVerified: true,
    language: 'en',
    avatar: {
      id: 4,
      url: 'https://opis-cdn.tinkoffjournal.ru/mercury/christian-bale-50-04.a3lndzrhegtq..jpg',
    },
    userPhoneNumber: '88005553535',
  },
];
