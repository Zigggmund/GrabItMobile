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
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const { l } = useLanguage();
  const { colors } = useTheme();

  if (!form) return null;

  const { adCreationFormData, changeAdCreationFormData } = form;

  const onDayPress = (day: CalendarDay) => {
    const dateString = day.dateString;

    if (
      !adCreationFormData.firstDate ||
      (adCreationFormData.firstDate && adCreationFormData.endDate)
    ) {
      // Новый диапазон
      changeAdCreationFormData('firstDate', new Date(dateString));
      changeAdCreationFormData('endDate', null);
      setMarkedDates({
        [dateString]: {
          startingDay: true,
          color: '#00B0FF',
          textColor: 'white',
        },
      });
    } else {
      const first = adCreationFormData.firstDate;
      const second = new Date(dateString);

      const start = first < second ? first : second;
      const end = first < second ? second : first;

      const range: MarkedDates = {};
      for (
        let current = new Date(start);
        current <= end;
        current.setDate(current.getDate() + 1)
      ) {
        const key = current.toISOString().split('T')[0];
        range[key] = {
          color:
            key === start.toISOString().split('T')[0] ||
            key === end.toISOString().split('T')[0]
              ? '#00B0FF'
              : '#80D6FF',
          textColor: 'white',
          startingDay: key === start.toISOString().split('T')[0],
          endingDay: key === end.toISOString().split('T')[0],
        };
      }

      setMarkedDates(range);
      changeAdCreationFormData('firstDate', start);
      changeAdCreationFormData('endDate', end);
    }
  };

  return (
    <ScrollView>
      <Calendar
        markingType="period"
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
          {adCreationFormData.firstDate
            ? `${l.start}: ${adCreationFormData.firstDate.toLocaleDateString()}`
            : `${l.start}: -`}
        </CustomText>
        <CustomText
          style={{ color: colors.theme.blue.dark }}
          className={'text-16'}
        >
          {adCreationFormData.endDate
            ? `${l.end}: ${adCreationFormData.endDate.toLocaleDateString()}`
            : `${l.end}: -`}
        </CustomText>
      </View>
    </ScrollView>
  );
};
