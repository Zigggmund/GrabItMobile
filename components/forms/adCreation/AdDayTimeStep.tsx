import { useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';

import { useForm } from '@/hooks/useForm';
import { useTheme } from '@/hooks/useTheme';

import { SortingMenu } from '@/components/common/SortingMenu';
import { Tag } from '@/components/common/Tag';
import { CustomText } from '@/components/ui/text/CustomText';

import { HOUR_INTERVALS, WEEKDAYS } from '@/constants/time';

export const AdDayTimeStep = ({
  errors,
}: {
  errors: Record<string, string>;
}) => {
  const form = useForm();
  const { colors } = useTheme();
  const [weekdaysTimings, setWeekdaysTimings] = useState(
    form.adCreationFormData.weekDaysTime,
  );

  const formIndexes = form.adCreationFormData.weekDays;
  const justDays = WEEKDAYS.filter((_, index) => formIndexes[index]);
  const menuDays = justDays.map(item => ({ label: item, value: item }));
  const [currentDay, setCurrentDay] = useState<string>(
    justDays.length > 0 ? justDays[0] : 'monday',
  );
  if (justDays.length == 0) return null;

  const handleAddTiming = (hourIndex: number) => {
    const dayIndex = WEEKDAYS.indexOf(currentDay);
    const currentDayTimings = weekdaysTimings[dayIndex] || [];

    const selectedHours = new Set(
      currentDayTimings.map(h => HOUR_INTERVALS.indexOf(h)),
    );

    // если час уже выбран — убираем
    if (selectedHours.has(hourIndex)) {
      const newTimings = currentDayTimings.filter(
        h => HOUR_INTERVALS.indexOf(h) !== hourIndex,
      );
      updateTimings(dayIndex, newTimings);
      return;
    }

    // добавляем часы с учетом minInterval
    const minInterval = form.adCreationFormData.minInterval || 1;
    const newSelection: string[] = [];

    for (let i = 0; i < minInterval; i++) {
      const nextHour = hourIndex + i;
      if (nextHour < 24 && !selectedHours.has(nextHour)) {
        newSelection.push(HOUR_INTERVALS[nextHour]);
      } else if (nextHour >= 24) {
        return;
      }
    }

    updateTimings(dayIndex, [...currentDayTimings, ...newSelection]);
  };

  const updateTimings = (dayIndex: number, timings: string[]) => {
    const newWeekdaysTimings = [...weekdaysTimings];
    newWeekdaysTimings[dayIndex] = timings;
    setWeekdaysTimings(newWeekdaysTimings);
    form.changeAdCreationFormData('weekDaysTime', newWeekdaysTimings);
  };

  return (
    // <ScrollView>
    <View className="gap-2 flex-1 w-full items-center">
      <SortingMenu
        items={menuDays}
        value={currentDay}
        onSelect={setCurrentDay}
      />
      <FlatList
        data={HOUR_INTERVALS}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ alignItems: 'center' }}
        numColumns={4}
        renderItem={({ item, index }) => {
          const dayIndex = WEEKDAYS.indexOf(currentDay);
          const selected = weekdaysTimings[dayIndex]?.includes(item) || false;
          return (
            <Tag
              className={'mx-1 my-1.5'}
              label={item}
              selected={selected}
              onPress={() => handleAddTiming(index)}
            />
          );
        }}
      />
      { errors.weekDaysTime &&
        <CustomText
          style={{ color: colors.base.red.primary }}
          className={'text-12'}
        >
          {errors.weekDaysTime}
        </CustomText>
      }

    </View>
    // </ScrollView>
  );
};
