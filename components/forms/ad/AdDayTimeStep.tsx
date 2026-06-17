import { TimePeriodType } from '@/types/TimeType';

import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { useForm } from '@/hooks/useForm';
import { useTheme } from '@/hooks/useTheme';

import { hoursToPeriods } from '@/utils/hoursToPeriods';
import { periodsToHours } from '@/utils/periodsToHours';

import { SortingMenu } from '@/components/common/SortingMenu';
import { Tag } from '@/components/common/Tag';
import { CustomText } from '@/components/ui/text/CustomText';

import { HOUR_INTERVALS, WEEKDAYS } from '@/constants/time';

const COLS = 4;

export const AdDayTimeStep = ({
  errors,
}: {
  errors: Record<string, string>;
}) => {
  const form = useForm();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const [weekdaysTimings, setWeekdaysTimings] = useState(
    form.AdFormData.weekDaysTime,
  );

  const formIndexes = form.AdFormData.weekDays;
  const justDays = WEEKDAYS.filter((_, index) => formIndexes[index]);
  const menuDays = justDays.map(item => ({ label: item, value: item }));
  const [currentDay, setCurrentDay] = useState<string>(
    justDays.length > 0 ? justDays[0] : 'monday',
  );

  if (justDays.length === 0) return null;

  const GAP = 8;
  const H_PADDING = 32; // суммарные горизонтальные отступы родителя
  const cellSize = Math.floor((width - H_PADDING - GAP * (COLS - 1)) / COLS);

  const handleAddTiming = (hourIndex: number) => {
    const dayIndex = WEEKDAYS.indexOf(currentDay);
    const currentPeriods = weekdaysTimings[dayIndex] || [];
    const selectedHours = periodsToHours(currentPeriods);
    const clickedHour = HOUR_INTERVALS[hourIndex];

    const updatedHours = selectedHours.includes(clickedHour)
      ? selectedHours.filter(h => h !== clickedHour)
      : [...selectedHours, clickedHour];

    updateTimings(dayIndex, hoursToPeriods(updatedHours));
  };

  const updateTimings = (dayIndex: number, timings: TimePeriodType[]) => {
    const newWeekdaysTimings = [...weekdaysTimings];
    newWeekdaysTimings[dayIndex] = timings;
    setWeekdaysTimings(newWeekdaysTimings);
    form.changeAdFormData('weekDaysTime', newWeekdaysTimings);
  };

  const dayIndex = WEEKDAYS.indexOf(currentDay);
  const selectedHours = periodsToHours(weekdaysTimings[dayIndex] || []);

  return (
    <View className="gap-2 flex-1 w-full items-center">
      <SortingMenu
        items={menuDays}
        value={currentDay}
        onSelect={setCurrentDay}
      />

      {/* Фиксированная сетка 4×6 */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
        {HOUR_INTERVALS.map((item, index) => (
          <Tag
            key={index}
            label={item}
            selected={selectedHours.includes(item)}
            onPress={() => handleAddTiming(index)}
            width={cellSize}
          />
        ))}
      </View>

      {errors.weekDaysTime && (
        <CustomText
          style={{ color: colors.base.red.primary }}
          className={'text-12'}
        >
          {errors.weekDaysTime}
        </CustomText>
      )}
    </View>
  );
};
