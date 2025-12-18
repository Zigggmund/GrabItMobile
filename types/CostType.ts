type priceUnitType = 'час' | 'день' | 'numer'


export interface CostType {
  payment: number; // стоимость
  priceUnit: priceUnitType;
}