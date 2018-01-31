import * as moment from 'moment';
import * as dateConst from './date.constants';
import { IntervalModel, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '../../../ngrx';

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

export const beginningOfLast7DaysUTC = () => {
  return beginningOfTodayUTC().subtract(6, 'days');
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

export const beginningOfLast28DaysUTC = () => {
  return beginningOfTodayUTC().subtract(27, 'days');
};

export const beginningOfLast30DaysUTC = () => {
  return beginningOfTodayUTC().subtract(29, 'days');
};

export const beginningOfThisMonthPlusTwoMonthsUTC = () => {
  return beginningOfTodayUTC().date(1).subtract(2, 'months');
};

export const beginningOfLast90DaysUTC = () => {
  return beginningOfTodayUTC().subtract(89, 'days');
};

export const beginningOfThisYearUTC = () => {
  return beginningOfTodayUTC().month(0).date(1);
};

export const beginningOfLast365DaysUTC = () => {
  return beginningOfTodayUTC().subtract(364, 'days');
};

export const getBeginEndDateFromStandardRange = (standardRange: string): {beginDate: Date, endDate: Date} => {
  switch (standardRange) {
    case dateConst.THIS_WEEK:
      return {
        beginDate: beginningOfThisWeekUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.LAST_WEEK:
      return {
        beginDate: beginningOfLastWeekUTC().toDate(),
        endDate: endOfLastWeekUTC().toDate()
      };
    case dateConst.LAST_7_DAYS:
      return {
        beginDate: beginningOfLast7DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.THIS_WEEK_PLUS_7_DAYS:
      return {
        beginDate: beginningOfThisWeekPlus7DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.THIS_MONTH:
      return {
        beginDate: beginningOfThisMonthUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.LAST_MONTH:
      return {
        beginDate: beginningOfLastMonthUTC().toDate(),
        endDate: endOfLastMonthUTC().toDate()
      };
    case dateConst.LAST_28_DAYS:
      return {
        beginDate: beginningOfLast28DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.LAST_30_DAYS:
      return {
        beginDate: beginningOfLast30DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.THIS_MONTH_PLUS_2_MONTHS:
      return {
        beginDate: beginningOfThisMonthPlusTwoMonthsUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.LAST_90_DAYS:
      return {
        beginDate: beginningOfLast90DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.THIS_YEAR:
      return {
        beginDate: beginningOfThisYearUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    case dateConst.LAST_365_DAYS:
      return {
        beginDate: beginningOfLast365DaysUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
    default:
      break;
  }
};

export const getStandardRangeForBeginEndDate = (beginDate: Date, endDate: Date) => {
  if (beginDate.valueOf() === beginningOfThisWeekUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.THIS_WEEK;
  } else if (beginDate.valueOf() === beginningOfLastWeekUTC().valueOf() &&
    endDate.valueOf() === endOfLastWeekUTC().valueOf()) {
    return dateConst.LAST_WEEK;
  } else if (beginDate.valueOf() === beginningOfLast7DaysUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.LAST_7_DAYS;
  } else if (beginDate.valueOf() === beginningOfThisWeekPlus7DaysUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.THIS_WEEK_PLUS_7_DAYS;
  } else if (beginDate.valueOf() === beginningOfThisMonthUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.THIS_MONTH;
  } else if (beginDate.valueOf() === beginningOfLastMonthUTC().valueOf() &&
    endDate.valueOf() === endOfLastMonthUTC().valueOf()) {
    return dateConst.LAST_MONTH;
  } else if (beginDate.valueOf() === beginningOfLast28DaysUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.LAST_28_DAYS;
  } else if (beginDate.valueOf() === beginningOfLast30DaysUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.LAST_30_DAYS;
  } else if (beginDate.valueOf() === beginningOfThisMonthPlusTwoMonthsUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.THIS_MONTH_PLUS_2_MONTHS;
  } else if (beginDate.valueOf() === beginningOfLast90DaysUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.LAST_90_DAYS;
  } else if (beginDate.valueOf() === beginningOfThisYearUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.THIS_YEAR;
  } else if (beginDate.valueOf() === beginningOfLast365DaysUTC().valueOf() &&
    endDate.valueOf() === endOfTodayUTC().valueOf()) {
    return dateConst.LAST_365_DAYS;
  } else {
    return dateConst.OTHER;
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
