import React, { ReactNode, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { Href, router, usePathname } from 'expo-router';

import { HistoryContext } from '@/context/HistoryContext';

const formPages: Href[] = [
  '/ads/createAd',
  '/login',
  '/registration',
  '/ads/booking',
];

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const defaultPage: Href = '/(tabs)/ads/search';
  const [historyStack, setHistoryStack] = useState<Href[]>([]);
  const pathname = usePathname();

  // системное перемещение == goBack
  useEffect(() => {
    console.log('STACK: stack was updated:', historyStack);
    const onBackPress = () => {
      if (historyStack.length > 0) {
        goBack();
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => {
      subscription.remove();
    };
  }, [historyStack]);

  // прослушивание через pathname и автоматическое обновление стека
  useEffect(() => {
    if (!pathname) return;

    setHistoryStack(prev => {
      if (prev[prev.length - 1] === pathname) {
        // if
        return prev;
      } else {
        const updated = [...prev, pathname as Href];
        return updated;
      }
    });
  }, [pathname]);

  // ВСПОМОГАТЕЛЬНЫЕ функции
  // НЕ НУЖНА, уже есть прослушивание через pathname. иначе не учитывает табы
  // добавить элемент
  // const push = (item: Href) => {
  //   setHistoryStack(prev => [...prev, item]);
  //   console.log('STACK: stack was updated:', historyStack);
  // };
  // удалить последний элемент и вернуть его
  // const pop = (): Href => {
  //   const newStack = [...historyStack];
  //   newStack.pop();
  //   setHistoryStack(newStack);
  //   // console.log('STACK: stack was updated:', historyStack);
  //   return newStack[newStack.length - 1];
  // };

  // ОСНОВНЫЕ функции
  // переход на страницу и пуш в стек
  const navigate = (item: Href) => {
    router.push(item);
  };
  // возврат на последнюю и откат стека
  const goBack = () => {
    const newStack = [...historyStack];
    if (newStack.length > 0) newStack.pop();
    // скип страниц-форм
    while (
      newStack.length != 0 &&
      formPages.some(formPage =>
        newStack[newStack.length - 1]
          .toString()
          .startsWith(formPage.toString()),
      )
    ) {
      newStack.pop();
    }

    const lastItem: Href =
      newStack.length == 0 ? defaultPage : newStack[newStack.length - 1];
    setHistoryStack(newStack);
    router.replace(lastItem);
  };

  const clear = () => {
    setHistoryStack([]);
    console.log('HistoryStack was cleared');
  };

  return (
    <HistoryContext.Provider value={{ historyStack, navigate, goBack, clear }}>
      {children}
    </HistoryContext.Provider>
  );
};
