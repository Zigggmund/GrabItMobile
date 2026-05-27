import { ProductType } from '@/types/entities/AdType';
import { CategoryType } from '@/types/entities/CategoryType';


import { LType } from '@/types/LanguageType';

interface getProductTypeCategoryItemsProps {
  l: LType;
  allCategories: CategoryType[];
  productType: ProductType;
}

export const getProductTypeCategoryItems = ({
  l,
  productType,
  allCategories,
}: getProductTypeCategoryItemsProps) => {
  let items;
  switch (productType) {
    case 'product':
      items = [
        { label: l.allCategories, value: null },
        {
          label: l.transport,
          value: allCategories.filter(item => item.name == 'transport')[0],
        },
        {
          label: l.tools,
          value: allCategories.filter(item => item.name == 'tools')[0],
        },
        {
          label: l.electronics,
          value: allCategories.filter(item => item.name == 'electronics')[0],
        },
        {
          label: l.clothing,
          value: allCategories.filter(item => item.name == 'clothing')[0],
        },
        {
          label: l.homeAndLife,
          value: allCategories.filter(item => item.name == 'homeAndLife')[0],
        },
        {
          label: l.events,
          value: allCategories.filter(item => item.name == 'events')[0],
        },
        {
          label: l.sportsAndLeisure,
          value: allCategories.filter(
            item => item.name == 'sportsAndLeisure',
          )[0],
        },
        {
          label: l.healthAndBeauty,
          value: allCategories.filter(
            item => item.name == 'healthAndBeauty',
          )[0],
        },
        {
          label: l.kids,
          value: allCategories.filter(item => item.name == 'kids')[0],
        },
        {
          label: l.other,
          value: allCategories.filter(item => item.name == 'other')[0],
        },
      ];
      break;
    case 'service':
      items = [
        { label: l.allCategories, value: null },
        {
          label: l.transport,
          value: allCategories.filter(item => item.name == 'transport')[0],
        },
        {
          label: l.electronics,
          value: allCategories.filter(item => item.name == 'electronics')[0],
        },
        {
          label: l.clothing,
          value: allCategories.filter(item => item.name == 'clothing')[0],
        },
        {
          label: l.homeAndLife,
          value: allCategories.filter(item => item.name == 'homeAndLife')[0],
        },
        {
          label: l.events,
          value: allCategories.filter(item => item.name == 'events')[0],
        },
        {
          label: l.sportsAndLeisure,
          value: allCategories.filter(
            item => item.name == 'sportsAndLeisure',
          )[0],
        },
        {
          label: l.healthAndBeauty,
          value: allCategories.filter(
            item => item.name == 'healthAndBeauty',
          )[0],
        },
        {
          label: l.kids,
          value: allCategories.filter(item => item.name == 'kids')[0],
        },
        {
          label: l.other,
          value: allCategories.filter(item => item.name == 'other')[0],
        },
      ];
      break;
    case 'space':
      items = [
        { label: l.allCategories, value: null },

        {
          label: l.realEstate,
          value: allCategories.filter(item => item.name == 'realEstate')[0],
        },
        {
          label: l.business,
          value: allCategories.filter(item => item.name == 'business')[0],
        },
        {
          label: l.homeAndLife,
          value: allCategories.filter(item => item.name == 'homeAndLife')[0],
        },
        {
          label: l.events,
          value: allCategories.filter(item => item.name == 'events')[0],
        },
        {
          label: l.other,
          value: allCategories.filter(item => item.name == 'other')[0],
        },
      ];
      break;
  }
  return items;
};
