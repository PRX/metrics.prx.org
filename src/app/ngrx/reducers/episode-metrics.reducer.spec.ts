import { castleEpisodeMetrics } from '../actions/castle.action.creator';
import { INTERVAL_DAILY } from '../../shared/model/metrics.model';
import { EpisodeMetricsReducer } from './episode-metrics.reducer';

describe('EpisodeMetricsReducer', () => {
  let newState;
  const episode = {
    doc: undefined,
    seriesId: 37800,
    id: 123,
    publishedAt: new Date(),
    title: 'A Pet Talk Episode',
    guid: 'abcdefg'
  };
  const filter = {
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };
  beforeEach(() => {
    newState = EpisodeMetricsReducer(undefined,
      castleEpisodeMetrics(
        episode,
        filter,
        'downloads',
        []
      )
    );
  });

  it('should update with new episode metrics', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].id).toEqual(123);
    expect(newState[0].seriesId).toEqual(37800);
    expect(newState[0].guid).toEqual('abcdefg');
  });

  it('should update existing episode metrics keyed by seriesId and episode id', () => {
    newState = EpisodeMetricsReducer(newState,
      castleEpisodeMetrics(
        Object.assign({}, episode, {guid: 'gfedcba'}),
        filter,
        'downloads',
        [
          ['2017-08-27T00:00:00Z', 52522],
          ['2017-08-28T00:00:00Z', 162900],
          ['2017-08-29T00:00:00Z', 46858],
          ['2017-08-30T00:00:00Z', 52522],
          ['2017-08-31T00:00:00Z', 162900],
          ['2017-09-01T00:00:00Z', 46858],
          ['2017-09-02T00:00:00Z', 52522],
          ['2017-09-03T00:00:00Z', 162900],
          ['2017-09-04T00:00:00Z', 46858],
          ['2017-09-05T00:00:00Z', 52522],
          ['2017-09-06T00:00:00Z', 162900],
          ['2017-09-07T00:00:00Z', 46858]
        ]
      )
    );
    expect(newState.length).toEqual(1);
    expect(newState[0].id).toEqual(123);
    expect(newState[0].seriesId).toEqual(37800);
    expect(newState[0].guid).toEqual('gfedcba');
    expect(newState[0].dailyDownloads.length).toEqual(12);
    expect(newState[0].dailyDownloads[0][1]).toEqual(52522);
  });

  it ('should add new episode metrics', () => {
    newState = EpisodeMetricsReducer(newState,
      castleEpisodeMetrics(
        {
          doc: undefined,
          seriesId: 37800,
          id: 1234,
          publishedAt: new Date(),
          title: 'A New Pet Talk Episode',
          guid: 'hijklmn'
        },
        filter,
        'downloads',
        []
      )
    );
    expect(newState.filter(p => p.seriesId === 37800).length).toEqual(2);
  });

  it('should unsparse metrics data according to filter', () => {
    newState = EpisodeMetricsReducer(newState,
      castleEpisodeMetrics(
        episode,
        filter,
        'downloads',
        [
          ['2017-08-27T00:00:00Z', 52522],
          ['2017-08-28T00:00:00Z', 162900],
          ['2017-08-29T00:00:00Z', 46858],
          ['2017-08-30T00:00:00Z', 52522],
          ['2017-08-31T00:00:00Z', 162900],
          ['2017-09-02T00:00:00Z', 52522],
          ['2017-09-03T00:00:00Z', 162900],
          ['2017-09-04T00:00:00Z', 46858],
          ['2017-09-05T00:00:00Z', 52522],
          ['2017-09-06T00:00:00Z', 162900],
          ['2017-09-07T00:00:00Z', 46858]
        ]
      )
    );
    expect(newState.length).toEqual(1);
    expect(newState[0].id).toEqual(123);
    expect(newState[0].seriesId).toEqual(37800);
    expect(newState[0].dailyDownloads.length).toEqual(12);
    expect(newState[0].dailyDownloads[5][1]).toEqual(0);
  });
});
