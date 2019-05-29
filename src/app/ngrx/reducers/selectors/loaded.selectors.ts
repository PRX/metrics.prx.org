import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoaded } from './episode.selectors';
import { selectRoutedPodcast, selectPodcastError } from './podcast.selectors';
import { selectRoutedEpisodePageDownloadsLoaded } from './episode-downloads.selectors';
import { selectPodcastDownloadsLoaded } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksLoaded, selectNestedPodcastRanksLoaded } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsLoaded, selectNestedPodcastTotalsLoaded } from './podcast-totals.selectors';
import { selectSelectedEpisodesRanksLoaded, selectNestedEpisodesRanksLoaded } from './episode-ranks.selectors';
import { selectSelectedEpisodesTotalsLoaded, selectNestedEpisodesTotalsLoaded } from './episode-totals.selectors';
import { selectAggregateSelectedEpisodeGuids } from './episode-select.selectors';

export const selectCatalogLoaded = createSelector(
  selectRoutedPageLoaded,
  selectRoutedPodcast,
  selectPodcastError,
  (episodesLoaded, podcast, podcastError) => {
    return episodesLoaded && podcast && !podcastError;
  });
export const selectDownloadsLoaded = createSelector(
  selectRoutedEpisodePageDownloadsLoaded,
  selectPodcastDownloadsLoaded,
  (episodeDownloads, PodcastDownloads) => {
    return episodeDownloads && PodcastDownloads;
  });
export const selectLoaded = createSelector(
  selectCatalogLoaded,
  selectDownloadsLoaded,
  (catalog, downloads) => {
    return catalog && downloads;
  });
export const selectGroupedPodcastDataLoaded = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectRoutedPodcastRanksLoaded,
  selectRoutedPodcastTotalsLoaded,
  (podcast, podcastError, ranksLoaded, totalsLoaded) => {
    return podcast && !podcastError && ranksLoaded && totalsLoaded;
  });

export const selectGroupedEpisodeDataLoaded = createSelector(
  selectSelectedEpisodesRanksLoaded,
  selectSelectedEpisodesTotalsLoaded,
  (ranksLoaded, totalsLoaded) => ranksLoaded && totalsLoaded
);

export const selectGroupedDataLoaded = createSelector(
  selectAggregateSelectedEpisodeGuids,
  selectGroupedEpisodeDataLoaded,
  selectGroupedPodcastDataLoaded,
  (guids, episode, podcast) => guids && guids.length ? episode : podcast
);

export const selectNestedTotalsLoaded = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectNestedPodcastTotalsLoaded,
  selectAggregateSelectedEpisodeGuids,
  selectNestedEpisodesTotalsLoaded,
  (podcast, podcastError, podcastTotalsLoaded, guids, episodesTotalsLoaded) => {
    if (!guids || guids.length === 0) {
      return podcast && !podcastError && podcastTotalsLoaded;
    } else {
      return episodesTotalsLoaded;
    }
  });

  export const selectNestedRanksLoaded = createSelector(
    selectRoutedPodcast,
    selectPodcastError,
    selectNestedPodcastRanksLoaded,
    selectAggregateSelectedEpisodeGuids,
    selectNestedEpisodesRanksLoaded,
    (podcast, podcastError, podcastRanksLoading, guids, episodesRanksLoaded) => {
      if (!guids || guids.length === 0) {
        return podcast && !podcastError && podcastRanksLoading;
      } else {
        return episodesRanksLoaded;
      }
    });

