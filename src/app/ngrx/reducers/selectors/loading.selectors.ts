import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoading } from './episode.selectors';
import { selectRoutedPodcast } from './podcast.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeMetricsLoading } from './episode-metrics.selectors';
import { selectPodcastDownloadsLoading } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksLoading } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsLoading } from './podcast-totals.selectors';
import { selectSelectedEpisodesRanksLoading } from './episode-ranks.selectors';
import { selectSelectedEpisodesTotalsLoading } from './episode-totals.selectors';
import { selectEpisodeSelectedEpisodeGuids } from './episode-select.selectors';

export const selectCastleLoading = createSelector(
  selectRoutedPageLoading,
  selectRoutedPodcast,
  selectPodcastError,
  selectEpisodeMetricsLoading,
  selectPodcastDownloadsLoading,
  (routedPageLoading, routedPodcast, podcastError, episodesMetricsLoading, PodcastDownloadsLoading) => {
    return routedPageLoading || (!routedPodcast && !podcastError) || episodesMetricsLoading || PodcastDownloadsLoading;
  });
export const selectLoading = selectCastleLoading;

export const selectGroupedPodcastDataLoading = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectRoutedPodcastRanksLoading,
  selectRoutedPodcastTotalsLoading,
  (podcastError, routedPodcast, ranksLoading, totalsLoading) => {
    return (!podcastError && !routedPodcast) || ranksLoading || totalsLoading;
  });

export const selectGroupedEpisodeDataLoading = createSelector(
  selectSelectedEpisodesRanksLoading,
  selectSelectedEpisodesTotalsLoading,
  (ranksLoading, totalsLoading) => ranksLoading || totalsLoading
);

export const selectGroupedDataLoading = createSelector(
  selectEpisodeSelectedEpisodeGuids,
  selectGroupedEpisodeDataLoading,
  selectGroupedPodcastDataLoading,
  (guids, episode, podcast) => guids && guids.length ? episode : podcast
);
