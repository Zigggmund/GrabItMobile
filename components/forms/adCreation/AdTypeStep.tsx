import { ProductType } from '@/types/AdType';

import { useState } from 'react';
import { View } from 'react-native';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { Tag } from '@/components/common/Tag';
import { CustomText } from '@/components/ui/text/CustomText';

export const AdTypeStep = ({ errors }: { errors: Record<string, string> }) => {
  const form = useForm();
  const { l } = useLanguage();
  const { colors } = useTheme();

  const selectOption = (option: ProductType | null) => {
    if (option) form.changeAdCreationFormData('adType', option);
  };
  return (
    <View className={'gap-2 items-center'}>
      <Tag
        width={140}
        label={l.product}
        onPress={() => selectOption('product')}
        selected={form.adCreationFormData.adType == 'product'}
      />
      <Tag
        width={140}
        label={l.service}
        onPress={() => selectOption('service')}
        selected={form.adCreationFormData.adType == 'service'}
      />
      <Tag
        width={140}
        label={l.space}
        onPress={() => selectOption('space')}
        selected={form.adCreationFormData.adType == 'space'}
      />
      <CustomText
        style={{ color: colors.base.red.primary }}
        className={'text-18'}
      >
        {errors.adType}
      </CustomText>
    </View>
  );
};
