import { CastleFilterAction } from '../actions';
import { INTERVAL_DAILY, INTERVAL_HOURLY, TODAY, THIS_MONTH } from '../model';
import { FilterReducer } from './filter.reducer';
import { beginningOfTodayUTC, endOfTodayUTC, getRange } from '../../shared/util/date.util';

describe('FilterReducer', () => {
  let newState;
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

  it('should update with new episodes', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({
        filter: {
          episodes: [
            {
              doc: undefined,
              id: 123,
              seriesId: 37800,
              title: 'A Pet Talk Episode',
              publishedAt: new Date()
            }
          ]
        }
      }));
    expect(newState.episodes[0].id).toEqual(123);
  });

  it ('should update with new beginDate or endDate', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {beginDate: new Date('2017-08-26T10:00:00Z'), endDate: new Date('2017-09-10T12:00:00Z')}}));
    expect(newState.beginDate.getDate()).toEqual(26);
  });

  it('should update standardRange value if begin or end dates are present', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {
        standardRange: TODAY, beginDate: beginningOfTodayUTC().toDate(), endDate: endOfTodayUTC().toDate()}
      }));
    expect(newState.standardRange).toEqual(TODAY);
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {beginDate: beginningOfTodayUTC().subtract(1, 'days').toDate()}}));
    expect(newState.standardRange).toBeUndefined();
  });

  it ('should update with new range', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {range: getRange(THIS_MONTH)}}));
    expect(newState.range[0]).toEqual(1);
    expect(newState.range[1]).toEqual('months');
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
