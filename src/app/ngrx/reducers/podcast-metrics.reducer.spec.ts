import { CastlePodcastMetricsAction, CastlePodcastAllTimeMetricsSuccessAction,
  CastlePodcastAllTimeMetricsFailureAction } from '../actions/castle.action.creator';
import { INTERVAL_DAILY, FilterModel } from './filter.reducer';
import { PodcastMetricsReducer } from './podcast-metrics.reducer';

describe('PodcastMetricsReducer', () => {
  let newState;
  const podcast = {
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  };
  const filter: FilterModel = {
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };
  beforeEach(() => {
    newState = PodcastMetricsReducer(undefined,
      new CastlePodcastMetricsAction({
        podcast,
        filter,
        metricsType: 'downloads',
        metrics: []
      })
    );
  });

  it('should update with new podcast metrics', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].seriesId).toEqual(37800);
  });

  it('should update existing podcast metrics keyed by seriesId', () => {
    newState = PodcastMetricsReducer(newState,
      new CastlePodcastMetricsAction({
        podcast,
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
    expect(newState[0].seriesId).toEqual(37800);
    expect(newState[0].dailyDownloads.length).toEqual(12);
    expect(newState[0].dailyDownloads[0][1]).toEqual(52522);
  });

  it ('should add new podcast metrics', () => {
    newState = PodcastMetricsReducer(newState,
      new CastlePodcastMetricsAction({
        podcast: {
          seriesId: 37801,
          feederId: '71',
          title: 'Totally Not Pet Talks Daily'
        },
        filter,
        metricsType: 'downloads',
        metrics: []
      })
    );
    expect(newState.length).toEqual(2);
  });

  it ('should add all-time podcast metrics', () => {
    newState = PodcastMetricsReducer(newState,
      new CastlePodcastAllTimeMetricsSuccessAction({
        podcast: {
          seriesId: 37800,
          feederId: '70',
          title: 'Pet Talks Daily'
        },
        allTimeDownloads: 10
      })
    );
    expect(newState[0].allTimeDownloads).toEqual(10);
  });

  it ('won\t alter state on all time metrics failure', () => {
    let oldState = newState;
    newState = PodcastMetricsReducer(newState,
      new CastlePodcastAllTimeMetricsFailureAction({error: 'Some error'})
    );
    expect(newState[0]).toEqual(oldState[0]);
  });
});
