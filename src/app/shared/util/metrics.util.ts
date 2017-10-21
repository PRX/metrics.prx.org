import { PodcastModel, EpisodeModel, FilterModel, MetricsType, IntervalModel,
  PodcastMetricsModel, EpisodeMetricsModel } from '../../ngrx/model';
import { roundDateToInterval } from './date.util';

export const filterPodcasts = (filter: FilterModel, podcasts: PodcastModel[]): PodcastModel => {
  if (filter.podcast && podcasts) {
    const matches = podcasts.filter(p => p.seriesId === filter.podcast.seriesId);
    if (matches && matches.length) {
      return matches[0]; // only one entry should match the series id
    }
  }
};

export const filterAllPodcastEpisodes = (filter: FilterModel, episodes: EpisodeModel[]) => {
  if (filter.podcast && episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcast.seriesId);
  }
};

export const filterEpisodes = (filter: FilterModel, episodes: EpisodeModel[]) => {
  if (filter.podcast && filter.episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcast.seriesId &&
    filter.episodes.map(e => e.id).indexOf(episode.id) !== -1);
  }
};

export const filterMetricsByDate = (beginDate: Date, endDate: Date, interval: IntervalModel, metrics: any[][]): any[][] => {
  const findEntryByDate = (date: Date) => {
    return metrics.findIndex(m => {
      return new Date(m[0]).valueOf() === roundDateToInterval(date, interval).valueOf();
    });
  };
  const begin = findEntryByDate(beginDate);
  const end = findEntryByDate(endDate);
  if (begin !== -1 && end !== -1) {
    return metrics.slice(begin, end + 1);
  } else {
    return null; // no partial data
  }
};

export const findPodcastMetrics = /* TODO: findPodcastMetrics? */
  (filter: FilterModel, podcastMetrics: PodcastMetricsModel[], metricsType: MetricsType = 'downloads'): PodcastMetricsModel => {
  if (filter.podcast && filter.interval && filter.beginDate && filter.endDate && podcastMetrics) {
    const metricsProperty = filter.interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
    const metrics = podcastMetrics
      .filter((metric: PodcastMetricsModel) => metric.seriesId === filter.podcast.seriesId &&
        metric[metricsProperty] &&
        filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]))
      .map((metric: PodcastMetricsModel) => {
        const filteredMetric = {...metric};
        filteredMetric[metricsProperty] = filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]);
        return filteredMetric;
      });
    if (metrics && metrics.length) {
      return metrics[0]; // only one entry should match the series id
    }
  }
};

export const filterEpisodeMetrics =
  (filter: FilterModel, episodeMetrics: EpisodeMetricsModel[], metricsType: MetricsType): EpisodeMetricsModel[] => {
  if (filter.podcast && filter.episodes && filter.interval && filter.beginDate && filter.endDate && episodeMetrics) {
    const metricsProperty = filter.interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
    return episodeMetrics
      .filter((metric: EpisodeMetricsModel) => metric.seriesId === filter.podcast.seriesId &&
        filter.episodes.map(e => e.id).indexOf(metric.id) !== -1 &&
        metric[metricsProperty] &&
        filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]))
      .map((metric: EpisodeMetricsModel) => {
        const filteredMetric = {...metric};
        filteredMetric[metricsProperty] = filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]);
        return filteredMetric;
      });
  } else {
    return [];
  }
};

export const metricsData = (filter: FilterModel, metrics: PodcastMetricsModel | EpisodeMetricsModel, metricsType: MetricsType) => {
  const metricsProperty = filter.interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
  return metrics[metricsProperty];
};

export const getTotal = (metrics: any[][]): number => {
  if (metrics.length) {
    return metrics.map(d => d[1]).reduce((acc: number, value: number) => {
      return acc + value;
    });
  } else {
    return 0;
  }
};
