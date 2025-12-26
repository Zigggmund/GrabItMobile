import { AdRentedType } from '@/types/AdType';

import { mockUsers } from '@/constants/mocks/mockUsers';

// только для моков
const now = Date.now();
const hour = 60 * 60 * 1000;

export const mockRentedAds: AdRentedType[] = [
  {
    id: 1,
    title: 'Дачный коттедж',
    renter: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatar: mockUsers[1].avatar,
      rating: mockUsers[1].stats.rating,
      reviewCount: mockUsers[1].stats.reviews,
      phoneNumber: mockUsers[1].phoneNumber,
    },
    endTime: new Date(now + hour).toISOString(),
    previewImage: {
      id: 1,
      url: 'https://deloteh.ru/wp-content/uploads/2024/04/01-1-scaled-2-1024x635.jpg',
    },
    createdDate: new Date(now - 2 * hour).toISOString(),
  },
  {
    id: 2,
    title: 'Электродрель',
    renter: {
      id: mockUsers[3].id,
      name: mockUsers[3].name,
      avatar: mockUsers[3].avatar,
      rating: mockUsers[3].stats.rating,
      reviewCount: mockUsers[3].stats.reviews,
      phoneNumber: mockUsers[3].phoneNumber,
    },
    endTime: new Date(now - hour).toISOString(),
    previewImage: {
      id: 2,
      url: 'https://ir.ozone.ru/s3/multimedia-i/c1000/6818037174.jpg',
    },
    createdDate: new Date(now - 89 * hour).toISOString(),
  },
  {
    id: 3,
    title: 'Художественная мастерская',
    renter: {
      id: mockUsers[3].id,
      name: mockUsers[3].name,
      avatar: mockUsers[3].avatar,
      rating: mockUsers[3].stats.rating,
      reviewCount: mockUsers[3].stats.reviews,
      phoneNumber: mockUsers[3].phoneNumber,
    },
    endTime: new Date(now + hour * 1.5).toISOString(),
    previewImage: {
      id: 3,
      url: 'https://m-c-m-c.ru/sites/default/files/styles/1024x768/public/%D0%B2%D0%B4%D0%BE%D1%85%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%B8%D0%B5.jpeg?itok=iwCcMlO4',
    },
    createdDate: new Date(now - 5 * hour).toISOString(),
  },
  {
    id: 4,
    title: 'Ремонт холодильников',
    renter: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatar: mockUsers[1].avatar,
      rating: mockUsers[1].stats.rating,
      reviewCount: mockUsers[1].stats.reviews,
      phoneNumber: mockUsers[1].phoneNumber,
    },
    endTime: new Date(now + hour * 0.1).toISOString(),
    previewImage: {
      id: 4,
      url: 'https://umex-service.ru/images/2024/12/01/refrigerator-repair.webp',
    },
    createdDate: new Date(now - 12 * hour).toISOString(),
  },
  {
    id: 5,
    title: 'Ветеринар',
    renter: {
      id: mockUsers[2].id,
      name: mockUsers[2].name,
      avatar: mockUsers[2].avatar,
      rating: mockUsers[2].stats.rating,
      reviewCount: mockUsers[2].stats.reviews,
      phoneNumber: mockUsers[2].phoneNumber,
    },
    endTime: new Date(now).toISOString(),
    previewImage: {
      id: 5,
      url: 'https://dpogti.ru/wp-content/uploads/2023/10/veterinarian-taking-care-of-pet-dog.jpg',
    },
    createdDate: new Date(now - 20 * hour).toISOString(),
  },
];
