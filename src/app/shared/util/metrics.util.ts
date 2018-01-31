import { PodcastModel, EpisodeModel, RouterModel,
  PodcastMetricsModel, EpisodeMetricsModel, getMetricsProperty } from '../../ngrx';

export const filterPodcasts = (filter: RouterModel, podcasts: PodcastModel[]): PodcastModel => {
  if (filter && filter.podcastSeriesId && podcasts) {
    const matches = podcasts.filter(p => p.seriesId === filter.podcastSeriesId);
    if (matches && matches.length) {
      return matches[0]; // only one entry should match the series id
    }
  }
};

export const filterAllPodcastEpisodes = (filter: RouterModel, episodes: EpisodeModel[]) => {
  if (filter && filter.podcastSeriesId && episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcastSeriesId);
  }
};

export const filterPodcastEpisodePage = (filter: RouterModel, episodes: EpisodeModel[]) => {
  if (filter && filter.podcastSeriesId && filter.page && episodes) {
    return episodes.filter(episode => episode.seriesId === filter.podcastSeriesId && episode.page === filter.page);
  }
};

export const findPodcastMetrics =
  (filter: RouterModel, podcastMetrics: PodcastMetricsModel[]): PodcastMetricsModel => {
  if (filter && filter.podcastSeriesId && filter.interval && filter.beginDate && filter.endDate && podcastMetrics) {
    const metricsProperty = getMetricsProperty(filter.interval, filter.metricsType);
    const metrics = podcastMetrics
      .filter((metric: PodcastMetricsModel) => metric.seriesId === filter.podcastSeriesId &&
        metric[metricsProperty]);
    if (metrics && metrics.length) {
      return metrics[0]; // only one entry should match the series id
    }
  }
};

export const filterEpisodeMetricsPage =
  (filter: RouterModel, episodeMetrics: EpisodeMetricsModel[]): EpisodeMetricsModel[] => {
  if (filter && filter.interval && filter.beginDate && filter.endDate && episodeMetrics) {
    const metricsProperty = getMetricsProperty(filter.interval, filter.metricsType);
    return episodeMetrics
      .filter((metric: EpisodeMetricsModel) => metric.seriesId === filter.podcastSeriesId &&
      filter.page === metric.page &&
      metric[metricsProperty]);
  } else {
    return [];
  }
};

export const metricsData = (filter: RouterModel, metrics: PodcastMetricsModel | EpisodeMetricsModel) => {
  const metricsProperty = getMetricsProperty(filter.interval, filter.metricsType);
  return metrics[metricsProperty];
};

export const getTotal = (metrics: any[][]): number => {
  if (metrics && metrics.length) {
    return metrics.map(d => d[1]).reduce((acc: number, value: number) => {
      return acc + value;
    });
  } else {
    return 0;
  }
};
