import { createContext } from 'react';

import { translations } from '@/constants/translations';

export const defaultLang = 'ru' as const;
export type LanguageType = keyof typeof translations;

interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => Promise<void>;
  l: Record<string, string>;
  isLoading: boolean;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: defaultLang,
  setLanguage: async () => {},
  l: translations[defaultLang],
  isLoading: true,
});
