import { CategoryType } from '@/types/CategoryType';

import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { useGetAllCategories } from '@/hooks/category/useGetAllCategories';
import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { SortingMenu } from '@/components/common/SortingMenu';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

export const AdDetailsStep = ({
  errors,
}: {
  errors: Record<string, string>;
}) => {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const form = useForm();
  // АДАПТИВНОСТЬ
  const { width: screenWidth } = useWindowDimensions();

  const [cost, setCost] = useState(
    (form.adCreationFormData.cost || '').toString(),
  );

  const categories = useGetAllCategories().data;
  const [category, setCategory] = useState<CategoryType | null>(null);

  const handleCategory = (value: CategoryType | null) => {
    setCategory(value);
    form.changeAdCreationFormData('categoryId', value?.id || null);
    if (value) console.log(`Категория ${value?.name} выбрана`);
  };

  const [specs, setSpecs] = useState<string[]>(
    form.adCreationFormData.specifications || [''],
  );
  const [specErrors, setSpecErrors] = useState<Record<number, string>>({});

  const handleSpecChange = (index: number, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = value;
    setSpecs(newSpecs);

    form.changeAdCreationFormData(
      'specifications',
      newSpecs.filter(spec => spec.length > 0),
    );

    const newErrors = { ...specErrors };
    if (value.length > 100) {
      newErrors[index] = l.errorSpecificationTooLong;
    } else if (value.length < 5) {
      newErrors[index] = l.errorSpecificationTooShort;
    } else {
      delete newErrors[index];
    }
    setSpecErrors(newErrors);
  };

  const addSpec = () => {
    if (specs.length < 10) {
      setSpecs([...specs, '']);
    }
  };

  const removeSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    form.changeAdCreationFormData('specifications', newSpecs);

    const newErrors = { ...specErrors };
    delete newErrors[index];
    setSpecErrors(newErrors);
  };

  return (
    <ScrollView>
      <View className="gap-4 flex-1 w-full">
        <CustomInput
          value={form.adCreationFormData.title}
          label={l.name}
          onChangeText={text => form.changeAdCreationFormData('title', text)}
          errorMessage={errors.title}
          placeholder={l.requiredToFillIn}
        />
        <CustomInput
          value={form.adCreationFormData.description}
          label={l.description}
          multiline
          onChangeText={text =>
            form.changeAdCreationFormData('description', text)
          }
          errorMessage={errors.description}
          placeholder={l.optional}
        />
        <CustomInput
          value={cost}
          label={`${l.price} (${l.rubPerHour})`}
          keyboardType="numeric"
          onChangeText={text => setCost(text)}
          onBlur={() => {
            // Конвертация в число только когда пользователь ушёл с поля
            const numericValue = parseFloat(cost || '');
            form.changeAdCreationFormData(
              'cost',
              isNaN(numericValue) ? null : numericValue,
            );
          }}
          errorMessage={errors.cost}
          placeholder={l.requiredToFillIn}
        />
        {categories && (
          <View>
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              highlight
              className={`pl-1 text-15 mb-1`}
            >
              {l.category.toUpperCase()}
            </CustomText>
            <SortingMenu<CategoryType | null>
              items={[
                { label: l.selectCategory, value: null },
                { label: l.transport, value: categories[0] },
                { label: l.realEstate, value: categories[1] },
                { label: l.electronics, value: categories[2] },
                { label: l.tools, value: categories[3] },
                { label: l.homeAndLife, value: categories[4] },
                { label: l.events, value: categories[5] },
                { label: l.sportsAndLeisure, value: categories[6] },
                { label: l.healthAndBeauty, value: categories[7] },
                { label: l.kids, value: categories[8] },
                { label: l.clothing, value: categories[9] },
                { label: l.business, value: categories[10] },
                { label: l.other, value: categories[11] },
              ]}
              value={category}
              onSelect={v => handleCategory(v)}
              width={screenWidth * 0.6}
              maxWidth={240}
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
        )}
        {/* SPECS */}
        <View>
          <CustomText
            style={{ color: colors.theme.blue.dark }}
            highlight
            className={`pl-1 text-15 mb-2`}
          >
            {l.specifications.toUpperCase()}
          </CustomText>
          <View className="gap-1 items-center">
            {specs.map((spec, index) => (
              <View key={index} className="gap-4 flex-row">
                <View className={'flex-1'}>
                  <CustomInput
                    value={spec}
                    placeholder={`${l.specification} ${index + 1}`}
                    onChangeText={text => handleSpecChange(index, text)}
                    errorMessage={specErrors[index]}
                  />
                </View>
                <View className={'mt-3'}>
                  <CustomIcon
                    size={30}
                    source={icons.cross}
                    onPress={() => removeSpec(index)}
                  />
                </View>
              </View>
            ))}

            {specs.length < 10 && (
              <CustomIcon source={icons.add} onPress={addSpec} size={40} />
            )}
            {/*<CustomText*/}
            {/*  style={{ color: colors.base.red.primary }}*/}
            {/*  className={'text-14'}*/}
            {/*>*/}
            {/*  {errors.specifications}*/}
            {/*</CustomText>*/}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
