import { ExceptionDayType, TimePeriodType } from '@/types/TimeType';

import { useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { hoursToPeriods } from '@/utils/hoursToPeriods';
import { periodsToHours } from '@/utils/periodsToHours';

import { Tag } from '@/components/common/Tag';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { HOUR_INTERVALS } from '@/constants/time';

type CalendarDay = {
  dateString: string;
};

type MarkedDateType = {
  selected?: boolean;
  selectedColor?: string;
};
type MarkedDatesType = Record<string, MarkedDateType>;

export const AdExceptionsStep = ({
  errors,
}: {
  errors: Record<string, string>;
}) => {
  const form = useForm();

  const { colors } = useTheme();
  const { l } = useLanguage();

  const exceptions = form.adCreationFormData.exceptions || [];

  const [selectedDate, setSelectedDate] = useState<string | null>(
    exceptions[0]?.date || null,
  );

  const markedDates = useMemo(() => {
    const result: MarkedDatesType = {};

    exceptions.forEach(item => {
      result[item.date] = {
        selected: true,
        selectedColor: colors.theme.blue.primary,
      };
    });

    if (selectedDate) {
      result[selectedDate] = {
        ...(result[selectedDate] || {}),
        selected: true,
        selectedColor: colors.theme.blue.dark,
      };
    }

    return result;
  }, [exceptions, selectedDate]);

  const getWeekDayIndex = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDay();

    return day === 0 ? 6 : day - 1;
  };

  const areTimingsEqual = (a: TimePeriodType[], b: TimePeriodType[]) => {
    if (a.length !== b.length) {
      return false;
    }

    const sortedA = [...a].sort((x, y) =>
      x.startTime.localeCompare(y.startTime),
    );

    const sortedB = [...b].sort((x, y) =>
      x.startTime.localeCompare(y.startTime),
    );

    return sortedA.every(
      (item, index) =>
        item.startTime === sortedB[index].startTime &&
        item.endTime === sortedB[index].endTime,
    );
  };

  const handleSelectDay = (day: CalendarDay) => {
    const dateString = day.dateString;

    const exists = exceptions.find(e => e.date === dateString);

    if (exists) {
      setSelectedDate(dateString);
      return;
    }

    const weekdayIndex = getWeekDayIndex(dateString);

    const defaultTimings =
      form.adCreationFormData.weekDaysTime[weekdayIndex] || [];

    const newException: ExceptionDayType = {
      date: dateString,
      timings: defaultTimings,
    };

    form.changeAdCreationFormData('exceptions', [...exceptions, newException]);

    setSelectedDate(dateString);
  };

  const selectedException = exceptions.find(e => e.date === selectedDate);

  const handleToggleHour = (hourIndex: number) => {
    if (!selectedException) return;

    const selectedHours = periodsToHours(selectedException.timings);

    const selectedSet = new Set(selectedHours);

    const clickedHour = HOUR_INTERVALS[hourIndex];

    let updatedHours = [...selectedHours];

    if (selectedSet.has(clickedHour)) {
      updatedHours = updatedHours.filter(h => h !== clickedHour);
    } else {
      const minInterval = form.adCreationFormData.minHoursInterval || 1;

      for (let i = 0; i < minInterval; i++) {
        const nextHour = hourIndex + i;

        if (nextHour >= 24) {
          return;
        }

        const value = HOUR_INTERVALS[nextHour];

        if (!selectedSet.has(value)) {
          updatedHours.push(value);
        }
      }
    }

    updateExceptionTimings(
      selectedException.date,
      hoursToPeriods(updatedHours),
    );
  };

  const updateExceptionTimings = (
    dateString: string,
    timings: TimePeriodType[],
  ) => {
    const weekdayIndex = getWeekDayIndex(dateString);

    const defaultTimings = form.adCreationFormData.weekDaysTime[weekdayIndex];

    const filtered = exceptions.filter(e => e.date !== dateString);

    if (areTimingsEqual(timings, defaultTimings)) {
      form.changeAdCreationFormData('exceptions', filtered);

      if (selectedDate === dateString) {
        setSelectedDate(null);
      }

      return;
    }

    form.changeAdCreationFormData('exceptions', [
      ...filtered,
      {
        date: dateString,
        timings,
      },
    ]);
  };

  const removeException = (dateString: string) => {
    const filtered = exceptions.filter(e => e.date !== dateString);

    form.changeAdCreationFormData('exceptions', filtered);

    if (selectedDate === dateString) {
      setSelectedDate(null);
    }
  };

  // const clearException = () => {
  //   if (!selectedException) return;
  //
  //   updateExceptionTimings(selectedException.date, []);
  // };

  return (
    <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
      <FlatList
        horizontal
        scrollEnabled={false}
        data={exceptions}
        keyExtractor={item => item.date}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 4,
        }}
        renderItem={({ item }) => (
          <Tag
            label={new Date(item.date).toLocaleDateString()}
            selected={selectedDate === item.date}
            onPress={() =>
              selectedDate === item.date
                ? setSelectedDate(null)
                : setSelectedDate(item.date)
            }
          />
        )}
      />

      {!selectedException && (
        <Calendar
          minDate={
            form.adCreationFormData.firstDate?.toISOString().split('T')[0]
          }
          maxDate={form.adCreationFormData.endDate?.toISOString().split('T')[0]}
          markedDates={markedDates}
          onDayPress={handleSelectDay}
        />
      )}

      {selectedException && (
        <View className="gap-3">
          <CustomText className="text-18">
            {new Date(selectedException.date).toLocaleDateString()}
          </CustomText>

          <FlatList
            data={HOUR_INTERVALS}
            numColumns={4}
            scrollEnabled={false}
            keyExtractor={item => item}
            contentContainerStyle={{
              alignItems: 'center',
            }}
            renderItem={({ item, index }) => {
              const selectedHours = periodsToHours(selectedException.timings);

              const selected = selectedHours.includes(item);

              return (
                <Tag
                  className={'mx-1 my-1.5'}
                  label={item}
                  selected={selected}
                  onPress={() => handleToggleHour(index)}
                />
              );
            }}
          />

          <View className="flex-row justify-between flex-1">
            <CustomButton
              iconSize={20}
              iconSource={icons.trash}
              text={l.btnDelete}
              type="red"
              onPress={() => removeException(selectedException.date)}
            />
            <CustomButton text={l.calendar} type="primary" onPress={() => setSelectedDate(null)} />
          </View>
          <View
            className={'w-full h-0.5'}
            style={{ backgroundColor: colors.base.orange.dark }}
          />
        </View>
      )}

      {errors.exceptions && (
        <CustomText
          style={{
            color: colors.base.red.primary,
          }}
          className={'text-12'}
        >
          {errors.exceptions}
        </CustomText>
      )}
    </ScrollView>
  );
};
