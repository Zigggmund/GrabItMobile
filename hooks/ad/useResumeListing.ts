import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

export const useResumeListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => AdService.resumeListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAds'] });
    },
  });
};