import { CastleFilterAction } from '../actions';
import { INTERVAL_DAILY, INTERVAL_HOURLY } from '../model';
import { FilterReducer } from './filter.reducer';

describe('FilterReducer', () => {
  let newState;
  beforeEach(() => {
    newState = FilterReducer(undefined,
      new CastleFilterAction({
        filter: {
          podcast: {
            doc: undefined,
            seriesId: 37800,
            title: 'Pet Talks Daily',
            feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
            feederId: '70'
          },
          beginDate: new Date(),
          endDate: new Date(),
          interval: INTERVAL_DAILY
        }
      }));
  });

  it('should update with new filter', () => {
    expect(newState.podcast.seriesId).toEqual(37800);
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

  it ('should update with new interval', () => {
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {interval: INTERVAL_HOURLY}}));
    expect(newState.interval.key).toEqual('hourly');
  });

  it ('should retain other fields when updating', () => {
    expect(newState.interval.key).toEqual('daily');
    expect(newState.podcast.seriesId).toEqual(37800);
    newState = FilterReducer(newState,
      new CastleFilterAction({filter: {interval: INTERVAL_HOURLY}}));
    expect(newState.interval.key).toEqual('hourly');
    expect(newState.podcast.seriesId).toEqual(37800);
  });
});
