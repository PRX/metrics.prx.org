import { filterPodcasts, filterAllPodcastEpisodes, filterEpisodes,
  filterPodcastMetrics, metricsData, filterEpisodeMetrics } from './reducers';
import { INTERVAL_DAILY, INTERVAL_HOURLY } from '../model';

describe('reducer filters', () => {
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
    expect(filterEpisodeMetrics(filter, episodeMetrics).length).toEqual(1);
  });

  it('should get metrics array according to interval', () => {
    expect(metricsData(filter, podcastMetrics[0], 'downloads').length).toEqual(0);
    expect(metricsData({interval: INTERVAL_HOURLY}, episodeMetrics[0], 'downloads')).toBeUndefined(); // no hourly
  });
});
