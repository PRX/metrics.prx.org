import { createSelector } from '@ngrx/store';
import { selectEpisodesLoaded } from './episode.selectors';
import { selectPodcastsLoaded } from './podcast.selectors';
import { selectEpisodeMetricsLoaded } from './episode-metrics.selectors';
import { selectPodcastMetricsLoaded } from './podcast-metrics.selectors';

export const selectCmsLoaded = createSelector(selectEpisodesLoaded, selectPodcastsLoaded, (episodes, podcasts) => episodes && podcasts);
export const selectCastleLoaded = createSelector(selectEpisodeMetricsLoaded, selectPodcastMetricsLoaded,
  (episodes, podcasts) => episodes && podcasts);
export const selectLoaded = createSelector(selectCmsLoaded, selectCastleLoaded, (cms, castle) => cms && castle);
