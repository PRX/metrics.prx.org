import * as filterUtil from './filter.util';
import { INTERVAL_DAILY, INTERVAL_MONTHLY } from '../../ngrx';
import * as dateUtil from './date/date.util';

describe('filter.util', () => {
  it('should check if podcast changed', () => {
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, {})).toBeTruthy();
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, undefined)).toBeTruthy();
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, {podcastSeriesId: 1234})).toBeTruthy();
    expect(filterUtil.isPodcastChanged(undefined, undefined)).toBeFalsy();
    expect(filterUtil.isPodcastChanged(undefined, {podcastSeriesId: 1234})).toBeFalsy();
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, {podcastSeriesId: 123})).toBeFalsy();
  });

  it ('should check if episodes changed', () => {
    expect(filterUtil.isEpisodesChanged({episodePage: 1}, {})).toBeTruthy();
    expect(filterUtil.isEpisodesChanged({episodePage: 1}, undefined)).toBeTruthy();
    expect(filterUtil.isEpisodesChanged({episodePage: 1}, {episodePage: 2})).toBeTruthy();
    expect(filterUtil.isEpisodesChanged(undefined, undefined)).toBeFalsy();
    expect(filterUtil.isEpisodesChanged(undefined, {episodePage: 1})).toBeFalsy();
    expect(filterUtil.isEpisodesChanged({episodePage: 1}, {episodePage: 1})).toBeFalsy();
  });

  it('should check if interval changed', () => {
    expect(filterUtil.isIntervalChanged({interval: INTERVAL_DAILY}, {interval: INTERVAL_MONTHLY})).toBeTruthy();
    expect(filterUtil.isIntervalChanged({interval: INTERVAL_DAILY}, {interval: INTERVAL_DAILY})).toBeFalsy();
    expect(filterUtil.isIntervalChanged({interval: INTERVAL_DAILY}, {})).toBeTruthy();
    expect(filterUtil.isIntervalChanged({}, {})).toBeFalsy();
  });

  it('should check if begin date changed', () => {
    expect(filterUtil.isBeginDateChanged({beginDate: dateUtil.beginningOfTodayUTC().toDate()},
      {beginDate: dateUtil.beginningOfLastWeekUTC().toDate()})).toBeTruthy();
    expect(filterUtil.isBeginDateChanged({beginDate: dateUtil.beginningOfTodayUTC().toDate()},
      {beginDate: dateUtil.beginningOfTodayUTC().toDate()})).toBeFalsy();
    expect(filterUtil.isBeginDateChanged({beginDate: dateUtil.beginningOfTodayUTC().toDate()}, {})).toBeTruthy();
    expect(filterUtil.isBeginDateChanged({}, {})).toBeFalsy();
  });

  it('should check if end date changed', () => {
    expect(filterUtil.isEndDateChanged({endDate: dateUtil.endOfTodayUTC().toDate()},
      {endDate: dateUtil.endOfLastWeekUTC().toDate()})).toBeTruthy();
    expect(filterUtil.isEndDateChanged({endDate: dateUtil.endOfTodayUTC().toDate()},
      {endDate: dateUtil.endOfTodayUTC().toDate()})).toBeFalsy();
    expect(filterUtil.isEndDateChanged({endDate: dateUtil.endOfTodayUTC().toDate()}, {})).toBeTruthy();
    expect(filterUtil.isEndDateChanged({}, {})).toBeFalsy();
  });
});
