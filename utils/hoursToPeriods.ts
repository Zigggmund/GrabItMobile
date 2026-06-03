import { TimePeriodType } from '@/types/TimeType';

import { HOUR_INTERVALS } from '@/constants/time';

export const hoursToPeriods = (hours: string[]): TimePeriodType[] => {
  if (hours.length === 0) return [];

  const sorted = [...hours].sort(
    (a, b) => HOUR_INTERVALS.indexOf(a) - HOUR_INTERVALS.indexOf(b),
  );

  const result: TimePeriodType[] = [];

  let start = sorted[0];
  let prevIndex = HOUR_INTERVALS.indexOf(sorted[0]);

  for (let i = 1; i < sorted.length; i++) {
    const currentIndex = HOUR_INTERVALS.indexOf(sorted[i]);

    if (currentIndex !== prevIndex + 1) {
      result.push({
        startTime: start,
        endTime: HOUR_INTERVALS[prevIndex + 1],
      });

      start = sorted[i];
    }

    prevIndex = currentIndex;
  }

  result.push({
    startTime: start,
    endTime: prevIndex + 1 < HOUR_INTERVALS.length ? HOUR_INTERVALS[prevIndex + 1] : '24',
  });

  return result;
};
