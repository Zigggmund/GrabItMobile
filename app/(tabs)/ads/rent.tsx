import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useApproveBooking } from '@/hooks/booking/useApproveBooking';
import { useCancelBooking } from '@/hooks/booking/useCancelBooking';
import { useGetMyBookings } from '@/hooks/booking/useGetMyBookings';
import { useGetMyOwnerBookings } from '@/hooks/booking/useGetMyOwnerBookings';
import { useRejectBooking } from '@/hooks/booking/useRejectBooking';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { BookingItem } from '@/components/items/bookings/BookingItem';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Tag } from '@/components/common/Tag';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import {
  BookingResponseDto,
  BookingStatus,
  BookingWithAdResponseDto,
} from '@/services/api/services/dto/booking.dto';

type Mode = 'renter' | 'owner';

const STATUS_FILTERS: Array<BookingStatus | undefined> = [
  undefined,
  'pending',
  'approved',
  'active',
  'completed',
  'rejected',
  'cancelled',
];

export default function RentPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();

  const [mode, setMode] = useState<Mode>('renter');
  const [status, setStatus] = useState<BookingStatus | undefined>(undefined);
  const [serverPage, setServerPage] = useState(1);
  const [allBookings, setAllBookings] = useState<
    (BookingResponseDto | BookingWithAdResponseDto)[]
  >([]);

  const renterQuery = useGetMyBookings(
    mode === 'renter' ? status : undefined,
    mode === 'renter' ? serverPage : 1,
  );
  const ownerQuery = useGetMyOwnerBookings(
    mode === 'owner' ? status : undefined,
    mode === 'owner' ? serverPage : 1,
  );

  const approve = useApproveBooking();
  const reject = useRejectBooking();
  const cancel = useCancelBooking();

  const activeQuery = mode === 'renter' ? renterQuery : ownerQuery;
  const { data, isError, isFetching } = activeQuery;

  useEffect(() => {
    setServerPage(1);
    setAllBookings([]);
  }, [mode, status]);

  useEffect(() => {
    if (!data?.items) return;
    setAllBookings(prev => {
      if (serverPage === 1) return data.items;
      const ids = new Set(prev.map(b => b.booking_id));
      return [...prev, ...data.items.filter(b => !ids.has(b.booking_id))];
    });
  }, [data]);

  const total = data?.total ?? 0;

  const statusLabel = (s: BookingStatus | undefined) => {
    if (!s) return l.bookingAll;
    const map: Record<BookingStatus, string> = {
      pending: l.bookingPending,
      approved: l.bookingApproved,
      active: l.bookingActive,
      completed: l.bookingCompleted,
      rejected: l.bookingRejected,
      cancelled: l.bookingCancelled,
    };
    return map[s];
  };

  if (isError)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );

  return (
    <ScreenContainer>
      <FlatList
        data={allBookings}
        keyExtractor={item => item.booking_id}
        renderItem={({ item }) => {
          const withAd = item as BookingWithAdResponseDto;
          return (
            <BookingItem
              booking={item}
              role={mode === 'renter' ? 'renter' : 'landlord'}
              ad={withAd.listing ?? undefined}
              onApprove={
                mode === 'owner'
                  ? () => approve.mutate(item.booking_id)
                  : undefined
              }
              onReject={
                mode === 'owner'
                  ? () => reject.mutate(item.booking_id)
                  : undefined
              }
              onCancel={() => cancel.mutate(item.booking_id)}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (allBookings.length < total && !isFetching) {
            setServerPage(prev => prev + 1);
          }
        }}
        ListHeaderComponent={() => (
          <View className="gap-3 mb-4">
            <View className="flex-row gap-3 justify-center mb-4">
              <CustomButton
                text={l.iRent}
                type={mode == 'renter' ? 'highlighted' : 'secondary'}
                onPress={() => setMode('renter')}
              />
              <CustomButton
                text={l.iLend}
                type={mode == 'owner' ? 'highlighted' : 'secondary'}
                onPress={() => setMode('owner')}
              />
            </View>

            <View className="flex-row flex-wrap gap-2 px-1 justify-center">
              {STATUS_FILTERS.map(s => (
                <Tag
                  key={s ?? 'all'}
                  isSmall
                  label={statusLabel(s)}
                  selected={status === s}
                  onPress={() => setStatus(s)}
                />
              ))}
            </View>
          </View>
        )}
        ListFooterComponent={() =>
          isFetching ? <ActivityIndicator className="py-4" /> : null
        }
        ListEmptyComponent={() =>
          !isFetching ? (
            <CustomText
              highlight
              className="text-28 text-center"
              style={{ color: colors.theme.blue.primary }}
            >
              {l.emptyBookingList}
            </CustomText>
          ) : null
        }
      />
    </ScreenContainer>
  );
}
