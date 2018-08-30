import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoading } from './episode.selectors';
import { selectRoutedPodcast } from './podcast.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeMetricsLoading } from './episode-metrics.selectors';
import { selectPodcastMetricsLoading } from './podcast-metrics.selectors';
import { selectPodcastRanksLoading } from './podcast-ranks.selectors';
import { selectPodcastTotalsLoading } from './podcast-totals.selectors';

export const selectCastleLoading = createSelector(
  selectRoutedPageLoading,
  selectRoutedPodcast,
  selectPodcastError,
  selectEpisodeMetricsLoading,
  selectPodcastMetricsLoading,
  (routedPageLoading, routedPodcast, podcastError, episodesMetricsLoading, podcastMetricsLoading) => {
    return routedPageLoading || (!routedPodcast && !podcastError) || episodesMetricsLoading || podcastMetricsLoading;
  });
export const selectLoading = selectCastleLoading;

export const selectGroupedPodcastDataLoading = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectPodcastRanksLoading,
  selectPodcastTotalsLoading,
  (podcastError, routedPodcast, ranks, totals) => {
    return (!podcastError && !routedPodcast) || ranks || totals;
  });
