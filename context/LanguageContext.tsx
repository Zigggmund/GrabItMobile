import { LanguageType, LType } from '@/types/LanguageType';

import { createContext } from 'react';

import { translations } from '@/constants/translations';

export const defaultLang = 'ru' as const;

interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => Promise<void>;
  l: LType;
  isLoading: boolean;
  languageError: string;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: defaultLang,
  setLanguage: async () => {},
  l: translations[defaultLang],
  isLoading: true,
  languageError: '',
});
