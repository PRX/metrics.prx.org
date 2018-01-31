import { PodcastModel, EpisodeModel, RouterModel, PodcastMetricsModel, EpisodeMetricsModel,
  INTERVAL_DAILY, INTERVAL_HOURLY, MetricsType, METRICSTYPE_DOWNLOADS } from '../../ngrx';
import { filterPodcasts, filterAllPodcastEpisodes,
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
  const routerState: RouterModel = {
    podcastSeriesId: podcasts[0].seriesId,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
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
    expect(filterPodcasts(routerState, podcasts).seriesId).toEqual(37800);
    const emptyFilter = {};
    expect(filterPodcasts(emptyFilter, podcasts)).toBeUndefined();
    const nonMatchingFilter: RouterModel = {
      podcastSeriesId: 1
    };
    expect(filterPodcasts(nonMatchingFilter, podcasts)).toBeUndefined();
  });

  it('should get all episodes of the filtered podcast', () => {
    expect(filterAllPodcastEpisodes(routerState, episodes).length).toEqual(2);
  });

  it('should find podcast metrics matching routerState', () => {
    expect(findPodcastMetrics(routerState, podcastMetrics).seriesId).toEqual(37800);
  });

  it('should get episode metrics matching routerState', () => {
    expect(filterEpisodeMetricsPage(routerState, episodeMetrics).length).toEqual(1);
  });

  it('should get metrics array according to interval and metrics type', () => {
    expect(metricsData(routerState, podcastMetrics[0]).length).toEqual(12);
    // no hourly
    expect(metricsData({interval: INTERVAL_HOURLY, metricsType: <MetricsType>METRICSTYPE_DOWNLOADS}, episodeMetrics[0])).toBeUndefined();
  });

  it('should get total of metrics datapoints', () => {
    expect(getTotal(metrics)).toEqual(52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858);
  });
});
