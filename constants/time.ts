export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const HOUR_INTERVALS = Array.from(
  { length: 24 },
  (_, i) => `${i}-${i + 1}`,
);
