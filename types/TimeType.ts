export type TimePeriodType = {
  startTime: string;
  endTime: string;
};

export type ExceptionDayType = {
  date: string;
  timings: TimePeriodType[];
};
