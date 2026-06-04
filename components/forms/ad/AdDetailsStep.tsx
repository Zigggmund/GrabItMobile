import { CategoryType } from '@/types/entities/CategoryType';

import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { useGetProductTypeCategories } from '@/hooks/category/useGetProductTypeCategories';
import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CategoryModal } from '@/components/modals/CategoryModal';
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

  // Все хуки — до любого условного возврата
  const adType = form.AdFormData.adType ?? 'product';
  const { data: categories } = useGetProductTypeCategories(adType);

  const [category, setCategory] = useState<CategoryType | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    form.AdFormData.specifications.length > 0
      ? form.AdFormData.specifications
      : [{ key: '', value: '' }],
  );
  const [specErrors, setSpecErrors] = useState<Record<number, string>>({});

  // const [cost, setCost] = useState(
  //   (form.adCreationFormData.cost || '').toString(),
  // );

  if (!form.AdFormData.adType) return null;

  const handleCategory = (value: CategoryType | null) => {
    setCategory(value);
    form.changeAdFormData('categoryId', value?.id.toString() ?? null);
    if (value) console.log(`Категория ${value?.name} выбрана`);
  };

  const handleSpecChange = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
    form.changeAdFormData('specifications', newSpecs);

    const newErrors = { ...specErrors };
    const keyFilled = newSpecs[index].key.trim().length > 0;
    const valueFilled = newSpecs[index].value.trim().length > 0;
    if (keyFilled !== valueFilled) {
      newErrors[index] = l.errorSpecificationIncomplete;
    } else {
      delete newErrors[index];
    }
    setSpecErrors(newErrors);
  };

  const addSpec = () => {
    if (specs.length < 10) {
      setSpecs([...specs, { key: '', value: '' }]);
    }
  };

  const removeSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    form.changeAdFormData('specifications', newSpecs);

    const newErrors = { ...specErrors };
    delete newErrors[index];
    setSpecErrors(newErrors);
  };

  return (
    <ScrollView>
      <View className="gap-4 flex-1 w-full mb-24">
        <CustomInput
          value={form.AdFormData.title}
          label={l.name}
          onChangeText={text => form.changeAdFormData('title', text)}
          errorMessage={errors.title}
          placeholder={l.requiredToFillIn}
        />
        <CustomInput
          value={form.AdFormData.quantity?.toString()}
          label={l.quantity}
          keyboardType="numeric"
          onChangeText={text => {
            const numericValue = parseInt(text || '');
            form.changeAdFormData(
              'quantity',
              isNaN(numericValue) ? null : numericValue,
            );
          }}
          errorMessage={errors.cost}
          placeholder={l.requiredToFillIn}
          // onBlur={() => {
          //   // Конвертация в число только когда пользователь ушёл с поля
          //   const numericValue = parseFloat(cost || '');
          //   form.changeAdCreationFormData(
          //     'cost',
          //     isNaN(numericValue) ? null : numericValue,
          //   );
          // }}
        />
        <CustomInput
          value={form.AdFormData.description}
          label={l.description}
          multiline
          onChangeText={text =>
            form.changeAdFormData('description', text)
          }
          errorMessage={errors.description}
          placeholder={l.optional}
        />
        <CustomInput
          value={form.AdFormData.cost?.toString()}
          label={`${l.price} (${l.rubPerHour})`}
          keyboardType="numeric"
          onChangeText={text => {
            const numericValue = parseInt(text || '');
            form.changeAdFormData(
              'cost',
              isNaN(numericValue) ? null : numericValue,
            );
          }}
          errorMessage={errors.cost}
          placeholder={l.requiredToFillIn}
          // onBlur={() => {
          //   // Конвертация в число только когда пользователь ушёл с поля
          //   const numericValue = parseFloat(cost || '');
          //   form.changeAdCreationFormData(
          //     'cost',
          //     isNaN(numericValue) ? null : numericValue,
          //   );
          // }}
        />

        <CustomInput
          value={form.AdFormData.minHoursInterval?.toString()}
          label={`${l.minInterval} (${l.hours})`}
          keyboardType="numeric"
          onChangeText={text => {
            const numericValue = parseInt(text || '');
            form.changeAdFormData(
              'minHoursInterval',
              isNaN(numericValue) ? null : numericValue,
            );
          }}
          errorMessage={errors.minInterval}
          placeholder={l.requiredToFillIn}
        />

        {/* КАТЕГОРИЯ */}
        <View>
          <CustomText
            style={{ color: colors.theme.blue.dark }}
            highlight
            className={`pl-1 text-15 mb-1`}
          >
            {l.category.toUpperCase()}
          </CustomText>
          <TouchableOpacity
            onPress={() => setCategoryModalVisible(true)}
            style={{
              borderWidth: 1,
              borderColor: errors.categoryId
                ? colors.base.red.primary
                : colors.base.grey.primary,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <CustomText
              style={{
                color: category
                  ? colors.theme.black.primary
                  : colors.base.neutral.greyDark,
              }}
            >
              {category
                ? ((l[category.name as keyof typeof l] as string) ??
                  category.name)
                : l.requiredToFillIn}
            </CustomText>
          </TouchableOpacity>
          {errors.categoryId && (
            <CustomText
              style={{ color: colors.base.red.primary }}
              className={'text-12'}
            >
              {errors.categoryId}
            </CustomText>
          )}
        </View>

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
                    value={spec.key}
                    placeholder={l.specificationKey}
                    onChangeText={text => handleSpecChange(index, 'key', text)}
                    errorMessage={specErrors[index]}
                  />
                </View>
                <View className={'flex-1'}>
                  <CustomInput
                    value={spec.value}
                    placeholder={l.specificationValue}
                    onChangeText={text =>
                      handleSpecChange(index, 'value', text)
                    }
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
          </View>
        </View>
      </View>

      {categories && (
        <CategoryModal
          visible={categoryModalVisible}
          onClose={() => setCategoryModalVisible(false)}
          onSelect={handleCategory}
          categories={categories}
          selected={category}
        />
      )}
    </ScrollView>
  );
};
