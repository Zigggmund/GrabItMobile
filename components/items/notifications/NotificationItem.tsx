import { NotificationType } from '@/types/entities/NotificationType';

import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useApproveBooking } from '@/hooks/booking/useApproveBooking';
import { useRejectBooking } from '@/hooks/booking/useRejectBooking';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { dateFormat } from '@/utils/dateFormat';

interface Props {
  notification: NotificationType;
  index: number;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, index, onRead }: Props) {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const approve = useApproveBooking();
  const reject = useRejectBooking();
  const [expanded, setExpanded] = useState(false);
  const [actionTaken, setActionTaken] = useState<'approved' | 'rejected' | null>(null);

  const data = notification.data;
  const isBookingCreatedForOwner =
    notification.eventType === 'booking.created' && data?.role === 'owner';
  const bookingId = data?.booking_id;

  const canNavigate =
    !!data &&
    (notification.eventType.startsWith('booking.') ||
      notification.eventType.startsWith('review.'));

  const handlePress = () => {
    setExpanded(prev => !prev);
    if (!notification.isRead) onRead(notification.id);
  };

  const handleNavigate = () => {
    if (!data) return;
    const type = notification.eventType;
    if (type.startsWith('booking.') && data.listing_id) {
      navigate(
        data.role === 'owner'
          ? { pathname: '/(tabs)/ads/bookings/[id]', params: { id: data.listing_id } }
          : { pathname: '/(tabs)/ads/[id]', params: { id: data.listing_id } },
      );
    } else if (type.startsWith('review.') && data.listing_id) {
      navigate({ pathname: '/(tabs)/ads/reviews/[id]', params: { id: data.listing_id } });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
      <GreyBlock index={index} className="px-3 py-2 gap-1">
        <View className="flex-row items-center gap-2">
          {!notification.isRead && (
            <View
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: colors.base.orange.primary }}
            />
          )}
          <CustomText
            numberOfLines={expanded ? undefined : 1}
            className={`flex-1 text-14 ${!notification.isRead ? 'font-bold' : ''}`}
            style={{ color: colors.theme.blue.primary }}
          >
            {notification.title}
          </CustomText>
        </View>

        {expanded && (
          <View className="gap-1 mt-1 ml-4">
            <CustomText className="text-12" style={{ color: colors.theme.blue.bright }}>
              {notification.body}
            </CustomText>
            <CustomText className="text-11" style={{ color: colors.theme.blue.bright }}>
              {dateFormat(notification.createdAt)}
            </CustomText>

            {isBookingCreatedForOwner && bookingId ? (
              actionTaken ? (
                <View className="flex-row mt-1">
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        actionTaken === 'approved'
                          ? colors.base.green.primary
                          : colors.base.red.primary,
                    }}
                  >
                    <CustomText
                      className="text-11"
                      style={{ color: colors.base.neutral.whiteBright }}
                    >
                      {actionTaken === 'approved' ? l.bookingApproved : l.bookingRejected}
                    </CustomText>
                  </View>
                </View>
              ) : (
                <View className="flex-row gap-2 mt-1">
                  <CustomButton
                    type="green"
                    isSmall
                    textClassName="text-11"
                    className="flex-1"
                    text={l.btnApprove}
                    disabled={approve.isPending || reject.isPending}
                    onPress={() => {
                      approve.mutate(bookingId, { onSuccess: () => setActionTaken('approved') });
                      onRead(notification.id);
                    }}
                  />
                  <CustomButton
                    type="red"
                    isSmall
                    textClassName="text-11"
                    className="flex-1"
                    text={l.btnReject}
                    disabled={approve.isPending || reject.isPending}
                    onPress={() => {
                      reject.mutate(bookingId, { onSuccess: () => setActionTaken('rejected') });
                      onRead(notification.id);
                    }}
                  />
                </View>
              )
            ) : canNavigate ? (
              <View className="items-start mt-1">
                <CustomButton
                  isSmall
                  type="secondary"
                  textClassName="text-11"
                  text={l.btnReadMore}
                  onPress={handleNavigate}
                />
              </View>
            ) : null}
          </View>
        )}
      </GreyBlock>
    </TouchableOpacity>
  );
}