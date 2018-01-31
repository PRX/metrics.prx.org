import * as dateUtil from './date.util';
import * as dateConst from './date.constants';
import { INTERVAL_DAILY, INTERVAL_HOURLY } from '../../../ngrx';

describe('date util', () => {
  it('should tell us if dates are more than a specified number of days apart', () => {
    expect(dateUtil.isMoreThanXDays(10, new Date(2017, 0, 1), new Date(2017, 0, 12))).toBe(true);
  });

  it('should return a moment set to the beginning of the current day in UTC', () => {
    expect(dateUtil.beginningOfTodayUTC().year()).toBe(new Date().getUTCFullYear());
    expect(dateUtil.beginningOfTodayUTC().month()).toBe(new Date().getUTCMonth());
    expect(dateUtil.beginningOfTodayUTC().date()).toBe(new Date().getUTCDate());
    expect(dateUtil.beginningOfTodayUTC().hours()).toBe(0);
    expect(dateUtil.beginningOfTodayUTC().minutes()).toBe(0);
    expect(dateUtil.beginningOfTodayUTC().seconds()).toBe(0);
    expect(dateUtil.beginningOfTodayUTC().milliseconds()).toBe(0);
  });

  it('should return a moment set to the end of the current day in UTC', () => {
    expect(dateUtil.endOfTodayUTC().year()).toBe(new Date().getUTCFullYear());
    expect(dateUtil.endOfTodayUTC().month()).toBe(new Date().getUTCMonth());
    expect(dateUtil.endOfTodayUTC().date()).toBe(new Date().getUTCDate());
    expect(dateUtil.endOfTodayUTC().hours()).toBe(23);
    expect(dateUtil.endOfTodayUTC().minutes()).toBe(59);
    expect(dateUtil.endOfTodayUTC().seconds()).toBe(59);
    expect(dateUtil.endOfTodayUTC().milliseconds()).toBe(999);
  });

  it('should get begin and end dates from standard range', () => {
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.THIS_WEEK).beginDate.valueOf())
      .toEqual(dateUtil.beginningOfThisWeekUTC().valueOf());
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.THIS_WEEK).endDate.valueOf())
      .toEqual(dateUtil.endOfTodayUTC().valueOf());
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.THIS_YEAR).beginDate.valueOf())
      .toEqual(dateUtil.beginningOfThisYearUTC().valueOf());
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.THIS_YEAR).endDate.valueOf())
      .toEqual(dateUtil.endOfTodayUTC().valueOf());
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_MONTH).beginDate.valueOf())
      .toEqual(dateUtil.beginningOfLastMonthUTC().valueOf());
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_MONTH).endDate.valueOf())
      .toEqual(dateUtil.endOfLastMonthUTC().valueOf());
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_90_DAYS).beginDate.valueOf())
      .toEqual(dateUtil.beginningOfLast90DaysUTC().valueOf());
    expect(dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_90_DAYS).endDate.valueOf())
      .toEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('should get standard range from begin and end dates', () => {
    const thisWeek = {
      beginDate: dateUtil.beginningOfThisWeekUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate()
    };
    expect(dateUtil.getStandardRangeForBeginEndDate(thisWeek.beginDate, thisWeek.endDate)).toEqual(dateConst.THIS_WEEK);
    const lastWeek = {
      beginDate: dateUtil.beginningOfLastWeekUTC().toDate(),
      endDate: dateUtil.endOfLastWeekUTC().toDate()
    };
    expect(dateUtil.getStandardRangeForBeginEndDate(lastWeek.beginDate, lastWeek.endDate)).toEqual(dateConst.LAST_WEEK);
    const other = {
      beginDate: dateUtil.beginningOfTodayUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate()
    };
    // TODAY is no longer a valid option, so should match OTHER
    expect(dateUtil.getStandardRangeForBeginEndDate(other.beginDate, other.endDate)).toEqual(dateConst.OTHER);
  });

  it('should get amount of milliseconds in interval', () => {
    expect(dateUtil.getMillisecondsOfInterval(INTERVAL_DAILY)).toEqual(24 * 60 * 60 * 1000);
  });

  it('should round date to beginning of interval', () => {
    const today = new Date();
    const daily = dateUtil.roundDateToBeginOfInterval(today, INTERVAL_DAILY);
    const hourly = dateUtil.roundDateToBeginOfInterval(today, INTERVAL_HOURLY);
    expect(daily.valueOf()).toEqual(dateUtil.beginningOfTodayUTC().valueOf());
    expect(hourly.getHours()).toEqual(today.getHours());
    expect(hourly.getMinutes()).toEqual(0);
  });

  it('LAST_7_DAYS range should be 6 days ago through today', () => {
    const last7Days = dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_7_DAYS);
    expect(last7Days.beginDate.valueOf()).toEqual(dateUtil.beginningOfLast7DaysUTC().valueOf());
    expect(last7Days.endDate.valueOf()).toEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('THIS_WEEK_PLUS_7_DAYS range should be two weeks starting on Sunday of last week not extending past today', () => {
    const twoWeeks = dateUtil.getBeginEndDateFromStandardRange(dateConst.THIS_WEEK_PLUS_7_DAYS);
    expect(twoWeeks.beginDate.getUTCDay()).toEqual(0);
    expect(twoWeeks.beginDate.valueOf()).toEqual(dateUtil.beginningOfThisWeekPlus7DaysUTC().valueOf());
    expect(twoWeeks.endDate.valueOf()).toEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('LAST_28_DAYS range should be 27 days ago through today', () => {
    const last28Days = dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_28_DAYS);
    expect(last28Days.beginDate.valueOf()).toEqual(dateUtil.beginningOfLast28DaysUTC().valueOf());
    expect(last28Days.endDate.valueOf()).toEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('LAST_30_DAYS range should be 29 days ago through today', () => {
    const last30Days = dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_30_DAYS);
    expect(last30Days.beginDate.valueOf()).toEqual(dateUtil.beginningOfLast30DaysUTC().valueOf());
    expect(last30Days.endDate.valueOf()).toEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('THIS_MONTH range should begin on the 1st of this month not extending past today', () => {
    const thisMonth = dateUtil.getBeginEndDateFromStandardRange(dateConst.THIS_MONTH);
    expect(thisMonth.beginDate.getUTCDate()).toEqual(1);
    expect(thisMonth.beginDate.valueOf()).toEqual(dateUtil.beginningOfThisMonthUTC().valueOf());
    expect(thisMonth.endDate.valueOf()).toBeLessThanOrEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('THIS_MONTH_PLUS_2_MONTHS range should begin on the 1st of the month 3 months ago not extending past today', () => {
    const threeMonths = dateUtil.getBeginEndDateFromStandardRange(dateConst.THIS_MONTH_PLUS_2_MONTHS);
    expect(threeMonths.beginDate.getUTCDate()).toEqual(1);
    expect(threeMonths.beginDate.valueOf()).toEqual(dateUtil.beginningOfThisMonthPlusTwoMonthsUTC().valueOf());
    expect(threeMonths.endDate.valueOf()).toEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('LAST_365_DAYS range should be 364 days ago through today', () => {
    const last365Days = dateUtil.getBeginEndDateFromStandardRange(dateConst.LAST_365_DAYS);
    expect(last365Days.beginDate.valueOf()).toEqual(dateUtil.beginningOfLast365DaysUTC().valueOf());
    expect(last365Days.endDate.valueOf()).toEqual(dateUtil.endOfTodayUTC().valueOf());
  });

  it('should get the amount of intervals (data points) there are expected to be from begin to end date', () => {
    const today =
      dateUtil.getAmountOfIntervals(dateUtil.beginningOfTodayUTC().toDate(), dateUtil.endOfTodayUTC().toDate(), INTERVAL_HOURLY);
    expect(today).toEqual(24);
    const lastWeek =
      dateUtil.getAmountOfIntervals(dateUtil.beginningOfLastWeekUTC().toDate(), dateUtil.endOfLastWeekUTC().toDate(), INTERVAL_DAILY);
    expect(lastWeek).toEqual(7);
  });
});
