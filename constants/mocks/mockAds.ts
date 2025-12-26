import { AdPreviewType } from '@/types/AdType';

// только для моков
const now = Date.now();
const hour = 60 * 60 * 1000;

export const mockAds: AdPreviewType[] = [
  {
    id: 1,
    title: 'Дачный коттедж',
    cost: [
      { payment: 8000, priceUnit: 'rubPerDay' },
      { payment: 20000, priceUnit: 'rubPerWeek' },
      { payment: 68000, priceUnit: 'rubPerMonth' },
    ],
    rating: 4.1,
    description:
      'Уютный дом для отдыха на природе. Подходит для семейных поездок и вечеров с друзьями. Терраса, баня, мангал и просторный участок. По дополнительным вопросам звонить по номеру. Возможен торг.',
    address: 'Р-н Октябрьский',
    reviewCount: 13,
    productType: 'space',
    category: { id: 1, name: 'housing' },
    previewImage: {
      id: 1,
      url: 'https://deloteh.ru/wp-content/uploads/2024/04/01-1-scaled-2-1024x635.jpg',
    },
    createdDate: new Date(now - 2 * hour).toISOString(),
  },
  {
    id: 2,
    title: 'Электродрель',
    cost: [
      { payment: 200, priceUnit: 'rubPerHour' },
      { payment: 800, priceUnit: 'rubPerDay' },
      { payment: 2000, priceUnit: 'rubPerWeek' },
    ],
    rating: 2.2,
    description:
      'Мощная дрель для бытового использования. Подходит для ремонта дома и работы с деревом и металлом.',
    address: 'Р-н Октябрьский',
    reviewCount: 4,
    productType: 'product',
    category: { id: 2, name: 'tools' },
    previewImage: {
      id: 1,
      url: 'https://ir.ozone.ru/s3/multimedia-i/c1000/6818037174.jpg',
    },
    createdDate: new Date(now - 89 * hour).toISOString(),
  },
  {
    id: 3,
    title: 'Художественная мастерская',
    cost: [
      { payment: 5000, priceUnit: 'rubPerDay' },
      { payment: 112000, priceUnit: 'rubPerMonth' },
    ],
    rating: 4.3,
    description: 'Творческое пространство для проведения мастер-классов',
    address: 'Р-н Октябрьский',
    reviewCount: 81,
    productType: 'space',
    category: { id: 3, name: 'public' },
    previewImage: {
      id: 3,
      url: 'https://m-c-m-c.ru/sites/default/files/styles/1024x768/public/%D0%B2%D0%B4%D0%BE%D1%85%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%B8%D0%B5.jpeg?itok=iwCcMlO4',
    },
    createdDate: new Date(now - 5 * hour).toISOString(),
  },
  {
    id: 4,
    title: 'Ремонт холодильников',
    cost: [{ payment: 600, priceUnit: 'rubPerDay' }],
    rating: 4.4,
    description:
      'Оперативный ремонт холодильников на дому. Гарантия, оригинальные запчасти, диагностика в подарок.',
    address: 'Р-н Ленинский',
    reviewCount: 1,
    productType: 'service',
    category: { id: 4, name: 'private' },
    previewImage: {
      id: 4,
      url: 'https://umex-service.ru/images/2024/12/01/refrigerator-repair.webp',
    },
    createdDate: new Date(now - 12 * hour).toISOString(),
  },
  {
    id: 5,
    title: 'Ветеринар',
    cost: [{ payment: 900, priceUnit: 'rubPerDay' }],
    rating: null,
    description:
      'Профессиональный ветеринар с выездом на дом. Помощь при травмах, вакцинация, чипирование и консультации.',
    address: 'Р-н Октябрьский',
    reviewCount: 0,
    productType: 'service',
    category: { id: 5, name: 'private' },
    previewImage: {
      id: 5,
      url: 'https://dpogti.ru/wp-content/uploads/2023/10/veterinarian-taking-care-of-pet-dog.jpg',
    },
    createdDate: new Date(now - 20 * hour).toISOString(),
  },
  {
    id: 6,
    title: 'VR-очки',
    cost: [
      { payment: 300, priceUnit: 'rubPerHour' },
      { payment: 1000, priceUnit: 'rubPerDay' },
    ],
    rating: 3.5,
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    address: 'г. Дивногорск',
    reviewCount: 101,
    productType: 'product',
    category: { id: 5, name: 'private' },
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
    createdDate: new Date(now - 13 * hour).toISOString(),
  },
  {
    id: 7,
    title: 'VR-очки',
    cost: [
      { payment: 300, priceUnit: 'rubPerHour' },
      { payment: 1000, priceUnit: 'rubPerDay' },
    ],
    rating: 3.6,
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    address: 'г. Дивногорск',
    reviewCount: 101,
    productType: 'product',
    category: { id: 5, name: 'private' },
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
    createdDate: new Date(now - 13 * hour).toISOString(),
  },
  {
    id: 8,
    title: 'VR-очки',
    cost: [
      { payment: 300, priceUnit: 'rubPerHour' },
      { payment: 1000, priceUnit: 'rubPerDay' },
    ],
    rating: 3.7,
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    address: 'г. Дивногорск',
    reviewCount: 101,
    productType: 'product',
    category: { id: 5, name: 'private' },
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
    createdDate: new Date(now - 13 * hour).toISOString(),
  },
  {
    id: 9,
    title: 'VR-очки',
    cost: [
      { payment: 300, priceUnit: 'rubPerHour' },
      { payment: 1000, priceUnit: 'rubPerDay' },
    ],
    rating: 3.8,
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    address: 'г. Дивногорск',
    reviewCount: 101,
    productType: 'product',
    category: { id: 5, name: 'private' },
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
    createdDate: new Date(now - 13 * hour).toISOString(),
  },
  {
    id: 10,
    title: 'VR-очки',
    cost: [
      { payment: 300, priceUnit: 'rubPerHour' },
      { payment: 1000, priceUnit: 'rubPerDay' },
    ],
    rating: 3.9,
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    address: 'г. Дивногорск',
    reviewCount: 101,
    productType: 'product',
    category: { id: 5, name: 'private' },
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
    createdDate: new Date(now - 13 * hour).toISOString(),
  },
  {
    id: 11,
    title: 'VR-очки',
    cost: [
      { payment: 300, priceUnit: 'rubPerHour' },
      { payment: 1000, priceUnit: 'rubPerDay' },
    ],
    rating: 4,
    description:
      'Очки виртуальной реальности нового поколения. Отлично подходят для игр, обучения и путешествий в 3D.',
    address: 'г. Дивногорск',
    reviewCount: 101,
    productType: 'product',
    category: { id: 5, name: 'private' },
    previewImage: {
      id: 6,
      url: 'https://s.digitalocean.ru/627/upload/1653313985_jessicalewisDeyfdybVQhAunsplash.jpg',
    },
    createdDate: new Date(now - 13 * hour).toISOString(),
  },
];
