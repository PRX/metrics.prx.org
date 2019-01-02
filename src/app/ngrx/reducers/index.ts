import { ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { AccountReducer, AccountState } from './account.reducer';
import * as fromPodcast from './podcast.reducer';
import * as fromPodcastAllTimeDownloads from './podcast-alltime-downloads.reducer';
import { PodcastMetricsReducer, PodcastMetricsState } from './podcast-metrics.reducer';
import * as fromPodcastRanks from './podcast-ranks.reducer';
import * as fromPodcastTotals from './podcast-totals.reducer';
import * as fromPodcastGroupCharted from './podcast-group-charted.reducer';
import * as fromEpisode from './episode.reducer';
import * as fromEpisodeAllTimeDownloads from './episode-alltime-downloads.reducer';
import { EpisodeMetricsReducer, EpisodeMetricsModel } from './episode-metrics.reducer';
import { CustomRouterReducer } from './router.reducer';
import { RouterParams } from './models';

export interface RootState {
  routerSerializer: RouterReducerState<RouterParams>;
  router: RouterParams;
  account: AccountState;
  podcast: fromPodcast.State;
  episode: fromEpisode.State;
  podcastAllTimeDownloads: fromPodcastAllTimeDownloads.State;
  episodeAllTimeDownloads: fromEpisodeAllTimeDownloads.State;
  podcastMetrics: PodcastMetricsState;
  podcastRanks: fromPodcastRanks.State;
  podcastTotals: fromPodcastTotals.State;
  podcastGroupCharted: fromPodcastGroupCharted.State;
  episodeMetrics: EpisodeMetricsModel[];
}

// TypeScript is complaining about this ActionReducerMap again, not sure why ugh
export const reducers: ActionReducerMap<RootState> = {
  routerSerializer: routerReducer,
  router: CustomRouterReducer,
  account: AccountReducer,
  podcast: fromPodcast.reducer,
  episode: fromEpisode.reducer,
  podcastAllTimeDownloads: fromPodcastAllTimeDownloads.reducer,
  episodeAllTimeDownloads: fromEpisodeAllTimeDownloads.reducer,
  podcastMetrics: PodcastMetricsReducer,
  podcastRanks: fromPodcastRanks.reducer,
  podcastTotals: fromPodcastTotals.reducer,
  podcastGroupCharted: fromPodcastGroupCharted.reducer,
  episodeMetrics: EpisodeMetricsReducer,
};

export { CustomSerializer } from './router.serializer';

export const selectAppState = (state: RootState) => state;
