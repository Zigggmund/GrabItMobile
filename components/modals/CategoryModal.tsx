import { useMemo, useState } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryType } from '@/types/entities/CategoryType';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: CategoryType | null) => void;
  categories: CategoryType[];
  productTypeFilter?: string | null;
  selected: CategoryType | null;
}

const isCategoryRoot = (cat: CategoryType): boolean => cat.parentId === null;

export const CategoryModal = ({
  visible,
  onClose,
  onSelect,
  categories,
  productTypeFilter,
  selected,
}: CategoryModalProps) => {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // pathStack — категории, по которым мы спустились.
  // Пустой стек = корневой уровень.
  const [pathStack, setPathStack] = useState<CategoryType[]>([]);

  // id текущего «родителя» (null = корень)
  const currentParentId: number | null =
    pathStack.length > 0 ? pathStack[pathStack.length - 1].id : null;

  const visibleCategories = useMemo(() => {
    if (currentParentId === null) {
      const roots = categories.filter(isCategoryRoot);
      // Если задан фильтр по типу объявления — оставляем только нужные
      if (productTypeFilter) {
        return roots.filter(c => c.productType === productTypeFilter);
      }
      return roots;
    }
    return categories.filter(c => c.parentId === currentParentId);
  }, [categories, currentParentId, productTypeFilter]);

  const hasChildren = (cat: CategoryType): boolean =>
    categories.some(c => c.parentId === cat.id);

  // Хлебные крошки
  const breadcrumb = pathStack.map(c => l[c.name as keyof typeof l] ?? c.name).join(' › ');

  const handleClose = () => {
    setPathStack([]);
    onClose();
  };

  // выбрать категорию
  const handleSelect = (cat: CategoryType) => {
    setPathStack([]);
    onSelect(cat);
    onClose();
  };

  // к вложенным категориям
  const handleDrillDown = (cat: CategoryType) => {
    setPathStack(prev => [...prev, cat]);
  };

  // назад
  const handleBack = () => {
    setPathStack(prev => prev.slice(0, -1));
  };

  // сбросить
  const handleReset = () => {
    setPathStack([]);
    onSelect(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.theme.white.primary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View
          className={'flex-row justify-between items-center px-4 py-3'}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.base.grey.primary,
          }}
        >
          {/* кнопка назад  */}
          {pathStack.length > 0 ? (
            <TouchableOpacity onPress={handleBack}>
              <CustomText
                className={'text-16'}
                style={{ color: colors.theme.blue.primary }}
              >
                {'‹ '}{l.btnBack}
              </CustomText>
            </TouchableOpacity>
          ) : (
            <CustomText
              highlight
              className={'text-16'}
              style={{ color: colors.theme.blue.primary }}
            >
              {l.selectCategory}
            </CustomText>
          )}

          <TouchableOpacity onPress={handleClose}>
            <CustomText
              className={'text-16'}
              style={{ color: colors.theme.black.dark }}
            >
              {l.btnCancel}
            </CustomText>
          </TouchableOpacity>
        </View>

        {breadcrumb ? (
          <View className={'px-4 py-2'}>
            <CustomText
              className={'text-12'}
              style={{ color: colors.theme.black.dark }}
            >
              {breadcrumb}
            </CustomText>
          </View>
        ) : null}

        {/* ── Список категорий текущего уровня ─────────────────────── */}
        <FlatList
          data={visibleCategories}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => {
            const hasKids = hasChildren(item);
            const isSelected = selected?.id === item.id;

            return (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.base.grey.primary,
                }}
              >
                <View className={'flex-row items-center'}>
                  <TouchableOpacity
                    className={'flex-1 px-4 py-4'}
                    onPress={() => handleSelect(item)}
                  >
                    <CustomText
                      className={'text-14'}
                      style={{
                        color: isSelected
                          ? colors.theme.blue.primary
                          : colors.theme.black.dark,
                      }}
                    >
                      {/* Пробуем взять локализованное имя; если нет — используем raw */}
                      {(l[item.name as keyof typeof l] as string) ?? item.name}
                    </CustomText>
                  </TouchableOpacity>

                  {hasKids && (
                    <TouchableOpacity
                      className={'px-5 py-4'}
                      onPress={() => handleDrillDown(item)}
                      style={{
                        borderRadius: 10,
                        borderColor: colors.theme.grey.dark,
                        borderWidth: 2,
                      }}
                    >
                      <CustomText
                        className={'text-18'}
                        style={{ color: colors.base.neutral.greyDark }}
                      >
                        ›
                      </CustomText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View className={'p-4'}>
              <CustomText style={{ color: colors.base.neutral.greyDark }}>
                {l.emptyAdList}
              </CustomText>
            </View>
          }
        />

        {/* ── Сброс выбора ─────────────────────────────────────────── */}
        <View className={'px-4 pt-2 pb-4'}>
          <CustomButton
            type={'red'}
            text={l.btnReset}
            onPress={handleReset}
          />
        </View>
      </View>
    </Modal>
  );
};
