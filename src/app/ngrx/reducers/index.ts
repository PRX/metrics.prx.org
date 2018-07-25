import { ActionReducerMap } from '@ngrx/store';
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

import { RouterParams } from './models';
import * as fromPodcast from './castle-podcast.reducer';
import * as fromEpisode from './castle-episode.reducer';

export interface RootState {
  routerSerializer: RouterReducerState<RouterParams>;
  router: RouterParams;
  account: AccountState;
  podcasts: PodcastState;
  episodes: EpisodeState;
  podcastMetrics: PodcastMetricsModel[];
  podcastPerformanceMetrics: PodcastPerformanceMetricsState;
  episodeMetrics: EpisodeMetricsModel[];
  episodePerformanceMetrics: EpisodePerformanceMetricsState;
  recentEpisodes: RecentEpisodeState;
  podcast: fromPodcast.State;
  episode: fromEpisode.State;
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
  recentEpisodes: RecentEpisodeReducer,
  podcast: fromPodcast.reducer,
  episode: fromEpisode.reducer,
};

export { CustomSerializer } from './router.serializer';

export const selectAppState = (state: RootState) => state;

