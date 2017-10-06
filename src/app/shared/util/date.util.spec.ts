import { isMoreThanXDays, beginningOfTodayUTC, endOfTodayUTC } from './date.util';

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
});
