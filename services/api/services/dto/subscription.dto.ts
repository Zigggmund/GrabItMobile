export type SubscriptionPlan = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ActivateSubscriptionDto {
  plan: SubscriptionPlan;
}

export interface SubscriptionResponseDto {
  subscription_tier: string;
  subscription_expires_at: string | null;
}
