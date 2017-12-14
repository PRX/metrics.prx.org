import * as moment from 'moment';
import { FilterModel, IntervalModel, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '../../ngrx';

export const TODAY = 'Today';
export const THIS_WEEK = 'This week';
export const TWO_WEEKS = '2 weeks';
export const THIS_MONTH = 'This month';
export const THREE_MONTHS = '3 months';
export const THIS_YEAR = 'This year';
export const YESTERDAY = 'Yesterday';
export const LAST_WEEK = 'Last week';
export const PRIOR_TWO_WEEKS = 'Prior 2 weeks';
export const LAST_MONTH = 'Last month';
export const PRIOR_THREE_MONTHS = 'Prior 3 months';
export const LAST_YEAR = 'Last year';

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

export const endOfYesterdayHourlyUTC = () => {
  return endOfTodayHourlyUTC().subtract(1, 'days');
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

export const endOfPriorTwoWeeksHourlyUTC = () => {
  const utcDate = endOfTodayHourlyUTC();
  const daysIntoWeek = utcDate.day();
  return utcDate.subtract(daysIntoWeek + 8, 'days');
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

export const getBeginEndDateFromStandardRange = (standardRange: string): {beginDate: Date, endDate: Date} => {
  switch (standardRange) {
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

export const getStandardRangeForBeginEndDate = (dateRange: FilterModel) => {
  if (dateRange.beginDate.valueOf() === beginningOfTodayUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return TODAY;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisWeekUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_WEEK;
  } else if (dateRange.beginDate.valueOf() === beginningOfTwoWeeksUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return TWO_WEEKS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisMonthUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_MONTH;
  } else if (dateRange.beginDate.valueOf() === beginningOfThreeMonthsUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THREE_MONTHS;
  } else if (dateRange.beginDate.valueOf() === beginningOfThisYearUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfTodayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfTodayHourlyUTC().valueOf()))) {
    return THIS_YEAR;
  } else if (dateRange.beginDate.valueOf() === beginningOfYesterdayUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfYesterdayUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfYesterdayHourlyUTC().valueOf()))) {
    return YESTERDAY;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastWeekUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfLastWeekUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfLastWeekHourlyUTC().valueOf()))) {
    return LAST_WEEK;
  } else if (dateRange.beginDate.valueOf() === beginningOfPriorTwoWeeksUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfLastWeekUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfPriorTwoWeeksHourlyUTC().valueOf()))) {
    return PRIOR_TWO_WEEKS;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastMonthUTC().valueOf() &&
    (dateRange.endDate.valueOf() === endOfLastMonthUTC().valueOf() ||
    (dateRange.interval === INTERVAL_HOURLY && dateRange.endDate.valueOf() === endOfLastMonthHourlyUTC().valueOf()))) {
    return LAST_MONTH;
  } else if (dateRange.beginDate.valueOf() === beginningOfPriorThreeMonthsUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfPriorThreeMonthsUTC().valueOf()) {
    return PRIOR_THREE_MONTHS;
  } else if (dateRange.beginDate.valueOf() === beginningOfLastYearUTC().valueOf() &&
    dateRange.endDate.valueOf() === endOfLastYearUTC().valueOf()) {
    return LAST_YEAR;
  }
};

export const getRange = (standardRange: string): any[] => {
  switch (standardRange) {
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

export const dayOfWeekDateFormat = (date: Date): string => {
  const dayOfWeek = (day: number): string => {
    switch (day) {
      case 0:
        return 'Sun';
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
    }
  };
  const month = moment(date).utc().format('MMM');
  return dayOfWeek(date.getUTCDay()) + ', ' + month + ' ' + date.getUTCDate();
};

export const dayMonthDateFormat = (date: Date): string => {
  const month = moment(date).utc().format('MMM');
  return month + ' ' + date.getUTCDate();
};

export const monthDateYearFormat = (date: Date): string => {
  const month = moment(date).utc().format('MMM');
  return month + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();
};

export const monthYearFormat = (date: Date): string => {
  const month = moment(date).utc().format('MMM');
  return month + ' ' + date.getUTCFullYear();
};

export const hourlyDateFormat = (date: Date): string => {
  let time;
  const hours = date.getHours();
  if (hours === 0) {
    time = '12:00 AM';
  } else if (hours > 12) {
    time = hours % 12 + ':00 PM';
  } else {
    time = hours + ':00 AM';
  }
  const month = moment(date).format('MMM');

  return month + ' ' + date.getDate() + ', ' + time;
};
