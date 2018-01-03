import * as moment from 'moment';
import { FilterModel, IntervalModel, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '../../ngrx';

export const THIS_WEEK = 'This week';
export const LAST_WEEK = 'Last week';
export const LAST_7_DAYS = 'Last 7 days';
export const THIS_WEEK_PLUS_7_DAYS = 'This week + 7 days';
export const THIS_MONTH = 'This month';
export const LAST_MONTH = 'Last month';
export const LAST_28_DAYS = 'Last 28 days';
export const LAST_30_DAYS = 'Last 30 days';
export const THIS_MONTH_PLUS_2_MONTHS = 'This month + 2 months';
export const LAST_90_DAYS = 'Last 90 days';
export const THIS_YEAR = 'This year';
export const LAST_365_DAYS = 'Last 365 days';
export const OTHER = 'Other';

export const isMoreThanXDays = (x: number, beginDate, endDate): boolean => {
  return endDate.valueOf() - beginDate.valueOf() > (1000 * 60 * 60 * 24 * x); // x days
};

export const beginningOfTodayUTC = () => {
  return moment().utc().hours(0).minutes(0).seconds(0).milliseconds(0);
};

export const endOfTodayUTC = () => {
  return moment().utc().hours(23).minutes(59).seconds(59).milliseconds(999);
};

export const endOfTodayHourlyUTC = () => {
  return moment().utc().hours(23).minutes(0).seconds(0).milliseconds(0);
};

export const beginningOfThisWeekUTC = () => {
  const utcDate = beginningOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return utcDate.subtract(daysIntoWeek, 'days');
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

export const endOfLastWeekHourlyUTC = () => {
  const utcDate = endOfTodayHourlyUTC();
  const daysIntoWeek = utcDate.day();
  return utcDate.subtract(daysIntoWeek + 1, 'days');
};

export const beginningOfLast7DaysUTC = () => {
  return beginningOfTodayUTC().subtract(7, 'days');
};

export const beginningOfThisWeekPlus7DaysUTC = () => {
  const utcDate = beginningOfTodayUTC();
  const daysIntoWeek = utcDate.day();
  return beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days');
};

export const beginningOfThisMonthUTC = () => {
  return beginningOfTodayUTC().date(1);
};

export const beginningOfLastMonthUTC = () => {
  return beginningOfTodayUTC().date(1).subtract(1, 'months'); // 1st of month - 1 month
};

export const endOfLastMonthUTC = () => {
  return endOfTodayUTC().date(1).subtract(1, 'days'); // 1st of month - 1 day
};

export const endOfLastMonthHourlyUTC = () => {
  return endOfTodayHourlyUTC().date(1).subtract(1, 'days'); // 1st of month - 1 day
};

export const beginningOfLast28DaysUTC = () => {
  return beginningOfTodayUTC().subtract(28, 'days');
};

export const beginningOfLast30DaysUTC = () => {
  return beginningOfTodayUTC().subtract(30, 'days');
};

export const beginningOfThisMonthPlusTwoMonthsUTC = () => {
  return beginningOfTodayUTC().date(1).subtract(2, 'months');
};

export const beginningOfLast90DaysUTC = () => {
  return beginningOfTodayUTC().subtract(90, 'days');
};

export const beginningOfThisYearUTC = () => {
  return beginningOfTodayUTC().month(0).date(1);
};

export const beginningOfLast365DaysUTC = () => {
  return beginningOfTodayUTC().subtract(365, 'days');
};

export const getBeginEndDateFromStandardRange = (standardRange: string): {beginDate: Date, endDate: Date} => {
  switch (standardRange) {
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
    case LAST_7_DAYS:
      return {
        beginDate: beginningOfLast7DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case THIS_WEEK_PLUS_7_DAYS:
      return {
        beginDate: beginningOfThisWeekPlus7DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
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
    case LAST_28_DAYS:
      return {
        beginDate: beginningOfLast28DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case LAST_30_DAYS:
      return {
        beginDate: beginningOfLast30DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case THIS_MONTH_PLUS_2_MONTHS:
      return {
        beginDate: beginningOfThisMonthPlusTwoMonthsUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case LAST_90_DAYS:
      return {
        beginDate: beginningOfLast90DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case THIS_YEAR:
      return {
        beginDate: beginningOfThisYearUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case LAST_365_DAYS:
      return {
        beginDate: beginningOfLast365DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    default:
      break;
  }
};

export const getStandardRangeForBeginEndDate = (dateRange: FilterModel) => {
  if (dateRange.beginDate.valueOf() === beginningOfThisWeekUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_WEEK;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastWeekUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfLastWeekUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfLastWeekHourlyUTC().valueOf()))) {
    return LAST_WEEK;
  } else if (dateRange.beginDate.valueOf() === beginningOfLast7DaysUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return LAST_7_DAYS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisWeekPlus7DaysUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_WEEK_PLUS_7_DAYS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisMonthUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_MONTH;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastMonthUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfLastMonthUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfLastMonthHourlyUTC().valueOf()))) {
    return LAST_MONTH;
  } else if (dateRange.beginDate.valueOf() === beginningOfLast28DaysUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return LAST_28_DAYS;
  } else if (dateRange.beginDate.valueOf() === beginningOfLast30DaysUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return LAST_30_DAYS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisMonthPlusTwoMonthsUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_MONTH_PLUS_2_MONTHS;
  } else if (dateRange.beginDate.valueOf() === beginningOfLast90DaysUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return LAST_90_DAYS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisYearUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_YEAR;
  } else if (dateRange.beginDate.valueOf() === beginningOfLast365DaysUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return LAST_365_DAYS;
  } else {
    return OTHER;
  }
};

export const getMillisecondsOfInterval = (interval: IntervalModel): number => {
  switch (interval) {
    case INTERVAL_HOURLY:
      return 60 * 60 * 1000;
    case INTERVAL_DAILY:
      return 24 * 60 * 60 * 1000;
    case INTERVAL_WEEKLY:
      // here for completion but not actually used to round weekly dates
      return 7 * 24 * 60 * 60 * 1000;
    case INTERVAL_MONTHLY:
      // varies, not used
    default:
      break;
  }
};

export const roundDateToBeginOfInterval = (date: Date, interval: IntervalModel): Date => {
  if (interval === INTERVAL_MONTHLY) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
  } else if (interval === INTERVAL_WEEKLY) {
    const daysIntoWeek = date.getUTCDay();
    // if date goes negative, the overflow gets normalized
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - daysIntoWeek, 0, 0, 0, 0));
  } else {
    const chunk = getMillisecondsOfInterval(interval);
    const remainder = date.valueOf() % chunk;
    if (remainder > 0) {
      return new Date(date.valueOf() - remainder);
    } else {
      return date;
    }
  }
};

export const roundDateToEndOfInterval = (date: Date, interval: IntervalModel): Date => {
  if (interval === INTERVAL_MONTHLY) {
    return moment.min(
      moment(date.valueOf()).utc()
      .add(1, 'months')
      .date(1).hours(23).minutes(59).seconds(59).milliseconds(999)
      .subtract(1, 'days'),
      endOfTodayUTC()).toDate();
  } else if (interval === INTERVAL_WEEKLY) {
    const daysIntoWeek = date.getUTCDay();
    // if date goes negative, the overflow gets normalized
    return moment.min(
      moment(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + (6 - daysIntoWeek), 23, 59, 59, 999)).utc(),
      endOfTodayUTC()).toDate();
  } else if (interval === INTERVAL_DAILY) {
    return moment.min(
      moment(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999)).utc(),
      endOfTodayUTC()).toDate();
  } else {
    // hourly data should just show the beginning of the interval
    // (and there is where extracting these helper functions could lead to later trouble...)
    return roundDateToBeginOfInterval(date, interval);
  }
};

export const getAmountOfIntervals = (beginDate: Date, endDate: Date, interval: IntervalModel): number => {
  const duration = roundDateToBeginOfInterval(endDate, interval).valueOf() - roundDateToBeginOfInterval(beginDate, interval).valueOf();
  // plus 1 because we actually want number of data points in duration, i.e. hourly 23 - 0 is 24 data points
  switch (interval) {
    case INTERVAL_HOURLY:
      return 1 + (duration / (1000 * 60 * 60));
    case INTERVAL_DAILY:
      return 1 + (duration / (1000 * 60 * 60 * 24));
    case INTERVAL_WEEKLY:
      return 1 + (duration / (1000 * 60 * 60 * 24 * 7));
    case INTERVAL_MONTHLY:
      return 1 + (12 * endDate.getUTCFullYear() - 12 * beginDate.getUTCFullYear()) + (endDate.getUTCMonth() - beginDate.getUTCMonth());
    default:
      break;
  }
};

export const UTCDateFormat = (date: Date): string => {
  return date.toUTCString();
};

export const dayOfWeekDateFormat = (date: Date | moment.Moment): string => {
  return moment(date).utc().format('ddd MMM D');
};

export const dayMonthDateFormat = (date: Date | moment.Moment): string => {
  return  moment(date).utc().format('MMM D');
};

export const monthDateYearFormat = (date: Date | moment.Moment, separator = true): string => {
  if (separator) {
    return moment(date).utc().format('MMM D, YYYY');
  } else {
    return moment(date).utc().format('MMM D YYYY');
  }
};

export const monthYearFormat = (date: Date): string => {
  return moment(date).utc().format('MMM YYYY');
};

export const hourlyDateFormat = (date: Date): string => {
  return moment(date).format('MMM D, h:mm A');
};
