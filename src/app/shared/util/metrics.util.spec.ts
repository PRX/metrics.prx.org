import { PodcastModel, EpisodeModel, FilterModel, PodcastMetricsModel, EpisodeMetricsModel,
  INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx';
import { filterPodcasts, filterAllPodcastEpisodes, filterMetricsByDate,
  findPodcastMetrics, filterEpisodeMetricsPage, metricsData, getTotal } from './metrics.util';

describe('metrics util', () => {
  const podcasts: PodcastModel[] = [
    {
      seriesId: 37800,
      title: 'Pet Talks Daily',
      feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
      feederId: '70'
    },
    {
      seriesId: 37801,
      title: 'Totally Not Pet Talks Daily',
      feederUrl: 'https://feeder.prx.org/api/v1/podcasts/12',
      feederId: '12'
    }
  ];
  const episodes: EpisodeModel[] = [
    {
      seriesId: 37800,
      id: 123,
      publishedAt: new Date(),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    },
    {
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'Another Pet Talk Episode',
      guid: 'gfedcba'
    },
    {
      seriesId: 37801,
      id: 125,
      publishedAt: new Date(),
      title: 'Totally Not a Pet Talk Episode',
      guid: 'hijklmn'
    }
  ];
  const filter: FilterModel = {
    podcastSeriesId: podcasts[0].seriesId,
    page: 1,
    beginDate: new Date('2017-09-01T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };
  const metrics = [
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
  ];
  const podcastMetrics: PodcastMetricsModel[] = [
    {
      seriesId: 37800,
      feederId: '70',
      dailyDownloads: [...metrics]
    },
    {
      seriesId: 37801,
      feederId: '70',
      dailyDownloads: [...metrics]
    }
  ];
  const episodeMetrics: EpisodeMetricsModel[] = [
    {
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      page: 1,
      dailyDownloads: [...metrics]
    },
    {
      seriesId: 37800,
      id: 124,
      guid: 'gfedcba',
      page: 2,
      dailyDownloads: [...metrics]
    },
    {
      seriesId: 37801,
      id: 125,
      guid: 'hijklmn',
      page: 1,
      dailyDownloads: [...metrics]
    }
  ];

  it('should get podcast that matches routerState or nothing if no match', () => {
    expect(filterPodcasts(filter, podcasts).seriesId).toEqual(37800);
    const emptyFilter = {};
    expect(filterPodcasts(emptyFilter, podcasts)).toBeUndefined();
    const nonMatchingFilter: FilterModel = {
      podcastSeriesId: 1
    };
    expect(filterPodcasts(nonMatchingFilter, podcasts)).toBeUndefined();
  });

  it('should get all episodes of the filtered podcast', () => {
    expect(filterAllPodcastEpisodes(filter, episodes).length).toEqual(2);
  });

  it('should find podcast metrics matching routerState', () => {
    expect(findPodcastMetrics(filter, podcastMetrics).seriesId).toEqual(37800);
  });

  it('should get episode metrics matching routerState', () => {
    expect(filterEpisodeMetricsPage(filter, episodeMetrics, 'downloads').length).toEqual(1);
  });

  it('should get metrics array according to interval', () => {
    expect(metricsData(filter, podcastMetrics[0], 'downloads').length).toEqual(12);
    expect(metricsData({interval: INTERVAL_HOURLY}, episodeMetrics[0], 'downloads')).toBeUndefined(); // no hourly
  });

  it('should get total of metrics datapoints', () => {
    expect(getTotal(metrics)).toEqual(52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858);
  });

  it('should routerState metrics by date', () => {
    expect(filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metrics).length).toEqual(7);
  });
});
