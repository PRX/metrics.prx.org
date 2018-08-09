import { createSelector } from '@ngrx/store';
import { selectRoutedPageLoaded } from './episode.selectors';
import { selectRoutedPodcastLoaded } from './podcast.selectors';
import { selectEpisodeMetricsLoaded } from './episode-metrics.selectors';
import { selectPodcastMetricsLoaded } from './podcast-metrics.selectors';

export const selectCastleLoaded = createSelector(
  selectRoutedPageLoaded,
  selectRoutedPodcastLoaded,
  selectEpisodeMetricsLoaded,
  selectPodcastMetricsLoaded,
  (episodes, podcasts, episodeMetrics, podcastMetrics) => episodes && podcasts && episodeMetrics && podcastMetrics);
export const selectLoaded = selectCastleLoaded;
