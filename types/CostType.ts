import { priceUnitKeyType } from '@/constants/priceUnits';

export interface CostType {
  payment: number; // стоимость число
  priceUnit: priceUnitKeyType; // р/час и тд
}
