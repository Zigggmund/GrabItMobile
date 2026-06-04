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
  (_, i) =>
    `${i.toString().length == 1 ? `0${i}` : i}-${(i + 1).toString().length == 1 ? `0${i + 1}` : i + 1}`,
);
