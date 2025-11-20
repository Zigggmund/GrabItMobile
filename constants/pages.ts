// чтобы избежать typeScrypt ошибок
import { icons } from '@/constants/icons';

// допустимые ключи перевода для страниц
export const pageKeys = ['search', 'myAds', 'rent', 'chats'] as const;
export type PageKey = (typeof pageKeys)[number];
// допустимые ключи иконок
export type IconKey = keyof typeof icons;

export type Page = {
  title: PageKey;
  link: string;
  icon: IconKey;
};

export const pages: Page[] = [
  {
    title: 'search',
    link: 'ads/search',
    icon: 'search',
  },
  {
    title: 'myAds',
    link: 'ads/myAds',
    icon: 'myAds',
  },
  {
    title: 'rent',
    link: 'ads/rent',
    icon: 'rent',
  },
  {
    title: 'chats',
    link: 'chats/myChats',
    icon: 'chat',
  },
];
