import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import { translations } from '@/constants/translations';

import { storage } from '@/services/storage/asyncStorageService';

import { defaultLang, Language, LanguageContext } from './LanguageContext';

// РАБОТА С БД
// import { useProfile } from '@/context/ProfileContext';

const LANGUAGE_KEY = 'language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // РАБОТА С БД
  // updateUserLanguage для сохранения на сервере
  // const { user, updateUserLanguage } = useProfile() ?? {};
  const [language, setLanguageState] = useState<Language>(defaultLang);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => {
      const loadLanguage = async () => {
        try {
          // РАБОТА С БД
          // const savedLocal = await storage.get(LANGUAGE_KEY);
          // const profileLang = user?.language;
          // if (profileLang && profileLang in translations) {
          //   setLanguageState(profileLang as Language);
          //   await storage.set(LANGUAGE_KEY, profileLang);
          // } else if (savedLocal && savedLocal in translations) {
          //   setLanguageState(savedLocal as Language);
          // } else {
          //   setLanguageState(defaultLang);
          // }
        } catch (e) {
          console.error('Ошибка при загрузке языка:', e);
          setLanguageState(defaultLang);
        } finally {
          setIsLoading(false);
        }
      };

      loadLanguage();
    },
    // РАБОТА С БД
    // [user?.language]
    [],
  );

  const setLanguage = async (lang: Language) => {
    if (!(lang in translations)) return;

    try {
      setLanguageState(lang);
      await storage.set(LANGUAGE_KEY, lang);

      // РАБОТА С БД
      // Если пользователь вошёл — отправляем обновление на сервер
      // if (user && updateUserLanguage) {
      //   await updateUserLanguage(lang);
      // }
    } catch (e) {
      console.error('Ошибка при установке языка:', e);
    }
  };

  // Оптимизация производительности. Без useMemo, при каждом любом рендере пересоздает l
  // useMemo - пересчет объекта l лишь тогда, когда меняется language
  const l = useMemo(
    () => translations[language] || translations[defaultLang],
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, l, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};
