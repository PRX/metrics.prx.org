import { createSelector } from '@ngrx/store';
import { selectEpisodesLoading } from './episode.selectors';
import { selectPodcastsLoading } from './podcast.selectors';
import { selectEpisodeMetricsLoading } from './episode-metrics.selectors';
import { selectPodcastMetricsLoading } from './podcast-metrics.selectors';

export const selectCmsLoading = createSelector(selectEpisodesLoading, selectPodcastsLoading, (episodes, podcasts) => episodes || podcasts);
export const selectCastleLoading = createSelector(selectEpisodeMetricsLoading, selectPodcastMetricsLoading,
  (episodes, podcasts) => episodes || podcasts);
export const selectLoading = createSelector(selectCmsLoading, selectCastleLoading, (cms, castle) => cms || castle);
