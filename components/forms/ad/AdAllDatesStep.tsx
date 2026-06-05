import { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { FormContext } from '@/context/FormContext';

import { CustomText } from '@/components/ui/text/CustomText';

type CalendarDay = {
  year: number;
  month: number;
  day: number;
  dateString: string;
  timestamp: number;
};

type MarkedDates = Record<
  string,
  {
    startingDay?: boolean;
    endingDay?: boolean;
    color: string;
    textColor: string;
  }
>;

export const AdAllDatesStep = ({
  errors,
}: {
  errors: Record<string, string>;
}) => {
  const form = useContext(FormContext);
  const { l } = useLanguage();
  const { colors } = useTheme();

  const buildRange = (start: Date, end: Date): MarkedDates => {
    const range: MarkedDates = {};
    for (
      let cur = new Date(start);
      cur <= end;
      cur.setDate(cur.getDate() + 1)
    ) {
      const key = cur.toISOString().split('T')[0];
      const isEdge =
        key === start.toISOString().split('T')[0] ||
        key === end.toISOString().split('T')[0];
      range[key] = {
        color: isEdge
          ? colors.base.orange.primary
          : colors.base.orange.brightest,
        textColor: 'white',
        startingDay: key === start.toISOString().split('T')[0],
        endingDay: key === end.toISOString().split('T')[0],
      };
    }
    return range;
  };

  const [markedDates, setMarkedDates] = useState<MarkedDates>(() => {
    if (!form) return {};
    const { firstDate, endDate } = form.AdFormData;
    if (!firstDate) return {};
    if (!endDate) {
      const dateStr = firstDate.toISOString().split('T')[0];
      return {
        [dateStr]: {
          startingDay: true,
          color: colors.base.orange.primary,
          textColor: 'white',
        },
      };
    }
    return buildRange(firstDate, endDate);
  });

  if (!form) return null;

  const { AdFormData, changeAdFormData } = form;
  const today = new Date().toISOString().split('T')[0];

  const onDayPress = (day: CalendarDay) => {
    const dateString = day.dateString;

    if (!AdFormData.firstDate || (AdFormData.firstDate && AdFormData.endDate)) {
      // Новый диапазон
      changeAdFormData('firstDate', new Date(dateString));
      changeAdFormData('endDate', null);
      setMarkedDates({
        [dateString]: {
          startingDay: true,
          color: colors.base.orange.primary,
          textColor: 'white',
        },
      });
    } else {
      const first = AdFormData.firstDate;
      const second = new Date(dateString);

      const start = first < second ? first : second;
      const end = first < second ? second : first;

      setMarkedDates(buildRange(start, end));
      changeAdFormData('firstDate', start);
      changeAdFormData('endDate', end);
    }
  };

  return (
    <ScrollView>
      <Calendar
        markingType="period"
        minDate={today}
        markedDates={markedDates}
        onDayPress={onDayPress}
      />

      {errors.endDate && (
        <CustomText
          style={{ color: colors.base.red.primary }}
          className={'text-12'}
        >
          {errors.endDate}
        </CustomText>
      )}

      <View style={{ paddingTop: 16 }}>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-16'}
        >
          {AdFormData.firstDate
            ? `${l.start}: ${AdFormData.firstDate.toLocaleDateString()}`
            : `${l.start}: -`}
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-16'}
        >
          {AdFormData.endDate
            ? `${l.end}: ${AdFormData.endDate.toLocaleDateString()}`
            : `${l.end}: -`}
        </CustomText>
      </View>
    </ScrollView>
  );
};
