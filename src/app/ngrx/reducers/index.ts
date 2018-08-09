import { ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { AccountReducer, AccountState } from './account.reducer';
import * as fromPodcast from './podcast.reducer';
import { PodcastMetricsReducer, PodcastMetricsModel } from './podcast-metrics.reducer';
import { PodcastPerformanceMetricsReducer, PodcastPerformanceMetricsState } from './podcast-performance-metrics.reducer';
import * as fromEpisode from './episode.reducer';
import { EpisodeMetricsReducer, EpisodeMetricsModel } from './episode-metrics.reducer';
import { EpisodePerformanceMetricsReducer, EpisodePerformanceMetricsState } from './episode-performance-metrics.reducer';
import { CustomRouterReducer } from './router.reducer';
import { RouterParams } from './models';

export interface RootState {
  routerSerializer: RouterReducerState<RouterParams>;
  router: RouterParams;
  account: AccountState;
  podcast: fromPodcast.State;
  episode: fromEpisode.State;
  podcastMetrics: PodcastMetricsModel[];
  podcastPerformanceMetrics: PodcastPerformanceMetricsState;
  episodeMetrics: EpisodeMetricsModel[];
  episodePerformanceMetrics: EpisodePerformanceMetricsState;
}

// TypeScript is complaining about this ActionReducerMap again, not sure why ugh
export const reducers: ActionReducerMap<RootState> = {
  routerSerializer: routerReducer,
  router: CustomRouterReducer,
  account: AccountReducer,
  podcast: fromPodcast.reducer,
  episode: fromEpisode.reducer,
  podcastMetrics: PodcastMetricsReducer,
  podcastPerformanceMetrics: PodcastPerformanceMetricsReducer,
  episodeMetrics: EpisodeMetricsReducer,
  episodePerformanceMetrics: EpisodePerformanceMetricsReducer,
};

export { CustomSerializer } from './router.serializer';

export const selectAppState = (state: RootState) => state;

