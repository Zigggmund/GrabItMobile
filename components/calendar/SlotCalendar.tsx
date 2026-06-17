import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { useGetCalendar } from '@/hooks/booking/useGetCalendar';
import { useGetSlots } from '@/hooks/booking/useGetSlots';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

interface Props {
  adId: string;
  minDate?: string;
  maxDate?: string;
  mode: 'start' | 'end';
  selected: { date: string | null; hour: number | null };
  onDateChange: (date: string) => void;
  onHourSelect: (hour: number) => void;
  minHour?: number;
}

// null → grey (non-working), 0 → light green, 100 → light red
function utilizationBg(u: number | null): string {
  if (u === null) return 'rgba(150,150,150,0.15)';
  if (u === 0) return 'rgba(80,190,80,0.22)';
  if (u >= 100) return 'rgba(210,50,50,0.25)';
  const r = Math.round(50 + (u / 100) * 160);
  const g = Math.round(190 - (u / 100) * 140);
  return `rgba(${r},${g},55,0.22)`;
}

export function SlotCalendar({
  adId,
  minDate,
  maxDate,
  mode,
  selected,
  onDateChange,
  onHourSelect,
  minHour,
}: Props) {
  const { colors } = useTheme();
  const { l } = useLanguage();

  const today = new Date();
  const [visibleYear, setVisibleYear] = useState(today.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(today.getMonth() + 1);

  const { data: calendar } = useGetCalendar(adId, visibleYear, visibleMonth);
  const { data: slots, isFetching } = useGetSlots(adId, selected.date);

  const markedDates = useMemo(() => {
    const result: Record<string, any> = {};

    calendar?.days.forEach(day => {
      result[day.date] = {
        customStyles: {
          container: { backgroundColor: utilizationBg(day.utilization), borderRadius: 16 },
        },
      };
    });

    if (selected.date) {
      result[selected.date] = {
        customStyles: {
          container: { backgroundColor: colors.base.orange.primary, borderRadius: 16 },
          text: { color: colors.base.neutral.whitePrimary },
        },
      };
    }

    return result;
  }, [calendar, selected.date, colors]);

  const todayStr = today.toISOString().split('T')[0];
  const currentHour = today.getHours();

  const allHours =
    mode === 'start'
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 24 }, (_, i) => i + 1);

  const visibleHours = allHours.filter(h => {
    if (selected.date === todayStr && h <= currentHour) return false;
    return true;
  });

  const availableSet = new Set(slots ?? []);

  const isAvailable = (h: number): boolean => {
    if (mode === 'end' && h === 24) return availableSet.has(23);
    return availableSet.has(h);
  };

  const isSelectable = (h: number): boolean =>
    isAvailable(h) && (minHour == null || h > minHour);

  const getBgColor = (h: number): string => {
    if (h === selected.hour) return colors.base.orange.primary;
    if (isSelectable(h)) return colors.base.green.bright;
    return colors.base.red.bright;
  };

  return (
    <View className="gap-3">
      <Calendar
        markingType="custom"
        minDate={minDate}
        maxDate={maxDate}
        markedDates={markedDates}
        onDayPress={day => onDateChange(day.dateString)}
        onMonthChange={m => {
          setVisibleYear(m.year);
          setVisibleMonth(m.month);
        }}
        theme={{
          backgroundColor: colors.theme.white.primary,
          calendarBackground: colors.theme.white.primary,
          textSectionTitleColor: colors.theme.blue.bright,
          dayTextColor: colors.theme.black.primary,
          todayTextColor: colors.base.orange.primary,
          arrowColor: colors.theme.blue.primary,
          monthTextColor: colors.theme.blue.primary,
          textDisabledColor: colors.components.tag.default.text,
        }}
      />

      {selected.date && (
        <View className="gap-2">
          {isFetching ? (
            <ActivityIndicator />
          ) : visibleHours.length === 0 ? (
            <CustomText
              className="text-14 text-center"
              style={{ color: colors.theme.blue.bright }}
            >
              {l.noSlotsAvailable}
            </CustomText>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2 px-1">
                {visibleHours.map(h => (
                  <TouchableOpacity
                    key={h}
                    disabled={!isSelectable(h) && h !== selected.hour}
                    onPress={() => onHourSelect(h)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 20,
                      backgroundColor: getBgColor(h),
                    }}
                  >
                    <CustomText
                      style={{ color: colors.base.neutral.whitePrimary }}
                      className="text-14 font-medium"
                    >
                      {h}:00
                    </CustomText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
