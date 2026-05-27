import { TimePeriodType } from '@/types/TimeType';

import { HOUR_INTERVALS } from '@/constants/time';

export const periodsToHours = (periods: TimePeriodType[]): string[] => {
  const result: string[] = [];

  periods.forEach(period => {
    const start = HOUR_INTERVALS.indexOf(period.startTime);
    const end = HOUR_INTERVALS.indexOf(period.endTime);

    for (let i = start; i < end; i++) {
      result.push(HOUR_INTERVALS[i]);
    }
  });

  return result;
};
