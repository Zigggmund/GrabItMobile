import { FlatList, View } from 'react-native';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { TranslationKey } from '@/context/LanguageContext';

import { Tag } from '@/components/common/Tag';
import { CustomText } from '@/components/ui/text/CustomText';

import { WEEKDAYS } from '@/constants/weekDays';

export const AdWeekDaysStep = ({
  errors,
}: {
  errors: Record<string, string>;
}) => {
  const form = useForm();
  const { l } = useLanguage();
  const { colors } = useTheme();

  const selectDay = (index: number) => {
    const weekdays = form.adCreationFormData.weekDays;
    weekdays[index] = !weekdays[index];

    form.changeAdCreationFormData('weekDays', weekdays);
  };

  return (
    <View className={'gap-2'}>
      <FlatList
        keyExtractor={item => item}
        data={WEEKDAYS}
        renderItem={({ item, index }) => (
          <Tag
            label={l[item as TranslationKey]}
            selected={form.adCreationFormData.weekDays[index]}
            onPress={() => selectDay(index)}
          />
        )}
      />
      {errors.categoryId && (
        <CustomText
          style={{ color: colors.base.red.primary }}
          className={'text-12'}
        >
          {errors.categoryId}
        </CustomText>
      )}
    </View>
  );
};
