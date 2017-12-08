import { PodcastModel } from '../../ngrx/reducers';
import { EpisodeModel, FilterModel, MetricsType, IntervalModel,
  PodcastMetricsModel, EpisodeMetricsModel } from '../../ngrx/model';
import { roundDateToBeginOfInterval } from './date.util';

export const filterPodcasts = (filter: FilterModel, podcasts: PodcastModel[]): PodcastModel => {
  if (filter && filter.podcastSeriesId && podcasts) {
    const matches = podcasts.filter(p => p.seriesId === filter.podcastSeriesId);
    if (matches && matches.length) {
      return matches[0]; // only one entry should match the series id
    }
  }
};

export const filterAllPodcastEpisodes = (filter: FilterModel, episodes: EpisodeModel[]) => {
  if (filter && filter.podcastSeriesId && episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcastSeriesId);
  }
};

export const filterPodcastEpisodePage = (filter: FilterModel, episodes: EpisodeModel[]) => {
  if (filter && filter.podcastSeriesId && filter.page && episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcastSeriesId && episode.page === filter.page);
  }
};

export const filterEpisodes = (filter: FilterModel, episodes: EpisodeModel[]) => {
  if (filter && filter.podcastSeriesId && filter.episodeIds) {
    return episodes.filter(episode => episode.seriesId === filter.podcastSeriesId &&
    filter.episodeIds.indexOf(episode.id) !== -1);
  }
};

export const filterMetricsByDate = (beginDate: Date, endDate: Date, interval: IntervalModel, metrics: any[][]): any[][] => {
  const findEntryByDate = (date: Date) => {
    return metrics.findIndex(m => {
      return new Date(m[0]).valueOf() === roundDateToBeginOfInterval(date, interval).valueOf();
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

export const getMetricsProperty = (interval: IntervalModel, metricsType: MetricsType) => {
  return interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
};

export const findPodcastMetrics =
  (filter: FilterModel, podcastMetrics: PodcastMetricsModel[], metricsType: MetricsType = 'downloads'): PodcastMetricsModel => {
  if (filter && filter.podcastSeriesId && filter.interval && filter.beginDate && filter.endDate && podcastMetrics) {
    const metricsProperty = getMetricsProperty(filter.interval, metricsType);
    const metrics = podcastMetrics
      .filter((metric: PodcastMetricsModel) => metric.seriesId === filter.podcastSeriesId &&
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

export const filterEpisodeMetricsPage =
  (filter: FilterModel, episodeMetrics: EpisodeMetricsModel[], metricsType: MetricsType): EpisodeMetricsModel[] => {
  if (filter && filter.interval && filter.beginDate && filter.endDate && episodeMetrics) {
    const metricsProperty = getMetricsProperty(filter.interval, metricsType);
    return episodeMetrics
      .filter((metric: EpisodeMetricsModel) => metric.seriesId === filter.podcastSeriesId &&
      filter.page === metric.page &&
      metric[metricsProperty] &&
      filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]))
      .map((metric: EpisodeMetricsModel) => {
        const filteredMetric: EpisodeMetricsModel = {...metric};
        filteredMetric[metricsProperty] = filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]);
        return filteredMetric;
      });
  } else {
    return [];
  }
};

export const filterEpisodeMetrics =
  (filter: FilterModel, episodeMetrics: EpisodeMetricsModel[], metricsType: MetricsType): EpisodeMetricsModel[] => {
  if (filter && filter.podcastSeriesId && filter.episodeIds && filter.interval && filter.beginDate && filter.endDate && episodeMetrics) {
    const metricsProperty = getMetricsProperty(filter.interval, metricsType);
    return episodeMetrics
      .filter((metric: EpisodeMetricsModel) => metric.seriesId === filter.podcastSeriesId &&
        filter.episodeIds.indexOf(metric.id) !== -1 &&
        metric[metricsProperty] &&
        filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]))
      .map((metric: EpisodeMetricsModel) => {
        const filteredMetric: EpisodeMetricsModel = {...metric};
        filteredMetric[metricsProperty] = filterMetricsByDate(filter.beginDate, filter.endDate, filter.interval, metric[metricsProperty]);
        return filteredMetric;
      });
  } else {
    return [];
  }
};

export const metricsData = (filter: FilterModel, metrics: PodcastMetricsModel | EpisodeMetricsModel, metricsType: MetricsType) => {
  const metricsProperty = getMetricsProperty(filter.interval, metricsType);
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
