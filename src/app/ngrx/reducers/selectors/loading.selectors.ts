import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoading } from './episode.selectors';
import { selectRoutedPodcast } from './podcast.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeMetricsLoading } from './episode-metrics.selectors';
import { selectPodcastDownloadsLoading } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksLoading, selectNestedPodcastRanksLoading } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsLoading, selectNestedPodcastTotalsLoading } from './podcast-totals.selectors';
import { selectSelectedEpisodesRanksLoading, selectNestedEpisodesRanksLoading } from './episode-ranks.selectors';
import { selectSelectedEpisodesTotalsLoading, selectNestedEpisodesTotalsLoading } from './episode-totals.selectors';
import { selectSelectedEpisodeGuids } from './episode-select.selectors';

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
  (routedPodcast, podcastError, ranksLoading, totalsLoading) => {
    return (!podcastError && !routedPodcast) || ranksLoading || totalsLoading;
  });

export const selectGroupedEpisodeDataLoading = createSelector(
  selectSelectedEpisodesRanksLoading,
  selectSelectedEpisodesTotalsLoading,
  (ranksLoading, totalsLoading) => ranksLoading || totalsLoading
);

export const selectGroupedDataLoading = createSelector(
  selectSelectedEpisodeGuids,
  selectGroupedEpisodeDataLoading,
  selectGroupedPodcastDataLoading,
  (guids, episode, podcast) => guids && guids.length ? episode : podcast
);

export const selectNestedTotalsLoading = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectNestedPodcastTotalsLoading,
  selectSelectedEpisodeGuids,
  selectNestedEpisodesTotalsLoading,
  (routedPodcast, podcastError, podcastTotalsLoading, guids, episodesTotalsLoading) => {
    if (!guids || guids.length === 0) {
      return (!podcastError && !routedPodcast) || podcastTotalsLoading;
    } else {
      return episodesTotalsLoading;
    }
  });

  export const selectNestedRanksLoading = createSelector(
    selectRoutedPodcast,
    selectPodcastError,
    selectNestedPodcastRanksLoading,
    selectSelectedEpisodeGuids,
    selectNestedEpisodesRanksLoading,
    (routedPodcast, podcastError, podcastRanksLoading, guids, episodesRanksLoading) => {
      if (!guids || guids.length === 0) {
        return (!podcastError && !routedPodcast) || podcastRanksLoading;
      } else {
        return episodesRanksLoading;
      }
    });
