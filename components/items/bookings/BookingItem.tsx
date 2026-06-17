import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import CreateReviewModal from '@/components/modals/CreateReviewModal';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { images } from '@/constants/images';

import {
  BookingAdInfo,
  BookingResponseDto,
  BookingStatus,
} from '@/services/api/services/dto/booking.dto';

interface Props {
  booking: BookingResponseDto;
  role: 'renter' | 'landlord';
  ad?: BookingAdInfo;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onMarkNoShow?: () => void;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('ru-RU')} ${String(d.getHours()).padStart(2, '0')}:00`;
}

export function BookingItem({
  booking,
  role,
  ad,
  onApprove,
  onReject,
  onCancel,
  onMarkNoShow,
}: Props) {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const [reviewVisible, setReviewVisible] = useState(false);

  const statusColors: Record<BookingStatus, string> = {
    pending: colors.base.yellow.primary,
    approved: colors.base.green.primary,
    active: colors.base.orange.primary,
    completed: colors.theme.blue.primary,
    rejected: colors.base.red.bright,
    cancelled: colors.theme.grey.dark,
    no_show: colors.base.red.primary,
  };

  const statusColor = statusColors[booking.status];

  const statusLabel: Record<BookingStatus, string> = {
    pending: l.bookingPending,
    approved: l.bookingApproved,
    active: l.bookingActive,
    completed: l.bookingCompleted,
    rejected: l.bookingRejected,
    cancelled: l.bookingCancelled,
    no_show: l.bookingNoShow,
  };

  const showApproveReject = role === 'landlord' && booking.status === 'pending';
  const showCancel =
    (role === 'landlord' && booking.status === 'approved') ||
    (role === 'renter' &&
      (booking.status === 'pending' || booking.status === 'approved'));
  const showNoShow = role === 'landlord' && booking.status === 'active';
  const showReview = booking.status === 'completed' && !booking.has_my_review;

  const reviewType =
    role === 'renter' ? 'renter_to_listing' : 'owner_to_renter';

  const handleCardPress = () => {
    const listingId = ad?.listing_id ?? booking.listing_id;
    if (!listingId) return;
    navigate({
      pathname: '/(tabs)/ads/[id]',
      params: { id: listingId },
    });
  };

  return (
    <View className="gap-1.5">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleCardPress}
        className="h-44 rounded-xl overflow-hidden flex-row"
        style={{
          backgroundColor: colors.theme.white.primary,
          borderWidth: 1,
          borderColor: colors.components.card.rent.border,
        }}
      >
        <Image
          style={{
            width: '38%',
            borderRightWidth: 1,
            borderColor: colors.components.card.rent.border,
          }}
          source={ad?.cover_url ? { uri: ad.cover_url } : images.defaultAd}
          resizeMode="cover"
        />

        <View className="flex-1 px-2 pt-2 pb-1 justify-between">
          <View className="gap-0.5">
            {ad && (
              <CustomText
                highlight
                numberOfLines={2}
                className="text-15 font-bold"
                style={{ color: colors.theme.blue.primary }}
              >
                {ad.title}
              </CustomText>
            )}
            <View>
              <CustomText
                className="text-12"
                style={{ color: colors.theme.blue.bright }}
              >
                {l.from}: {formatDateTime(booking.start_time)}
              </CustomText>
              <CustomText
                className="text-12"
                style={{ color: colors.theme.blue.bright }}
              >
                {l.to}: {formatDateTime(booking.end_time)}
              </CustomText>
            </View>

            <View className="flex-row items-center justify-between">
              <CustomText
                className="text-12 font-bold"
                style={{ color: colors.theme.blue.dark }}
              >
                {booking.total_price} ₽
              </CustomText>
              <View
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: statusColor }}
              >
                <CustomText
                  className="text-12 font-bold"
                  style={{ color: '#FFFFFF' }}
                >
                  {statusLabel[booking.status]}
                </CustomText>
              </View>
            </View>
          </View>

          {(showApproveReject || showCancel || showNoShow) && (
            <View className="flex-row gap-1.5">
              {showApproveReject && (
                <>
                  <CustomButton
                    type="green"
                    isSmall
                    textClassName="text-11"
                    className="flex-1"
                    text={l.btnApprove}
                    onPress={onApprove}
                  />
                  <CustomButton
                    type="red"
                    isSmall
                    textClassName="text-11"
                    className="flex-1"
                    text={l.btnReject}
                    onPress={onReject}
                  />
                </>
              )}
              {showCancel && (
                <CustomButton
                  isSmall
                  type="red"
                  className="flex-1"
                  text={l.btnCancel}
                  onPress={onCancel}
                />
              )}
              {showNoShow && (
                <CustomButton
                  isSmall
                  type="red"
                  className="flex-1"
                  textClassName="text-11"
                  text={l.btnNoShow}
                  onPress={onMarkNoShow}
                />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {showReview && (
        <CustomButton
          isSmall
          type="secondary"
          text={l.btnLeaveReview}
          onPress={() => setReviewVisible(true)}
        />
      )}

      <CreateReviewModal
        visible={reviewVisible}
        onClose={() => setReviewVisible(false)}
        bookingId={booking.booking_id}
        reviewType={reviewType}
      />
    </View>
  );
}
