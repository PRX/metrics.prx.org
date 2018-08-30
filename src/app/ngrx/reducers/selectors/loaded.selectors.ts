import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoaded } from './episode.selectors';
import { selectRoutedPodcast, selectPodcastError } from './podcast.selectors';
import { selectRoutedEpisodePageMetricsLoaded } from './episode-metrics.selectors';
import { selectPodcastMetricsLoaded } from './podcast-metrics.selectors';
import { selectPodcastRanksLoaded } from './podcast-ranks.selectors';
import { selectPodcastTotalsLoaded } from './podcast-totals.selectors';

export const selectCatalogLoaded = createSelector(
  selectRoutedPageLoaded,
  selectRoutedPodcast,
  selectPodcastError,
  (episodesLoaded, podcast, podcastError) => {
    return episodesLoaded && podcast && !podcastError;
  });
export const selectMetricsLoaded = createSelector(
  selectRoutedEpisodePageMetricsLoaded,
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
export const selectGroupedPodcastDataLoaded = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectPodcastRanksLoaded,
  selectPodcastTotalsLoaded,
  (podcast, podcastError, ranksLoaded, totalsLoaded) => {
    return podcast && !podcastError && ranksLoaded && totalsLoaded;
  });

