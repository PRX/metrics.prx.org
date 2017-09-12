import { castlePodcastMetrics } from '../actions/castle.action.creator';
import { INTERVAL_DAILY } from '../../shared/model/metrics.model';
import { PodcastMetricsReducer } from './podcast-metrics.reducer';

describe('PodcastMetricsReducer', () => {
  let newState;
  beforeEach(() => {
    newState = PodcastMetricsReducer(undefined,
      castlePodcastMetrics(
        {
          doc: undefined,
          seriesId: 37800,
          feederId: '70',
          title: 'Pet Talks Daily'
        },
        INTERVAL_DAILY,
        'downloads',
        []
      )
    );
  });

  it('should update with new podcast metrics', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].seriesId).toEqual(37800);
  });

  it('should update existing podcast metrics keyed by seriesId', () => {
    newState = PodcastMetricsReducer(newState,
      castlePodcastMetrics(
        {
          doc: undefined,
          seriesId: 37800,
          feederId: '70',
          title: 'Pet Talks Daily'
        },
        INTERVAL_DAILY,
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
    expect(newState[0].seriesId).toEqual(37800);
    expect(newState[0].dailyDownloads.length).toEqual(12);
    expect(newState[0].dailyDownloads[0][1]).toEqual(52522);
  });

  it ('should add new podcast metrics', () => {
    newState = PodcastMetricsReducer(newState,
      castlePodcastMetrics(
        {
          doc: undefined,
          seriesId: 37801,
          feederId: '71',
          title: 'Totally Not Pet Talks Daily'
        },
        INTERVAL_DAILY,
        'downloads',
        []
      )
    );
    expect(newState.length).toEqual(2);
  });
});
