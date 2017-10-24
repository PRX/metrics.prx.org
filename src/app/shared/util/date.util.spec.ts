import { isMoreThanXDays, beginningOfTodayUTC, endOfTodayUTC,
  beginningOfThisWeekUTC, beginningOfTwoWeeksUTC, beginningOfThisMonthUTC, beginningOfThreeMonthsUTC, beginningOfThisYearUTC,
  beginningOfYesterdayUTC, endOfYesterdayUTC, beginningOfLastWeekUTC, endOfLastWeekUTC,
  beginningOfPriorTwoWeeksUTC, endOfPriorTwoWeeksUTC, beginningOfLastMonthUTC, endOfLastMonthUTC,
  beginningOfPriorThreeMonthsUTC, endOfPriorThreeMonthsUTC, beginningOfLastYearUTC, endOfLastYearUTC,
  getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate, getRange, getMillisecondsOfInterval, roundDateToInterval } from './date.util';
import { DateRangeModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN,
  TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, TWO_WEEKS, PRIOR_TWO_WEEKS, THIS_MONTH, LAST_MONTH,
  THREE_MONTHS, PRIOR_THREE_MONTHS, THIS_YEAR, LAST_YEAR } from '../../ngrx/model';

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
    expect(getBeginEndDateFromStandardRange(TODAY).beginDate.valueOf()).toEqual(beginningOfTodayUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(TODAY).endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(THIS_YEAR).beginDate.valueOf()).toEqual(beginningOfThisYearUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(THIS_YEAR).endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_MONTH).beginDate.valueOf()).toEqual(beginningOfLastMonthUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_MONTH).endDate.valueOf()).toEqual(endOfLastMonthUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_YEAR).beginDate.valueOf()).toEqual(beginningOfLastYearUTC().valueOf());
    expect(getBeginEndDateFromStandardRange(LAST_YEAR).endDate.valueOf()).toEqual(endOfLastYearUTC().valueOf());
  });

  it('should get standard range from begin and end dates', () => {
    const thisWeek: DateRangeModel = {
      beginDate: beginningOfThisWeekUTC().toDate(),
      endDate: endOfTodayUTC().toDate()
    };
    if (thisWeek.beginDate.getUTCDate() === thisWeek.endDate.getUTCDate()) {
      expect(getStandardRangeForBeginEndDate(thisWeek)).toEqual(TODAY);
    } else {
      expect(getStandardRangeForBeginEndDate(thisWeek)).toEqual(THIS_WEEK);
    }
    const lastWeek: DateRangeModel = {
      beginDate: beginningOfLastWeekUTC().toDate(),
      endDate: endOfLastWeekUTC().toDate()
    };
    expect(getStandardRangeForBeginEndDate(lastWeek)).toEqual(LAST_WEEK);
  });

  it('should get range (to add/subtract with prev/next)', () => {
    expect(getRange(PRIOR_THREE_MONTHS)[0]).toEqual(3);
    expect(getRange(PRIOR_THREE_MONTHS)[1]).toEqual('months');
    expect(getRange(PRIOR_TWO_WEEKS)[0]).toEqual(2);
    expect(getRange(PRIOR_TWO_WEEKS)[1]).toEqual('weeks');
    expect(getRange(YESTERDAY)[0]).toEqual(1);
    expect(getRange(YESTERDAY)[1]).toEqual('days');
  });

  it('should get amount of milliseconds in interval', () => {
    expect(getMillisecondsOfInterval(INTERVAL_DAILY)).toEqual(24 * 60 * 60 * 1000);
  });

  it('should round begin date to beginning of interval', () => {
    const today = new Date();
    const daily = roundDateToInterval(today, INTERVAL_DAILY);
    const hourly = roundDateToInterval(today, INTERVAL_HOURLY);
    const fifteenMin = roundDateToInterval(today, INTERVAL_15MIN);
    expect(daily.valueOf()).toEqual(beginningOfTodayUTC().valueOf());
    expect(hourly.getHours()).toEqual(today.getHours());
    expect(hourly.getMinutes()).toEqual(0);
    expect(fifteenMin.getHours()).toEqual(today.getHours());
    expect(fifteenMin.getMinutes() % 15).toEqual(0);
  });

  it('YESTERDAY range should be the day before today', () => {
    const yesterday = getBeginEndDateFromStandardRange(YESTERDAY);
    expect(yesterday.beginDate.valueOf()).toEqual(beginningOfYesterdayUTC().valueOf());
    expect(yesterday.endDate.valueOf()).toBeLessThanOrEqual(endOfYesterdayUTC().valueOf());
    expect(yesterday.endDate.valueOf()).toBeLessThanOrEqual(beginningOfTodayUTC().valueOf());
  });

  it('TWO_WEEKS range should be two weeks starting on Sunday of last week not extending past today', () => {
    const twoWeeks = getBeginEndDateFromStandardRange(TWO_WEEKS);
    expect(twoWeeks.beginDate.getUTCDay()).toEqual(0);
    expect(twoWeeks.beginDate.valueOf()).toEqual(beginningOfTwoWeeksUTC().valueOf());
    expect(twoWeeks.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('PRIOR_TWO_WEEKS range should be the two weeks starting on Sunday of four weeks ago', () => {
    const priorTwoWeeks = getBeginEndDateFromStandardRange(PRIOR_TWO_WEEKS);
    expect(priorTwoWeeks.beginDate.getUTCDay()).toEqual(0);
    expect(priorTwoWeeks.beginDate.valueOf()).toEqual(beginningOfPriorTwoWeeksUTC().valueOf());
    expect(priorTwoWeeks.endDate.valueOf()).toBeLessThanOrEqual(endOfPriorTwoWeeksUTC().valueOf());
  });

  it('THIS_MONTH range should begin on the 1st of this month not extending past today', () => {
    const thisMonth = getBeginEndDateFromStandardRange(THIS_MONTH);
    expect(thisMonth.beginDate.getUTCDate()).toEqual(1);
    expect(thisMonth.beginDate.valueOf()).toEqual(beginningOfThisMonthUTC().valueOf());
    expect(thisMonth.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('THREE_MONTHS range should begin on the 1st of the month 3 months ago not extending past today', () => {
    const threeMonths = getBeginEndDateFromStandardRange(THREE_MONTHS);
    expect(threeMonths.beginDate.getUTCDate()).toEqual(1);
    expect(threeMonths.beginDate.valueOf()).toEqual(beginningOfThreeMonthsUTC().valueOf());
    expect(threeMonths.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('PRIOR_THREE_MONTHS range should begin on the 1st of the month 3 months ago not extending past today', () => {
    const threeMonths = getBeginEndDateFromStandardRange(PRIOR_THREE_MONTHS);
    expect(threeMonths.beginDate.getUTCDate()).toEqual(1);
    expect(threeMonths.beginDate.valueOf()).toEqual(beginningOfPriorThreeMonthsUTC().valueOf());
    expect(threeMonths.endDate.valueOf()).toBeLessThanOrEqual(endOfPriorThreeMonthsUTC().valueOf());
  });
});
