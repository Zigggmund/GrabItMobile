export const priceUnits = {
  rubPerHour: 'rubPerHour',
  rubPerDay: 'rubPerDay',
  rubPerWeek: 'rubPerWeek',
  rubPerMonth: 'rubPerMonth',
} as const;

export type priceUnitKeyType = keyof typeof priceUnits;
