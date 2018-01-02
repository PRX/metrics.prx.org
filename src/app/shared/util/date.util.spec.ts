import { isMoreThanXDays, beginningOfTodayUTC, endOfTodayUTC,
  beginningOfThisWeekUTC, beginningOfLastWeekUTC, endOfLastWeekUTC, beginningOfLast7DaysUTC,
  beginningOfThisWeekPlus7DaysUTC,
  beginningOfThisMonthUTC, beginningOfLastMonthUTC, endOfLastMonthUTC, beginningOfLast28DaysUTC, beginningOfLast30DaysUTC,
  beginningOfThisMonthPlusTwoMonthsUTC, beginningOfLast90DaysUTC,
  beginningOfThisYearUTC, beginningOfLast365DaysUTC,
  getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate, getMillisecondsOfInterval,
  roundDateToBeginOfInterval, roundDateToEndOfInterval, getAmountOfIntervals,
  UTCDateFormat, dayOfWeekDateFormat, dayMonthDateFormat, monthDateYearFormat, monthYearFormat, hourlyDateFormat,
  THIS_WEEK, LAST_WEEK, LAST_7_DAYS, THIS_WEEK_PLUS_7_DAYS, THIS_MONTH, LAST_MONTH, LAST_28_DAYS, LAST_30_DAYS,
  THIS_MONTH_PLUS_2_MONTHS, LAST_90_DAYS, THIS_YEAR, LAST_365_DAYS, OTHER } from './date.util';
import { FilterModel, INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx';

describe('date util', () => {
  it('should tell us if dates are more than a specified number of days apart', () => {
    expect(isMoreThanXDays(10, new Date(2017, 0, 1), new Date(2017, 0, 12))).toBe(true);
  });

  it('should return a moment set to the beginning of the current day in UTC', () => {
    expect(beginningOfTodayUTC().year()).toBe(new Date().getUTCFullYear());
    expect(beginningOfTodayUTC().month()).toBe(new Date().getUTCMonth());
    expect(beginningOfTodayUTC().date()).toBe(new Date().getUTCDate());
    expect(beginningOfTodayUTC().hours()).toBe(0);
    expect(beginningOfTodayUTC().minutes()).toBe(0);
    expect(beginningOfTodayUTC().seconds()).toBe(0);
    expect(beginningOfTodayUTC().milliseconds()).toBe(0);
  });

  it('should return a moment set to the end of the current day in UTC', () => {
    expect(endOfTodayUTC().year()).toBe(new Date().getUTCFullYear());
    expect(endOfTodayUTC().month()).toBe(new Date().getUTCMonth());
    expect(endOfTodayUTC().date()).toBe(new Date().getUTCDate());
    expect(endOfTodayUTC().hours()).toBe(23);
    expect(endOfTodayUTC().minutes()).toBe(59);
    expect(endOfTodayUTC().seconds()).toBe(59);
    expect(endOfTodayUTC().milliseconds()).toBe(999);
  });

  it('should get begin and end dates from standard range', () => {
    expect(getBeginEndDateFromStandardRange(THIS_WEEK).beginDate.valueOf()).toEqual(beginningOfThisWeekUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(THIS_WEEK).endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(THIS_YEAR).beginDate.valueOf()).toEqual(beginningOfThisYearUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(THIS_YEAR).endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_MONTH).beginDate.valueOf()).toEqual(beginningOfLastMonthUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_MONTH).endDate.valueOf()).toEqual(endOfLastMonthUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_90_DAYS).beginDate.valueOf()).toEqual(beginningOfLast90DaysUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_90_DAYS).endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('should get standard range from begin and end dates', () => {
    const thisWeek: FilterModel = {
      interval: INTERVAL_DAILY,
      beginDate: beginningOfThisWeekUTC().toDate(),
      endDate: endOfTodayUTC().toDate()
    };
    expect(getStandardRangeForBeginEndDate(thisWeek)).toEqual(THIS_WEEK);
    const lastWeek: FilterModel = {
      interval: INTERVAL_DAILY,
      beginDate: beginningOfLastWeekUTC().toDate(),
      endDate: endOfLastWeekUTC().toDate()
    };
    expect(getStandardRangeForBeginEndDate(lastWeek)).toEqual(LAST_WEEK);
    const other: FilterModel = {
      interval: INTERVAL_DAILY,
      beginDate: beginningOfTodayUTC().toDate(),
      endDate: endOfTodayUTC().toDate()
    };
    // TODAY is no longer a valid option, so should match OTHER
    expect(getStandardRangeForBeginEndDate(other)).toEqual(OTHER);
  });

  it('should get amount of milliseconds in interval', () => {
    expect(getMillisecondsOfInterval(INTERVAL_DAILY)).toEqual(24 * 60 * 60 * 1000);
  });

  it('should round date to beginning of interval', () => {
    const today = new Date();
    const daily = roundDateToBeginOfInterval(today, INTERVAL_DAILY);
    const hourly = roundDateToBeginOfInterval(today, INTERVAL_HOURLY);
    expect(daily.valueOf()).toEqual(beginningOfTodayUTC().valueOf());
    expect(hourly.getHours()).toEqual(today.getHours());
    expect(hourly.getMinutes()).toEqual(0);
  });

  describe('roundDateToEndOfInterval', () => {
    it('should round date to end of interval', () => {
      expect(roundDateToEndOfInterval(beginningOfLastWeekUTC().toDate(), INTERVAL_WEEKLY).valueOf()).toEqual(endOfLastWeekUTC().valueOf());
    });
    it('except for dates in the present, which should be rounded to the end of today utc', () => {
      expect(roundDateToEndOfInterval(beginningOfThisMonthUTC().toDate(), INTERVAL_MONTHLY).valueOf()).toEqual(endOfTodayUTC().valueOf());
    });
    it('except for hourly and 15m, which should be rounded to the beginning of the interval', () => {
      expect(roundDateToEndOfInterval(new Date(2017, 9, 27, 8, 32), INTERVAL_HOURLY).getMinutes()).toEqual(0);
    });
    it('dates in the future will be rounded to end of today UTC', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(roundDateToEndOfInterval(future, INTERVAL_DAILY).valueOf()).toEqual(endOfTodayUTC().valueOf());
      expect(roundDateToEndOfInterval(future, INTERVAL_WEEKLY).valueOf()).toEqual(endOfTodayUTC().valueOf());
      expect(roundDateToEndOfInterval(future, INTERVAL_MONTHLY).valueOf()).toEqual(endOfTodayUTC().valueOf());
    });
  });

  it('LAST_7_DAYS range should be 7 days ago through today', () => {
    const last7Days = getBeginEndDateFromStandardRange(LAST_7_DAYS);
    expect(last7Days.beginDate.valueOf()).toEqual(beginningOfLast7DaysUTC().valueOf());
    expect(last7Days.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('THIS_WEEK_PLUS_7_DAYS range should be two weeks starting on Sunday of last week not extending past today', () => {
    const twoWeeks = getBeginEndDateFromStandardRange(THIS_WEEK_PLUS_7_DAYS);
    expect(twoWeeks.beginDate.getUTCDay()).toEqual(0);
    expect(twoWeeks.beginDate.valueOf()).toEqual(beginningOfThisWeekPlus7DaysUTC().valueOf());
    expect(twoWeeks.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('LAST_28_DAYS range should be 28 days ago through today', () => {
    const last28Days = getBeginEndDateFromStandardRange(LAST_28_DAYS);
    expect(last28Days.beginDate.valueOf()).toEqual(beginningOfLast28DaysUTC().valueOf());
    expect(last28Days.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('LAST_30_DAYS range should be 30 days ago through today', () => {
    const last30Days = getBeginEndDateFromStandardRange(LAST_30_DAYS);
    expect(last30Days.beginDate.valueOf()).toEqual(beginningOfLast30DaysUTC().valueOf());
    expect(last30Days.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('THIS_MONTH range should begin on the 1st of this month not extending past today', () => {
    const thisMonth = getBeginEndDateFromStandardRange(THIS_MONTH);
    expect(thisMonth.beginDate.getUTCDate()).toEqual(1);
    expect(thisMonth.beginDate.valueOf()).toEqual(beginningOfThisMonthUTC().valueOf());
    expect(thisMonth.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('THIS_MONTH_PLUS_2_MONTHS range should begin on the 1st of the month 3 months ago not extending past today', () => {
    const threeMonths = getBeginEndDateFromStandardRange(THIS_MONTH_PLUS_2_MONTHS);
    expect(threeMonths.beginDate.getUTCDate()).toEqual(1);
    expect(threeMonths.beginDate.valueOf()).toEqual(beginningOfThisMonthPlusTwoMonthsUTC().valueOf());
    expect(threeMonths.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('LAST_365_DAYS range should be 365 days ago through today', () => {
    const last365Days = getBeginEndDateFromStandardRange(LAST_365_DAYS);
    expect(last365Days.beginDate.valueOf()).toEqual(beginningOfLast365DaysUTC().valueOf());
    expect(last365Days.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('should get the amount of intervals (data points) there are expected to be from begin to end date', () => {
    expect(getAmountOfIntervals(beginningOfTodayUTC().toDate(), endOfTodayUTC().toDate(), INTERVAL_HOURLY)).toEqual(24);
    expect(getAmountOfIntervals(beginningOfLastWeekUTC().toDate(), endOfLastWeekUTC().toDate(), INTERVAL_DAILY)).toEqual(7);
  });

  it('should format dates in UTC', () => {
    const date = new Date();
    let utcString = UTCDateFormat(date);
    const search = utcString.match(/..:..:../);
    expect(parseInt(utcString.slice(search.index, search.index + 2), 10)).toEqual(date.getUTCHours());
    utcString = dayOfWeekDateFormat(date);
    expect(parseInt(utcString.slice(utcString.lastIndexOf(' ') + 1), 10)).toEqual(date.getUTCDate());
    utcString = dayMonthDateFormat(date);
    expect(parseInt(utcString.slice(utcString.indexOf(' ') + 1), 10)).toEqual(date.getUTCDate());
    utcString = monthDateYearFormat(date);
    expect(parseInt(utcString.slice(utcString.indexOf(' ') + 1), 10)).toEqual(date.getUTCDate());
    utcString = monthYearFormat(date);
    expect(parseInt(utcString.slice(utcString.indexOf(' ') + 1), 10)).toEqual(date.getUTCFullYear());
  });

  it('should format hourly dates in local timezone', () => {
    const date = new Date();
    const dateString = hourlyDateFormat(date);
    let hours;
    if (date.getHours() === 0) {
      hours = 12;
    } else if (date.getHours() > 12) {
      hours = date.getHours() % 12;
    } else {
      hours = date.getHours();
    }
    expect(parseInt(dateString.slice(dateString.indexOf(', ') + 1), 10)).toEqual(hours);
  });
});
