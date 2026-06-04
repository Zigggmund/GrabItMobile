import { FlatList, View } from 'react-native';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { Tag } from '@/components/common/Tag';
import { CustomText } from '@/components/ui/text/CustomText';

import { WEEKDAYS } from '@/constants/time';
import { TranslationKey } from '@/types/LanguageType';

export const AdWeekDaysStep = ({
  errors,
}: {
  errors: Record<string, string>;
}) => {
  const form = useForm();
  const { l } = useLanguage();
  const { colors } = useTheme();

  const selectDay = (index: number) => {
    const weekdays = form.AdFormData.weekDays;
    weekdays[index] = !weekdays[index];

    form.changeAdFormData('weekDays', weekdays);
  };

  return (
    <View className={'gap-2'}>
      <FlatList
        keyExtractor={item => item}
        data={WEEKDAYS}
        renderItem={({ item, index }) => (
          <Tag
            label={l[item as TranslationKey]}
            selected={form.AdFormData.weekDays[index]}
            onPress={() => selectDay(index)}
          />
        )}
      />
      {errors.weekDays && (
        <CustomText
          style={{ color: colors.base.red.primary }}
          className={'text-12'}
        >
          {errors.weekDays}
        </CustomText>
      )}
    </View>
  );
};
