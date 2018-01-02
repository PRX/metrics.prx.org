import { CastleFilterAction } from '../actions';
import { FilterModel, INTERVAL_DAILY, INTERVAL_HOURLY } from '../';
import { FilterReducer } from './filter.reducer';
import { beginningOfTodayUTC, endOfTodayUTC, beginningOfThisWeekUTC, THIS_WEEK } from '../../shared/util/date.util';

describe('FilterReducer', () => {
  let newState: FilterModel;
  beforeEach(() => {
    newState = FilterReducer(undefined,
      new CastleFilterAction({
        filter: {
          podcastSeriesId: 37800,
          beginDate: new Date(),
          endDate: new Date(),
          interval: INTERVAL_DAILY
        }
      }));
  });

  it('should update with new filter', () => {
    expect(newState.podcastSeriesId).toEqual(37800);
  });

  it('should update with new episode page', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({
        filter: {
          page: 1
        }
      }));
    expect(newState.page).toEqual(1);
  });

  it ('should update with new beginDate or endDate', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {beginDate: new Date('2017-08-26T10:00:00Z'), endDate: new Date('2017-09-10T12:00:00Z')}}));
    expect(newState.beginDate.getDate()).toEqual(26);
  });

  it('should update standardRange value if begin or end dates are present', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {
        standardRange: THIS_WEEK, beginDate: beginningOfThisWeekUTC().toDate(), endDate: endOfTodayUTC().toDate()}
      }));
    expect(newState.standardRange).toEqual(THIS_WEEK);
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {beginDate: beginningOfTodayUTC().subtract(18, 'days').toDate()}}));
    expect(newState.standardRange).toBeUndefined();
  });

  it ('should update with new interval', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {interval: INTERVAL_HOURLY}}));
    expect(newState.interval.key).toEqual('hourly');
  });

  it ('should retain other fields when updating', () => {
    expect(newState.interval.key).toEqual('daily');
    expect(newState.podcastSeriesId).toEqual(37800);
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {interval: INTERVAL_HOURLY}}));
    expect(newState.interval.key).toEqual('hourly');
    expect(newState.podcastSeriesId).toEqual(37800);
  });
});
