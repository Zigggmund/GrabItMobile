import { LanguageType, LType } from '@/types/LanguageType';

import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import { useMe } from '@/hooks/user/useMe';
import { useProfile } from '@/hooks/user/useProfile';

import { translations } from '@/constants/translations';

import { UserService } from '@/services/api/services/userService';
import { storage } from '@/services/storage/asyncStorageService';

import { defaultLang, LanguageContext } from './LanguageContext';

const LANGUAGE_KEY = 'language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageType>(defaultLang);
  const [languageError, setLanguageError] = useState('');
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  const { isAuth } = useProfile();
  const { data: me, isLoading: isAPILoading } = useMe();

  useEffect(() => {
    const loadCachedLanguage = async () => {
      try {
        const cached = await storage.get(LANGUAGE_KEY);
        if (cached && typeof cached === 'string' && cached in translations) {
          setLanguageState(cached as LanguageType);
        } else {
          setLanguageState(defaultLang);
        }
      } catch (e) {
        console.error('Ошибка при загрузке языка:', e);
        setLanguageState(defaultLang);
      } finally {
        setIsStorageLoading(false);
      }
    };

    loadCachedLanguage();
  }, []);

  useEffect(() => {
    if (!isAuth) return;
    if (!me?.language) return;

    if (me.language !== language) {
      setLanguageState(me.language as LanguageType);

      storage.set(LANGUAGE_KEY, me.language);
    }
  }, [isAuth, me?.language]);

  const setLanguage = async (lang: LanguageType) => {
    if (!(lang in translations)) setLanguageError(l.errorLanguage);

    try {
      setLanguageState(lang);
      await storage.set(LANGUAGE_KEY, lang);
      try {
        await UserService.changeLanguage(lang);
      } catch (e) {
        console.error(e);
        setLanguageError(l.errorAPI);
      }

      console.log('Язык изменен на:', lang);
    } catch (e) {
      console.error(e);
      setLanguageError(l.errorStorage);
    }
    setLanguageError('');
  };

  // Оптимизация производительности. пересчет l когда меняется language
  const l: LType = useMemo(
    () => translations[language] || translations[defaultLang],
    [language],
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageError,
        setLanguage,
        l,
        isLoading: isAPILoading && isStorageLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
