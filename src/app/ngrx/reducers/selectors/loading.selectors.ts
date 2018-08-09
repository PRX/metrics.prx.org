import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoading } from './episode.selectors';
import { selectRoutedPodcast } from './podcast.selectors';
import { selectEpisodeMetricsLoading } from './episode-metrics.selectors';
import { selectPodcastMetricsLoading } from './podcast-metrics.selectors';

export const selectCastleLoading = createSelector(
  selectRoutedPageLoading,
  selectRoutedPodcast,
  selectEpisodeMetricsLoading,
  selectPodcastMetricsLoading,
  (routedPageLoading, routedPodcast, episodesMetricsLoading, podcastMetricsLoading) => {
    return routedPageLoading || !routedPodcast || episodesMetricsLoading || podcastMetricsLoading
  });
export const selectLoading = selectCastleLoading;
