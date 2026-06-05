import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useExtendBooking } from '@/hooks/booking/useExtendBooking';
import { useGetMyBookings } from '@/hooks/booking/useGetMyBookings';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { SlotCalendar } from '@/components/calendar/SlotCalendar';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

interface Props {
  adId: string;
  currentEndTime: string;
  onClose: () => void;
}

export function ExtendBookingBlock({ adId, currentEndTime, onClose }: Props) {
  const { colors } = useTheme();
  const { l } = useLanguage();

  const [endDate, setEndDate] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);

  const { data: myBookingsData, isLoading } = useGetMyBookings('active', 1);
  const booking = myBookingsData?.items?.find(b => b.listing_id === adId);

  const extend = useExtendBooking(adId);

  const minDate = currentEndTime.split('T')[0];

  const handleExtend = () => {
    if (!booking || !endDate || endHour === null) return;
    const newEndISO = `${endDate}T${String(endHour).padStart(2, '0')}:00:00Z`;
    extend.mutate(
      { bookingId: booking.booking_id, newEndTime: newEndISO },
      { onSuccess: onClose },
    );
  };

  if (isLoading) return <ActivityIndicator />;

  if (!booking)
    return (
      <CustomText
        className="text-14"
        style={{ color: colors.theme.blue.bright }}
      >
        {l.emptyBookingList}
      </CustomText>
    );

  return (
    <View className="gap-4">
      <CustomText
        className="text-16 font-semibold"
        style={{ color: colors.theme.blue.primary }}
      >
        {l.endTime}
      </CustomText>
      <SlotCalendar
        mode={'start'}
        adId={adId}
        minDate={minDate}
        selected={{ date: endDate, hour: endHour }}
        onDateChange={date => {
          setEndDate(date);
          setEndHour(null);
        }}
        onHourSelect={setEndHour}
      />
      {endDate !== null && endHour !== null && (
        <CustomButton
          type="green"
          text={l.btnExtend}
          textClassName="text-19"
          disabled={extend.isPending}
          onPress={handleExtend}
        />
      )}
    </View>
  );
}
