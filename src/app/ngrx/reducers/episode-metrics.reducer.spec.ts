import { CastleEpisodeMetricsAction, CastleEpisodeAllTimeMetricsSuccessAction,
  CastleEpisodeAllTimeMetricsFailureAction } from '../actions';
import { INTERVAL_DAILY } from '../';
import { EpisodeMetricsReducer } from './episode-metrics.reducer';

describe('EpisodeMetricsReducer', () => {
  let newState;
  const episode = {
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
      new CastleEpisodeMetricsAction({
        episode,
        filter,
        metricsType: 'downloads',
        metrics: []
      })
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
      new CastleEpisodeMetricsAction({
        episode: {...episode, guid: 'gfedcba'},
        filter,
        metricsType: 'downloads',
        metrics: [
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
      })
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
      new CastleEpisodeMetricsAction({
        episode: {
          seriesId: 37800,
          id: 1234,
          publishedAt: new Date(),
          title: 'A New Pet Talk Episode',
          guid: 'hijklmn'
        },
        filter,
        metricsType: 'downloads',
        metrics: []
      })
    );
    expect(newState.filter(p => p.seriesId === 37800).length).toEqual(2);
  });

  it ('should add all-time episode metrics', () => {
    newState = EpisodeMetricsReducer(newState,
      new CastleEpisodeAllTimeMetricsSuccessAction({
        episode,
        allTimeDownloads: 10
      })
    );
    expect(newState[0].allTimeDownloads).toEqual(10);
  });

  it ('won\t alter state on all time metrics failure', () => {
    let oldState = newState;
    newState = EpisodeMetricsReducer(newState,
      new CastleEpisodeAllTimeMetricsFailureAction({error: 'Some error'})
    );
    expect(newState[0]).toEqual(oldState[0]);
  });
});
