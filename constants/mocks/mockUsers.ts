import { UserType } from '@/types/UserType';

// export const mockCurrentUser: UserType = {
//   id: 1,
//   email: 'test@mail.com',
//   login: 'test_user',
//   isVerified: true,
//   language: 'ru',
//   avatar: { id: 1, url: 'https://picsum.photos/200' },
//   phoneNumber: '89999999999',
//
// };

export const mockUsers: UserType[] = [
  {
    id: 1,
    email: 'test@example.com',
    login: 'testuser',
    isVerified: false,
    language: 'ru',
    avatar: {
      id: 1,
      url: 'https://reqres.in/img/faces/1-image.jpg',
    },
    phoneNumber: '89130000000',
    name: 'Тестовый Пользователь',
    description: 'Это тестовый пользователь для демонстрации',
    stats: {
      reviews: 15,
      rating: 4.8,
      offers: 7,
    },
  },
  {
    id: 2,
    email: 'elMusk@mail.com',
    login: 'elnMsk',
    isVerified: true,
    language: 'en',
    avatar: {
      id: 3,
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1-MXUc6ZkxBNNdj3-YW8SSJX-WGgjUXsxWg&s',
    },
    phoneNumber: '80003330033',
    name: 'Elon Musk',
    description: 'Make Twitter great again!!!!!',
    stats: {
      reviews: 165,
      rating: 3.9,
      offers: 8,
    },
  },
  {
    id: 3,
    email: 'thomas@mail.com',
    login: 'ThomasSelbyLogin',
    isVerified: true,
    language: 'en',
    avatar: {
      id: 3,
      url: 'https://i.pinimg.com/736x/ef/72/12/ef72124884b8b7844de311e24d8bbec0.jpg',
    },
    phoneNumber: '81111111111',
    name: 'Thomas Shelby',
    description:
      "Hello, I'm a fictional character and the main protagonist of the British period crime drama Peaky Blinders.",
    stats: {
      reviews: 9,
      rating: 4.4,
      offers: 1,
    },
  },
  {
    id: 4,
    email: 'patrick@mail.com',
    login: 'Psycho1234',
    isVerified: true,
    language: 'en',
    avatar: {
      id: 4,
      url: 'https://opis-cdn.tinkoffjournal.ru/mercury/christian-bale-50-04.a3lndzrhegtq..jpg',
    },
    phoneNumber: '88005553535',
    name: 'Patrick Bateman',
    description: 'Haters gonna hate',
    stats: {
      reviews: 0,
      rating: 0,
      offers: 0,
    },
  },
];
