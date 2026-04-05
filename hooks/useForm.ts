import { useContext } from 'react';

import { FormContext } from '@/context/FormContext';

export const useForm = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useForm must be used inside FormProvider');
  return ctx;
}