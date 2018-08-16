import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoaded } from './episode.selectors';
import { selectRoutedPodcastLoaded } from './podcast.selectors';
import { selectEpisodeMetricsLoaded } from './episode-metrics.selectors';
import { selectPodcastMetricsLoaded } from './podcast-metrics.selectors';

export const selectCatalogLoaded = createSelector(
  selectRoutedPageLoaded,
  selectRoutedPodcastLoaded,
  (episodes, podcasts) => {
    return episodes && podcasts;
  });
export const selectMetricsLoaded = createSelector(
  selectEpisodeMetricsLoaded,
  selectPodcastMetricsLoaded,
  (episodeMetrics, podcastMetrics) => {
    return episodeMetrics && podcastMetrics;
  });
export const selectLoaded = createSelector(
  selectCatalogLoaded,
  selectMetricsLoaded,
  (catalog, metrics) => {
    return catalog && metrics;
  });
