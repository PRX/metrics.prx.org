import * as moment from 'moment';
import { DateRangeModel, TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR,
  IntervalModel, INTERVAL_15MIN, INTERVAL_HOURLY, INTERVAL_DAILY } from '../../ngrx/model';

export const isMoreThanXDays = (x: number, beginDate, endDate): boolean => {
  return endDate.valueOf() - beginDate.valueOf() > (1000 * 60 * 60 * 24 * x); // x days
};

export const beginningOfTodayUTC = () => {
  return moment().utc().hours(0).minutes(0).seconds(0).milliseconds(0);
};

export const endOfTodayUTC = () => {
  return moment().utc().hours(23).minutes(59).seconds(59).milliseconds(999);
};

export const beginningOfThisWeekUTC = () => {
  const utcDate = beginningOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return utcDate.subtract(daysIntoWeek, 'days');
};

export const beginningOfTwoWeeksUTC = () => {
  const utcDate = beginningOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days');
};

export const beginningOfThisMonthUTC = () => {
  return beginningOfTodayUTC().date(1);
};

export const beginningOfThreeMonthsUTC = () => {
  return beginningOfTodayUTC().date(1).subtract(2, 'months');
};

export const beginningOfThisYearUTC = () => {
  return beginningOfTodayUTC().month(0).date(1);
};

export const beginningOfYesterdayUTC = () => {
  return beginningOfTodayUTC().subtract(1, 'days');
};

export const endOfYesterdayUTC = () => {
  return endOfTodayUTC().subtract(1, 'days');
};

export const beginningOfLastWeekUTC = () => {
  const utcDate = beginningOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return utcDate.subtract(daysIntoWeek + 7, 'days');
};

export const endOfLastWeekUTC = () => {
  const utcDate = endOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return utcDate.subtract(daysIntoWeek + 1, 'days');
};

export const beginningOfPriorTwoWeeksUTC = () => {
  const utcDate = beginningOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return beginningOfTodayUTC().subtract(daysIntoWeek + 21, 'days');
};

export const endOfPriorTwoWeeksUTC = () => {
  const utcDate = endOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return utcDate.subtract(daysIntoWeek + 8, 'days');
};

export const beginningOfLastMonthUTC = () => {
  return beginningOfTodayUTC().date(1).subtract(1, 'months'); // 1st of month - 1 month
};

export const endOfLastMonthUTC = () => {
  return endOfTodayUTC().date(1).subtract(1, 'days'); // 1st of month - 1 day
};

export const beginningOfPriorThreeMonthsUTC = () => {
  // first of this month - 5 months
  return beginningOfTodayUTC().date(1).subtract(5, 'months');
};

export const endOfPriorThreeMonthsUTC = () => {
  // first of this month - 1 day and 2 months
  return endOfTodayUTC().date(1).subtract(2, 'months').subtract(1, 'days');
};

export const beginningOfLastYearUTC = () => {
  // first day of year minus 1 year
  return beginningOfTodayUTC().month(0).date(1).subtract(1, 'years');
};

export const endOfLastYearUTC = () => {
  // last day of year minus 1 year
  return endOfTodayUTC().month(11).date(31).subtract(1, 'years');
};

export const getBeginEndDateFromWhen = (when: string): DateRangeModel => {
  switch (when) {
    case TODAY:
      return {
        beginDate: beginningOfTodayUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case YESTERDAY:
      return {
        beginDate: beginningOfYesterdayUTC().toDate(),
        endDate: endOfYesterdayUTC().toDate()
      };
    case THIS_WEEK:
      return {
        beginDate: beginningOfThisWeekUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case LAST_WEEK:
      return {
        beginDate: beginningOfLastWeekUTC().toDate(),
        endDate: endOfLastWeekUTC().toDate()
      };
    case TWO_WEEKS:
      return {
        beginDate: beginningOfTwoWeeksUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case PRIOR_TWO_WEEKS:
      return {
        beginDate: beginningOfPriorTwoWeeksUTC().toDate(),
        endDate: endOfPriorTwoWeeksUTC().toDate()
      };
    case THIS_MONTH:
      return {
        beginDate: beginningOfThisMonthUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case LAST_MONTH:
      return {
        beginDate: beginningOfLastMonthUTC().toDate(),
        endDate: endOfLastMonthUTC().toDate()
      };
    case THREE_MONTHS:
      return {
        beginDate: beginningOfThreeMonthsUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case PRIOR_THREE_MONTHS:
      return {
        beginDate: beginningOfPriorThreeMonthsUTC().toDate(),
        endDate: endOfPriorThreeMonthsUTC().toDate()
      };
    case THIS_YEAR:
      return {
        beginDate: beginningOfThisYearUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case LAST_YEAR:
      return {
        beginDate: beginningOfLastYearUTC().toDate(),
        endDate: endOfLastYearUTC().toDate()
      };
    default:
      break;
  }
};

export const getWhenForRange = (dateRange: DateRangeModel) => {
  if (dateRange.beginDate.valueOf() === beginningOfTodayUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return TODAY;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisWeekUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return THIS_WEEK;
  } else if (dateRange.beginDate.valueOf() === beginningOfTwoWeeksUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return TWO_WEEKS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisMonthUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return THIS_MONTH;
  } else if (dateRange.beginDate.valueOf() === beginningOfThreeMonthsUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return THREE_MONTHS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisYearUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return THIS_YEAR;
  } else if (dateRange.beginDate.valueOf() === beginningOfYesterdayUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfYesterdayUTC().valueOf()) {
    return YESTERDAY;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastWeekUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfLastWeekUTC().valueOf()) {
    return LAST_WEEK;
  } else if (dateRange.beginDate.valueOf() === beginningOfPriorTwoWeeksUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfPriorTwoWeeksUTC().valueOf()) {
    return PRIOR_TWO_WEEKS;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastMonthUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfLastMonthUTC().valueOf()) {
    return LAST_MONTH;
  } else if (dateRange.beginDate.valueOf() === beginningOfPriorThreeMonthsUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfPriorThreeMonthsUTC().valueOf()) {
    return PRIOR_THREE_MONTHS;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastYearUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfLastYearUTC().valueOf()) {
    return LAST_YEAR;
  }
};

export const getRange = (when: string): any[] => {
  switch (when) {
    case TODAY:
    case YESTERDAY:
      return [1, 'days'];
    case THIS_WEEK:
    case LAST_WEEK:
      return [1, 'weeks'];
    case TWO_WEEKS:
    case PRIOR_TWO_WEEKS:
      return [2, 'weeks'];
    case THIS_MONTH:
    case LAST_MONTH:
      return [1, 'months'];
    case THREE_MONTHS:
    case PRIOR_THREE_MONTHS:
      return [3, 'months'];
    case THIS_YEAR:
    case LAST_YEAR:
      return [1, 'years'];
    default:
      break;
  }
};

export const getMillisecondsOfInterval = (interval: IntervalModel): number => {
  switch (interval) {
    case INTERVAL_15MIN:
      return 15 * 60 * 1000;
    case INTERVAL_HOURLY:
      return 60 * 60 * 1000;
    case INTERVAL_DAILY:
      return 24 * 60 * 60 * 1000;
    default:
      break;
  }
};

export const roundDateToInterval = (date: Date, interval: IntervalModel): Date => {
  const chunk = getMillisecondsOfInterval(interval);
  const remainder = date.valueOf() % chunk;
  if (remainder > 0) {
    return new Date(date.valueOf() - remainder);
  } else {
    return date;
  }
};
