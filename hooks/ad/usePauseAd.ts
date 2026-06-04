import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

export const usePauseAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => AdService.pauseListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAds'] });
    },
  });
};