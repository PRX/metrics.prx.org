import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoading } from './episode.selectors';
import { selectRoutedPodcast } from './podcast.selectors';
import { selectPodcastError } from './podcast.selectors';
import { selectEpisodeDownloadsLoading } from './episode-downloads.selectors';
import { selectPodcastDownloadsLoading } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksLoading, selectNestedPodcastRanksLoading } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsLoading, selectNestedPodcastTotalsLoading } from './podcast-totals.selectors';
import { selectSelectedEpisodesRanksLoading, selectNestedEpisodesRanksLoading } from './episode-ranks.selectors';
import { selectSelectedEpisodesTotalsLoading, selectNestedEpisodesTotalsLoading } from './episode-totals.selectors';
import { selectAggregateSelectedEpisodeGuids } from './episode-select.selectors';

export const selectCastleLoading = createSelector(
  selectRoutedPageLoading,
  selectRoutedPodcast,
  selectPodcastError,
  selectEpisodeDownloadsLoading,
  selectPodcastDownloadsLoading,
  (routedPageLoading, routedPodcast, podcastError, episodesDownloadsLoading, PodcastDownloadsLoading) => {
    return routedPageLoading || (!routedPodcast && !podcastError) || episodesDownloadsLoading || PodcastDownloadsLoading;
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
  selectAggregateSelectedEpisodeGuids,
  selectGroupedEpisodeDataLoading,
  selectGroupedPodcastDataLoading,
  (guids, episode, podcast) => guids && guids.length ? episode : podcast
);

export const selectNestedTotalsLoading = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectNestedPodcastTotalsLoading,
  selectAggregateSelectedEpisodeGuids,
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
    selectAggregateSelectedEpisodeGuids,
    selectNestedEpisodesRanksLoading,
    (routedPodcast, podcastError, podcastRanksLoading, guids, episodesRanksLoading) => {
      if (!guids || guids.length === 0) {
        return (!podcastError && !routedPodcast) || podcastRanksLoading;
      } else {
        return episodesRanksLoading;
      }
    });
