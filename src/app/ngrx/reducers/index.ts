import { createSelector, ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { AccountReducer, AccountState } from './account.reducer';
import { PodcastReducer } from './podcast.reducer';
import { EpisodeReducer } from './episode.reducer';
import { PodcastMetricsReducer, PodcastMetricsModel } from './podcast-metrics.reducer';
import { PodcastPerformanceMetricsReducer, PodcastPerformanceMetricsState } from './podcast-performance-metrics.reducer';
import { EpisodeMetricsReducer, EpisodeMetricsModel } from './episode-metrics.reducer';
import { EpisodePerformanceMetricsReducer, EpisodePerformanceMetricsState } from './episode-performance-metrics.reducer';
import { RecentEpisodeReducer } from './recent-episode.reducer';
import { PodcastState } from './podcast.reducer';
import { EpisodeState } from './episode.reducer';
import { RecentEpisodeState } from './recent-episode.reducer';
import { CustomRouterReducer } from './router.reducer';

import { RouterModel } from './models';

export interface RootState {
  routerSerializer: RouterReducerState<RouterModel>;
  router: RouterModel;
  account: AccountState;
  podcasts: PodcastState;
  episodes: EpisodeState;
  podcastMetrics: PodcastMetricsModel[];
  podcastPerformanceMetrics: PodcastPerformanceMetricsState;
  episodeMetrics: EpisodeMetricsModel[];
  episodePerformanceMetrics: EpisodePerformanceMetricsState;
  recentEpisodes: RecentEpisodeState;
}

// TypeScript is complaining about this ActionReducerMap again, not sure why ugh
export const reducers: ActionReducerMap<RootState> = {
  routerSerializer: routerReducer,
  router: CustomRouterReducer,
  account: AccountReducer,
  podcasts: PodcastReducer,
  episodes: EpisodeReducer,
  podcastMetrics: PodcastMetricsReducer,
  podcastPerformanceMetrics: PodcastPerformanceMetricsReducer,
  episodeMetrics: EpisodeMetricsReducer,
  episodePerformanceMetrics: EpisodePerformanceMetricsReducer,
  recentEpisodes: RecentEpisodeReducer
};

export { CustomSerializer } from './router.serializer';

export const selectAppState = (state: RootState) => state;

