import { INTERVAL_DAILY, INTERVAL_HOURLY } from '../model';
import { filterPodcasts, filterAllPodcastEpisodes, filterEpisodes,
  filterPodcastMetrics, filterEpisodeMetrics, metricsData, getTotal } from './metrics.util';

describe('metrics util', () => {
  const podcasts = [
    {
      doc: undefined,
      seriesId: 37800,
      title: 'Pet Talks Daily',
      feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
      feederId: '70'
    },
    {
      doc: undefined,
      seriesId: 37801,
      title: 'Totally Not Pet Talks Daily',
      feederUrl: 'https://feeder.prx.org/api/v1/podcasts/12',
      feederId: '12'
    }
  ];
  const episodes = [
    {
      doc: undefined,
      seriesId: 37800,
      id: 123,
      publishedAt: new Date(),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    },
    {
      doc: undefined,
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'Another Pet Talk Episode',
      guid: 'gfedcba'
    },
    {
      doc: undefined,
      seriesId: 37801,
      id: 125,
      publishedAt: new Date(),
      title: 'Totally Not a Pet Talk Episode',
      guid: 'hijklmn'
    }
  ];
  const filter = {
    podcast: {...podcasts[0]},
    episodes: [{...episodes[0]}],
    beginDate: new Date('2017-09-29 0:0:0'),
    endDate: new Date('2017-09-29 23:59:59'),
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
  const podcastMetrics = [
    {
      seriesId: 37800,
      feederId: '70',
      dailyDownloads: []
    },
    {
      seriesId: 37801,
      feederId: '70',
      dailyDownloads: []
    }
  ];
  const episodeMetrics = [
    {
      seriesId: 37800,
      id: 123,
      guid: 'abcdefg',
      dailyDownloads: []
    },
    {
      seriesId: 37800,
      id: 124,
      guid: 'gfedcba',
      dailyDownloads: []
    },
    {
      seriesId: 37801,
      id: 125,
      guid: 'hijklmn',
      dailyDownloads: []
    }
  ];

  it('should get podcast that matches filter or nothing if no match', () => {
    expect(filterPodcasts(filter, podcasts).seriesId).toEqual(37800);
    const emptyFilter = {};
    expect(filterPodcasts(emptyFilter, podcasts)).toBeUndefined();
    const nonMatchingFilter = {
      podcasts: {
        doc: undefined,
        seriesId: 1,
        feederId: '18'
      }
    };
    expect(filterPodcasts(nonMatchingFilter, podcasts)).toBeUndefined();
  });

  it('should get all episodes of the filtered podcast', () => {
    expect(filterAllPodcastEpisodes(filter, episodes).length).toEqual(2);
  });

  it('should only get episodes that match filter or nothing if no match', () => {
    expect(filterEpisodes(filter, episodes).length).toEqual(1);
    expect(filterEpisodes(filter, episodes)[0].id).toEqual(123);
    const emptyFilter = {};
    expect(filterEpisodes(emptyFilter, episodes)).toBeUndefined();
    const nonMatchingFilter = {
      podcast: {
        doc: undefined,
        seriesId: 37802,
        title: 'Nothing to do with pets',
        feederUrl: 'https://feeder.prx.org/api/v1/podcasts/13',
        feederId: '13'
      },
      episodes: [{
        doc: undefined,
        seriesId: 37802,
        title: 'Why dragons make terrible pets',
        id: 126,
        publishedAt: new Date()
      }]
    };
    expect(filterEpisodes(nonMatchingFilter, episodes).length).toEqual(0);
  });

  it('should get podcast metrics matching filter', () => {
    expect(filterPodcastMetrics(filter, podcastMetrics).seriesId).toEqual(37800);
  });

  it('should get episode metrics matching filter', () => {
    expect(filterEpisodeMetrics(filter, episodeMetrics, 'downloads').length).toEqual(1);
  });

  it('should get metrics array according to interval', () => {
    expect(metricsData(filter, podcastMetrics[0], 'downloads').length).toEqual(0);
    expect(metricsData({interval: INTERVAL_HOURLY}, episodeMetrics[0], 'downloads')).toBeUndefined(); // no hourly
  });

  it('should get total of metrics datapoints', () => {
    expect(getTotal(metrics)).toEqual(52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858 + 52522 + 162900 + 46858);
  });
});
