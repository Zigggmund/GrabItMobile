import { AdCategoryEnum, AdRentedType, AdPreview } from '@/types/AdType';
import { mockUsers } from '@/constants/mocks/mockUser';

export const mockAds: AdPreview[] = [
  {
    title: 'Дачный коттедж',
    description:
      'Уютный дом для отдыха на природе. Подходит для семейных поездок и вечеров с друзьями. Терраса, баня, мангал и просторный участок. По дополнительным вопросам звонить по номеру. Возможен торг.',
    reviewCount: 13,
    payment: 2000,
    rating: 4.1,
    location: 'Р-н Октябрьский',
    category: AdCategoryEnum.Space,
    previewImage: {
      id: 1,
      url: 'https://deloteh.ru/wp-content/uploads/2024/04/01-1-scaled-2-1024x635.jpg',
    },
  },
  {
    title: 'Электродрель',
    description:
      'Мощная дрель для бытового использования. Подходит для ремонта дома и работы с деревом и металлом.',
    reviewCount: 4,
    payment: 200,
    rating: 2.2,
    location: 'Р-н Советский',
    category: AdCategoryEnum.Product,
    previewImage: {
      id: 2,
      url: 'https://ir.ozone.ru/s3/multimedia-i/c1000/6818037174.jpg',
    },
  },
  {
    title: 'Художественная мастерская',
    description: 'Творческое пространство для проведения мастер-классов',
    reviewCount: 81,
    payment: 800,
    rating: 4.3,
    location: 'Р-н Октябрьский',
    category: AdCategoryEnum.Space,
    previewImage: {
      id: 3,
      url: 'https://m-c-m-c.ru/sites/default/files/styles/1024x768/public/%D0%B2%D0%B4%D0%BE%D1%85%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%B8%D0%B5.jpeg?itok=iwCcMlO4',
    },
  },
  {
    title: 'Ремонт холодильников',
    payment: 600,
    rating: 4.4,
    description:
      'Оперативный ремонт холодильников на дому. Гарантия, оригинальные запчасти, диагностика в подарок.',
    reviewCount: 1,
    location: 'Р-н Ленинский',
    category: AdCategoryEnum.Service,
    previewImage: {
      id: 4,
      url: 'https://umex-service.ru/images/2024/12/01/refrigerator-repair.webp',
    },
  },
  {
    title: 'Ветеринар',
    payment: 900,
    rating: null,
    description:
      'Профессиональный ветеринар с выездом на дом. Помощь при травмах, вакцинация, чипирование и консультации.',
    reviewCount: 0,
    location: 'Р-н Октябрьский',
    category: AdCategoryEnum.Service,
    previewImage: {
      id: 5,
      url: 'https://dpogti.ru/wp-content/uploads/2023/10/veterinarian-taking-care-of-pet-dog.jpg',
    },
  },
  {
    title: 'VR-очки',
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    reviewCount: 101,
    payment: 300,
    rating: 3.5,
    location: 'г. Дивногорск',
    category: AdCategoryEnum.Product,
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
  },
  {
    title: 'VR-очки',
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    reviewCount: 101,
    payment: 300,
    rating: 3.6,
    location: 'г. Дивногорск',
    category: AdCategoryEnum.Product,
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
  },
  {
    title: 'VR-очки',
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    reviewCount: 101,
    payment: 300,
    rating: 3.7,
    location: 'г. Дивногорск',
    category: AdCategoryEnum.Product,
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
  },
  {
    title: 'VR-очки',
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    reviewCount: 101,
    payment: 300,
    rating: 3.8,
    location: 'г. Дивногорск',
    category: AdCategoryEnum.Product,
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
  },
  {
    title: 'VR-очки',
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    reviewCount: 101,
    payment: 300,
    rating: 3.9,
    location: 'г. Дивногорск',
    category: AdCategoryEnum.Product,
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
  },
  {
    title: 'VR-очки',
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    reviewCount: 101,
    payment: 300,
    rating: 4,
    location: 'г. Дивногорск',
    category: AdCategoryEnum.Product,
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
  },
];