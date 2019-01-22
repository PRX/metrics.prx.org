import { ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { AccountReducer, AccountState } from './account.reducer';
import * as fromPodcast from './podcast.reducer';
import * as fromPodcastAllTimeDownloads from './podcast-alltime-downloads.reducer';
import { PodcastDownloadsReducer, PodcastDownloadsState } from './podcast-downloads.reducer';
import * as fromPodcastRanks from './podcast-ranks.reducer';
import * as fromPodcastTotals from './podcast-totals.reducer';
import * as fromGroupCharted from './group-charted.reducer';
import * as fromEpisode from './episode.reducer';
import * as fromEpisodeSelect from './episode-select.reducer';
import * as fromEpisodeAllTimeDownloads from './episode-alltime-downloads.reducer';
import * as fromEpisodeRanks from './episode-ranks.reducer';
import * as fromEpisodeTotals from './episode-totals.reducer';
import { EpisodeMetricsReducer, EpisodeMetricsModel } from './episode-metrics.reducer';
import { CustomRouterReducer } from './router.reducer';
import { RouterParams } from './models';

export interface RootState {
  routerSerializer: RouterReducerState<RouterParams>;
  router: RouterParams;
  account: AccountState;
  podcast: fromPodcast.State;
  episode: fromEpisode.State;
  episodeSelect: fromEpisodeSelect.State;
  podcastAllTimeDownloads: fromPodcastAllTimeDownloads.State;
  episodeAllTimeDownloads: fromEpisodeAllTimeDownloads.State;
  PodcastDownloads: PodcastDownloadsState;
  podcastRanks: fromPodcastRanks.State;
  podcastTotals: fromPodcastTotals.State;
  groupCharted: fromGroupCharted.State;
  episodeMetrics: EpisodeMetricsModel[];
  episodeRanks: fromEpisodeRanks.State;
  episodeTotals: fromEpisodeTotals.State;
}

// TypeScript is complaining about this ActionReducerMap again, not sure why ugh
export const reducers: ActionReducerMap<RootState> = {
  routerSerializer: routerReducer,
  router: CustomRouterReducer,
  account: AccountReducer,
  podcast: fromPodcast.reducer,
  episode: fromEpisode.reducer,
  episodeSelect: fromEpisodeSelect.reducer,
  podcastAllTimeDownloads: fromPodcastAllTimeDownloads.reducer,
  episodeAllTimeDownloads: fromEpisodeAllTimeDownloads.reducer,
  PodcastDownloads: PodcastDownloadsReducer,
  podcastRanks: fromPodcastRanks.reducer,
  podcastTotals: fromPodcastTotals.reducer,
  groupCharted: fromGroupCharted.reducer,
  episodeMetrics: EpisodeMetricsReducer,
  episodeRanks: fromEpisodeRanks.reducer,
  episodeTotals: fromEpisodeTotals.reducer,
};

export { CustomSerializer } from './router.serializer';

export const selectAppState = (state: RootState) => state;
