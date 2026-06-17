import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useActivatePremium } from '@/hooks/subscription/useActivatePremium';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { SubscriptionPlan } from '@/services/api/services/dto/subscription.dto';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentTier?: string;
  expiresAt?: string;
}

interface PlanOption {
  plan: SubscriptionPlan;
  labelKey: 'planWeekly' | 'planMonthly' | 'planQuarterly' | 'planYearly';
}

const PLANS: PlanOption[] = [
  { plan: 'weekly', labelKey: 'planWeekly' },
  { plan: 'monthly', labelKey: 'planMonthly' },
  { plan: 'quarterly', labelKey: 'planQuarterly' },
  { plan: 'yearly', labelKey: 'planYearly' },
];

export default function SubscriptionModal({ visible, onClose, currentTier, expiresAt }: Props) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const activate = useActivatePremium();

  const [selected, setSelected] = useState<SubscriptionPlan>('monthly');

  const isPremium = !!currentTier && currentTier !== 'free';

  const handleActivate = () => {
    activate.mutate(selected, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View
          style={{
            backgroundColor: colors.theme.white.primary,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            gap: 16,
          }}
        >
          <CustomText
            highlight
            className="text-24 font-bold text-center"
            style={{ color: colors.theme.blue.dark }}
          >
            {l.subscriptionTitle}
          </CustomText>

          {isPremium && expiresAt && (
            <View
              className="rounded-xl px-4 py-3 items-center"
              style={{ backgroundColor: colors.theme.yellow.soft }}
            >
              <CustomText className="text-14" style={{ color: colors.theme.blue.bright }}>
                {l.premiumActive}
              </CustomText>
              <CustomText className="text-16 font-bold" style={{ color: colors.base.yellow.darkSoft }}>
                {new Date(expiresAt).toLocaleDateString()}
              </CustomText>
            </View>
          )}

          <View className="flex-row gap-3 flex-wrap justify-center">
            {PLANS.map(({ plan, labelKey }) => {
              const isActive = selected === plan;
              return (
                <Pressable
                  key={plan}
                  onPress={() => setSelected(plan)}
                  style={{
                    flex: 1,
                    minWidth: '40%',
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: isActive ? '#FFB800' : colors.components.tag.default.border ?? colors.theme.grey.dark,
                    backgroundColor: isActive ? '#FFB80015' : colors.theme.white.primary,
                  }}
                >
                  <CustomText
                    highlight
                    className="text-16 font-bold"
                    style={{ color: isActive ? '#FFB800' : colors.theme.blue.primary }}
                  >
                    {l[labelKey]}
                  </CustomText>
                </Pressable>
              );
            })}
          </View>

          <CustomButton
            text={activate.isPending ? l.loading : l.btnActivatePlan}
            disabled={activate.isPending}
            onPress={handleActivate}
          />
        </View>
      </View>
    </Modal>
  );
}
