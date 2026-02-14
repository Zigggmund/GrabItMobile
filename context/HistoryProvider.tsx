import React, { ReactNode, useEffect, useState } from 'react';
import { Href, router, usePathname } from 'expo-router';

import { HistoryContext } from '@/context/HistoryContext';

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const defaultPage: Href = '/(tabs)/ads/search';
  const [historyStack, setHistoryStack] = useState<Href[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    setHistoryStack(prev => {
      if (prev[prev.length - 1] === pathname) {
        return prev;
      }

      const updated = [...prev, pathname as Href];
      console.log('STACK (auto):', updated);
      return updated;
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
  const pop = (): Href => {
    const newStack = [...historyStack];
    newStack.pop();
    setHistoryStack(newStack);
    // console.log('STACK: stack was updated:', historyStack);
    return newStack[newStack.length - 1];
  };

  // ОСНОВНЫЕ функции
  // переход на страницу и пуш в стек
  const navigate = (item: Href) => {
    // push(item);
    router.push(item);
  };
  // возврат на последнюю и откат стека
  const goBack = () => {
    const lastItem = historyStack.length == 0 ? defaultPage : pop();
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
