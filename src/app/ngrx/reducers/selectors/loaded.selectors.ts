import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoaded } from './episode.selectors';
import { selectRoutedPodcast, selectPodcastError } from './podcast.selectors';
import { selectRoutedEpisodePageMetricsLoaded } from './episode-metrics.selectors';
import { selectPodcastDownloadsLoaded } from './podcast-downloads.selectors';
import { selectRoutedPodcastRanksLoaded, selectNestedPodcastRanksLoaded } from './podcast-ranks.selectors';
import { selectRoutedPodcastTotalsLoaded, selectNestedPodcastTotalsLoaded } from './podcast-totals.selectors';
import { selectSelectedEpisodesRanksLoaded, selectNestedEpisodesRanksLoaded } from './episode-ranks.selectors';
import { selectSelectedEpisodesTotalsLoaded, selectNestedEpisodesTotalsLoaded } from './episode-totals.selectors';
import { selectEpisodeSelectedEpisodeGuids } from './episode-select.selectors';

export const selectCatalogLoaded = createSelector(
  selectRoutedPageLoaded,
  selectRoutedPodcast,
  selectPodcastError,
  (episodesLoaded, podcast, podcastError) => {
    return episodesLoaded && podcast && !podcastError;
  });
export const selectMetricsLoaded = createSelector(
  selectRoutedEpisodePageMetricsLoaded,
  selectPodcastDownloadsLoaded,
  (episodeMetrics, PodcastDownloads) => {
    return episodeMetrics && PodcastDownloads;
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
  selectEpisodeSelectedEpisodeGuids,
  selectGroupedEpisodeDataLoaded,
  selectGroupedPodcastDataLoaded,
  (guids, episode, podcast) => guids && guids.length ? episode : podcast
);

export const selectNestedTotalsLoaded = createSelector(
  selectRoutedPodcast,
  selectPodcastError,
  selectNestedPodcastTotalsLoaded,
  selectEpisodeSelectedEpisodeGuids,
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
    selectEpisodeSelectedEpisodeGuids,
    selectNestedEpisodesRanksLoaded,
    (podcast, podcastError, podcastRanksLoading, guids, episodesRanksLoaded) => {
      if (!guids || guids.length === 0) {
        return podcast && !podcastError && podcastRanksLoading;
      } else {
        return episodesRanksLoaded;
      }
    });

