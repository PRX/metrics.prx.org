import { castlePodcastMetrics, castleEpisodeMetrics } from '../actions/castle.action.creator';
import { INTERVAL_DAILY } from '../../shared/model/metrics.model';
import { FilterModel } from '../../shared/model/filter.model';
import { PodcastMetricsReducer } from './podcast-metrics.reducer';

describe('PodcastMetricsReducer', () => {
  let newState;
  const podcast = {
    doc: undefined,
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
      castlePodcastMetrics(
        podcast,
        filter,
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
        podcast,
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
        filter,
        'downloads',
        []
      )
    );
    expect(newState.length).toEqual(2);
  });

  it('should unsparse metrics data according to filter', () => {
    newState = PodcastMetricsReducer(newState,
      castlePodcastMetrics(
        podcast,
        filter,
        'downloads',
        [
          ['2017-08-27T00:00:00Z', 52522],
          ['2017-08-28T00:00:00Z', 162900],
          ['2017-08-30T00:00:00Z', 52522],
          ['2017-08-31T00:00:00Z', 162900],
          ['2017-09-01T00:00:00Z', 46858],
          ['2017-09-02T00:00:00Z', 52522],
          ['2017-09-03T00:00:00Z', 162900],
          ['2017-09-05T00:00:00Z', 52522],
          ['2017-09-06T00:00:00Z', 162900],
          ['2017-09-07T00:00:00Z', 46858]
        ]
      )
    );
    expect(newState.length).toEqual(1);
    expect(newState[0].seriesId).toEqual(37800);
    expect(newState[0].dailyDownloads.length).toEqual(12);
    expect(newState[0].dailyDownloads[2][1]).toEqual(0);
  });

  it('should subtract episode data from "All Others" podcast data according to filter', () => {
    const episode = {
      doc: undefined,
      seriesId: 37800,
      id: 123,
      publishedAt: new Date(),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    };
    filter.episodes = [episode];
    newState = PodcastMetricsReducer(newState,
      castlePodcastMetrics(
        podcast,
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
    newState = PodcastMetricsReducer(newState,
        castleEpisodeMetrics(
          episode,
          filter,
          'downloads',
          [
            ['2017-08-27T00:00:00Z', 522],
            ['2017-08-28T00:00:00Z', 900],
            ['2017-08-29T00:00:00Z', 858],
            ['2017-08-30T00:00:00Z', 522],
            ['2017-08-31T00:00:00Z', 900],
            ['2017-09-01T00:00:00Z', 858],
            ['2017-09-02T00:00:00Z', 522],
            ['2017-09-03T00:00:00Z', 900],
            ['2017-09-04T00:00:00Z', 858],
            ['2017-09-05T00:00:00Z', 522],
            ['2017-09-06T00:00:00Z', 900],
            ['2017-09-07T00:00:00Z', 858]
          ]
        )
    );
    expect(newState.length).toEqual(1);
    expect(newState[0].seriesId).toEqual(37800);
    expect(newState[0].dailyDownloadsOthers.length).toEqual(12);
    expect(newState[0].dailyDownloadsOthers[0][1]).toEqual(52000);
  });
});
