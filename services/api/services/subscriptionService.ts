import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import {
  ActivateSubscriptionDto,
  SubscriptionResponseDto,
} from '@/services/api/services/dto/subscription.dto';

export class SubscriptionService {
  static async activatePremium(dto: ActivateSubscriptionDto): Promise<SubscriptionResponseDto> {
    return unwrap(
      await api.post<ApiResponse<SubscriptionResponseDto>>('/subscriptions', dto),
    );
  }
}
