import { createContext } from 'react';

import { translations } from '@/constants/translations';

export const defaultLang = 'ru' as const;
export type LanguageType = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['ru'];
// Гарантия одинаковых ключей для языков
export type LType = Record<TranslationKey, string>;


interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => Promise<void>;
  l: LType;
  isLoading: boolean;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: defaultLang,
  setLanguage: async () => {},
  l: translations[defaultLang],
  isLoading: true,
});
