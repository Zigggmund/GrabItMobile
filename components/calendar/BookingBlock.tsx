import { useState } from 'react';
import { View } from 'react-native';

import { useCreateBooking } from '@/hooks/booking/useCreateBooking';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { SlotCalendar } from '@/components/calendar/SlotCalendar';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { useHistory } from '@/hooks/useHistory';

interface Props {
  adId: string;
  bufferHours: number;
  rubPerHour: number;
}

const today = new Date().toISOString().split('T')[0];

function buildEndISO(endDate: string, endHour: number): string {
  if (endHour === 24) {
    const d = new Date(`${endDate}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return `${d.toISOString().split('T')[0]}T00:00:00Z`;
  }
  return `${endDate}T${String(endHour).padStart(2, '0')}:00:00Z`;
}

export function BookingBlock({ adId, bufferHours, rubPerHour }: Props) {
  const { navigate } = useHistory();
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { mutate: createBooking, isPending, error } = useCreateBooking();

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setStartHour(null);
    setEndDate(null);
    setEndHour(null);
  };

  const handleStartHourSelect = (hour: number) => {
    setStartHour(hour);
    setEndDate(null);
    setEndHour(null);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setEndHour(null);
  };

  const handleBook = () => {
    if (!startDate || startHour === null || !endDate || endHour === null) return;
    const startISO = `${startDate}T${String(startHour).padStart(2, '0')}:00:00Z`;
    const endISO = buildEndISO(endDate, endHour);
    createBooking(
      { listing_id: adId, quantity: 1, start_time: startISO, end_time: endISO },
      {
        onSuccess: () => {
          setIsOpen(false);
          setStartDate(null);
          setStartHour(null);
          setEndDate(null);
          setEndHour(null);
          navigate('/(tabs)/ads/rent');
        },
      },
    );
  };

  const endMinHour =
    endDate === startDate && startHour !== null
      ? startHour + bufferHours
      : undefined;

  let totalHours: number | null = null;
  let totalCost: number | null = null;
  if (startDate && startHour !== null && endDate && endHour !== null) {
    const startMs = new Date(
      `${startDate}T${String(startHour).padStart(2, '0')}:00:00Z`,
    ).getTime();
    const endMs = new Date(buildEndISO(endDate, endHour)).getTime();
    totalHours = (endMs - startMs) / 3600000;
    totalCost = Math.round(totalHours * rubPerHour);
  }

  return (
    <View className="gap-4">
      <View className="mr-20 ml-20">
        <CustomButton
          type={isOpen ? 'secondary' : 'highlighted'}
          isSmall
          textClassName="text-19"
          iconSize={20}
          iconSource={icons.rent}
          text={l.btnSelectTime}
          onPress={() => setIsOpen(v => !v)}
        />
      </View>

      {isOpen && (
        <View className="gap-4">
          <CustomText
            className="text-16 font-semibold"
            style={{ color: colors.theme.blue.primary }}
          >
            {l.startTime}
          </CustomText>
          <SlotCalendar
            adId={adId}
            minDate={today}
            mode="start"
            selected={{ date: startDate, hour: startHour }}
            onDateChange={handleStartDateChange}
            onHourSelect={handleStartHourSelect}
          />

          {startDate !== null && startHour !== null && (
            <>
              <CustomText
                className="text-16 font-semibold"
                style={{ color: colors.theme.blue.primary }}
              >
                {l.endTime}
              </CustomText>
              <SlotCalendar
                adId={adId}
                minDate={startDate}
                mode="end"
                selected={{ date: endDate, hour: endHour }}
                onDateChange={handleEndDateChange}
                onHourSelect={setEndHour}
                minHour={endMinHour}
              />
            </>
          )}

          {totalHours !== null && totalCost !== null && (
            <CustomText
              className="text-15 font-semibold text-center"
              style={{ color: colors.theme.blue.primary }}
            >
              {totalHours} {l.hoursAbbr} · {totalCost.toLocaleString('ru-RU')} ₽
            </CustomText>
          )}

          {endDate !== null && endHour !== null && (
            <View className="mr-10 ml-10">
              <CustomButton
                text={l.btnBook}
                textClassName="text-19"
                disabled={isPending}
                onPress={handleBook}
              />
              {error && (
                <CustomText
                  className="text-13 text-center mt-2"
                  style={{ color: colors.base.red.primary }}
                >
                  {error.message}
                </CustomText>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
