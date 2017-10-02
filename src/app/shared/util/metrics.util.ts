import { PodcastModel, EpisodeModel, FilterModel, MetricsType, PodcastMetricsModel, EpisodeMetricsModel } from '../../ngrx/model';

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

export const filterPodcastMetrics = (filter: FilterModel, podcastMetrics: PodcastMetricsModel[]): PodcastMetricsModel => {
  if (filter.podcast && filter.interval && podcastMetrics) {
    const metrics = podcastMetrics.filter(metric => metric.seriesId === filter.podcast.seriesId);
    if (metrics && metrics.length) {
      return metrics[0]; // only one entry should match the series id
    }
  }
};

export const filterEpisodeMetrics =
  (filter: FilterModel, episodeMetrics: EpisodeMetricsModel[], metricsType: MetricsType): EpisodeMetricsModel[] => {
    if (filter.podcast && filter.episodes && filter.interval && episodeMetrics) {
      const metricsProperty = filter.interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
      return episodeMetrics.filter(metric => metric.seriesId === filter.podcast.seriesId &&
      filter.episodes.map(e => e.id).indexOf(metric.id) !== -1 &&
      metric[metricsProperty]);
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
