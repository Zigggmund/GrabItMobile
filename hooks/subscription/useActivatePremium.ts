import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SubscriptionService } from '@/services/api/services/subscriptionService';
import { SubscriptionPlan } from '@/services/api/services/dto/subscription.dto';

export const useActivatePremium = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: SubscriptionPlan) =>
      SubscriptionService.activatePremium({ plan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
