import { LanguageType } from '@/types/LanguageType';

import { useMutation } from '@tanstack/react-query';

import { UserService } from '@/services/api/services/userService';

export const useChangeLanguage = () => {
  return useMutation({
    mutationFn: async (language: LanguageType) => {
      return await UserService.changeLanguage(language);
    },
  });
};
