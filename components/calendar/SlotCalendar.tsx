import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { useGetSlots } from '@/hooks/booking/useGetSlots';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomText } from '@/components/ui/text/CustomText';

interface Props {
  adId: string;
  minDate?: string;
  mode: 'start' | 'end';
  selected: { date: string | null; hour: number | null };
  onDateChange: (date: string) => void;
  onHourSelect: (hour: number) => void;
  minHour?: number;
}

// календарь брони,
export function SlotCalendar({
  adId,
  minDate,
  mode,
  selected,
  onDateChange,
  onHourSelect,
  minHour,
}: Props) {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { data: slots, isFetching } = useGetSlots(adId, selected.date);

  const markedDates = selected.date
    ? { [selected.date]: { selected: true, selectedColor: colors.base.orange.primary } }
    : {};

  const todayStr = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  // start: 0–23, end: 1–24
  const allHours =
    mode === 'start'
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 24 }, (_, i) => i + 1);

  // hide hours in the past on today's date
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
        minDate={minDate}
        markedDates={markedDates}
        onDayPress={day => onDateChange(day.dateString)}
        theme={{
          backgroundColor: colors.theme.white.primary,
          calendarBackground: colors.theme.white.primary,
          textSectionTitleColor: colors.theme.blue.bright,
          dayTextColor: colors.theme.black.primary,
          todayTextColor: colors.base.orange.primary,
          selectedDayTextColor: colors.base.neutral.whitePrimary,
          selectedDayBackgroundColor: colors.base.orange.primary,
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
