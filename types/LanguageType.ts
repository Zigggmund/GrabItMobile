import { translations } from '@/constants/translations';

export type LanguageType = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['ru'];
// Гарантия одинаковых ключей для языков
export type LType = Record<TranslationKey, string>;
