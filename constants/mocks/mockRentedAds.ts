import { AdRentedType } from '@/types/AdType';

import { mockUsers } from '@/constants/mocks/mockUser';

// только для моков
const now = Date.now();
const hour = 60 * 60 * 1000;

export const mockRentedAds: AdRentedType[] = [
  {
    title: 'Дачный коттедж',
    renter: mockUsers[0],
    endTime: new Date(now + hour).toISOString(),
    previewImage: {
      id: 1,
      url: 'https://deloteh.ru/wp-content/uploads/2024/04/01-1-scaled-2-1024x635.jpg',
    },
  },
  {
    title: 'Электродрель',
    renter: mockUsers[2],
    endTime: new Date(now - hour).toISOString(),
    previewImage: {
      id: 2,
      url: 'https://ir.ozone.ru/s3/multimedia-i/c1000/6818037174.jpg',
    },
  },
  {
    title: 'Художественная мастерская',
    renter: mockUsers[2],
    endTime: new Date(now + hour * 1.5).toISOString(),
    previewImage: {
      id: 3,
      url: 'https://m-c-m-c.ru/sites/default/files/styles/1024x768/public/%D0%B2%D0%B4%D0%BE%D1%85%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%B8%D0%B5.jpeg?itok=iwCcMlO4',
    },
  },
  {
    title: 'Ремонт холодильников',
    renter: mockUsers[0],
    endTime: new Date(now + hour * 0.1).toISOString(),
    previewImage: {
      id: 4,
      url: 'https://umex-service.ru/images/2024/12/01/refrigerator-repair.webp',
    },
  },
  {
    title: 'Ветеринар',
    renter: mockUsers[1],
    endTime: new Date(now).toISOString(),
    previewImage: {
      id: 5,
      url: 'https://dpogti.ru/wp-content/uploads/2023/10/veterinarian-taking-care-of-pet-dog.jpg',
    },
  },
];
