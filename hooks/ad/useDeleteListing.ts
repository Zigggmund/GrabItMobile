import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => AdService.deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAds'] });
    },
  });
};