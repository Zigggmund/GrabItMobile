import { priceUnitKeyType } from '@/constants/priceUnits';

export interface CostType {
  payment: number; // стоимость
  priceUnit: priceUnitKeyType;
}
