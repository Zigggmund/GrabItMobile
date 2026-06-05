import { BookingResponseDto, BookingStatus } from '@/services/api/services/dto/booking.dto';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams } from 'expo-router';

import { useApproveBooking } from '@/hooks/booking/useApproveBooking';
import { useCancelBooking } from '@/hooks/booking/useCancelBooking';
import { useGetAdBookings } from '@/hooks/booking/useGetAdBookings';
import { useRejectBooking } from '@/hooks/booking/useRejectBooking';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { BookingItem } from '@/components/items/bookings/BookingItem';
import { Tag } from '@/components/common/Tag';
import ErrorMessage from '@/components/common/ErrorMessage';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

const STATUS_FILTERS: Array<BookingStatus | undefined> = [
  undefined,
  'pending',
  'approved',
  'active',
  'completed',
  'rejected',
  'cancelled',
];

export default function AdBookingsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();

  const [status, setStatus] = useState<BookingStatus | undefined>(undefined);
  const [serverPage, setServerPage] = useState(1);
  const [allBookings, setAllBookings] = useState<BookingResponseDto[]>([]);
  const [calendarDate, setCalendarDate] = useState<string | null>(null);

  const { data, isError, isFetching } = useGetAdBookings(
    id,
    status,
    serverPage,
    calendarDate ?? undefined,
  );

  const approve = useApproveBooking();
  const reject = useRejectBooking();
  const cancel = useCancelBooking();

  useEffect(() => {
    setServerPage(1);
    setAllBookings([]);
  }, [status, calendarDate]);

  useEffect(() => {
    if (!data?.items) return;
    setAllBookings(prev => {
      if (serverPage === 1) return data.items;
      const ids = new Set(prev.map(b => b.booking_id));
      return [...prev, ...data.items.filter(b => !ids.has(b.booking_id))];
    });
  }, [data]);

  const total = data?.total ?? 0;

  // client-side day filter (range check) — remove when backend `day` param is ready
  const displayedBookings = calendarDate
    ? allBookings.filter(b => {
        const start = b.start_time.split('T')[0];
        const end = b.end_time.split('T')[0];
        return start <= calendarDate && calendarDate <= end;
      })
    : allBookings;

  const markedDates = useMemo(() => {
    const marks: Record<string, object> = {};

    allBookings.forEach(b => {
      const date = b.start_time.split('T')[0];
      marks[date] = { marked: true, dotColor: colors.base.orange.primary };
    });

    if (calendarDate) {
      marks[calendarDate] = {
        ...(marks[calendarDate] ?? {}),
        selected: true,
        selectedColor: colors.base.orange.primary,
      };
    }

    return marks;
  }, [allBookings, calendarDate, colors]);

  const statusLabel = useCallback(
    (s: BookingStatus | undefined) => {
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
    },
    [l],
  );

  if (isError)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );

  return (
    <ScreenContainer>
      <FlatList
        data={displayedBookings}
        keyExtractor={item => item.booking_id}
        renderItem={({ item }) => (
          <BookingItem
            booking={item}
            role="landlord"
            onApprove={() => approve.mutate(item.booking_id)}
            onReject={() => reject.mutate(item.booking_id)}
            onCancel={() => cancel.mutate(item.booking_id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (allBookings.length < total && !isFetching) {
            setServerPage(prev => prev + 1);
          }
        }}
        ListHeaderComponent={() => (
          <View className="gap-4 mb-4">
            <CustomText
              highlight
              className="text-22 font-bold"
              style={{ color: colors.theme.blue.primary }}
            >
              {l.listingBookings}
            </CustomText>

            <Calendar
              markedDates={markedDates}
              onDayPress={day =>
                setCalendarDate(prev =>
                  prev === day.dateString ? null : day.dateString,
                )
              }
              theme={{
                backgroundColor: colors.theme.white.primary,
                calendarBackground: colors.theme.white.primary,
                textSectionTitleColor: colors.theme.blue.bright,
                dayTextColor: colors.theme.blue.bright,
                todayTextColor: colors.base.orange.primary,
                selectedDayTextColor: colors.base.neutral.whitePrimary,
                selectedDayBackgroundColor: colors.base.orange.primary,
                arrowColor: colors.theme.blue.primary,
                monthTextColor: colors.theme.blue.primary,
                textDisabledColor: colors.components.tag.default.text,
              }}
            />

            <View className="flex-row flex-wrap gap-2 px-1">
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
