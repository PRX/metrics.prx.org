import { ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import * as fromUser from './user.reducer';
import * as fromPodcast from './podcast.reducer';
import * as fromPodcastAllTimeDownloads from './podcast-alltime-downloads.reducer';
import { PodcastDownloadsReducer, PodcastDownloadsState } from './podcast-downloads.reducer';
import { PodcastListenersReducer, PodcastListenersState } from './podcast-listeners.reducer';
import * as fromPodcastRanks from './podcast-ranks.reducer';
import * as fromPodcastTotals from './podcast-totals.reducer';
import * as fromGroupCharted from './group-charted.reducer';
import * as fromEpisode from './episode.reducer';
import * as fromEpisodeSelect from './episode-select.reducer';
import * as fromEpisodeAllTimeDownloads from './episode-alltime-downloads.reducer';
import * as fromEpisodeRanks from './episode-ranks.reducer';
import * as fromEpisodeTotals from './episode-totals.reducer';
import * as fromEpisodeDownloads from './episode-downloads.reducer';
import * as fromEpisodeDropday from './episode-dropday.reducer';
import { CustomRouterReducer } from './router.reducer';
import { RouterParamsState } from './models';

export interface RootState {
  routerSerializer: RouterReducerState<RouterParamsState>;
  router: RouterParamsState;
  user: fromUser.State;
  podcast: fromPodcast.State;
  episode: fromEpisode.State;
  episodeSelect: fromEpisodeSelect.State;
  podcastAllTimeDownloads: fromPodcastAllTimeDownloads.State;
  episodeAllTimeDownloads: fromEpisodeAllTimeDownloads.State;
  PodcastDownloads: PodcastDownloadsState;
  podcastListeners: PodcastListenersState;
  podcastRanks: fromPodcastRanks.State;
  podcastTotals: fromPodcastTotals.State;
  groupCharted: fromGroupCharted.State;
  episodeDownloads: fromEpisodeDownloads.State;
  episodeRanks: fromEpisodeRanks.State;
  episodeTotals: fromEpisodeTotals.State;
  episodeDropday: fromEpisodeDropday.State;
}

// TypeScript is complaining about this ActionReducerMap again, not sure why ugh
export const reducers: ActionReducerMap<RootState> = {
  routerSerializer: routerReducer,
  router: CustomRouterReducer,
  user: fromUser.reducer,
  podcast: fromPodcast.reducer,
  episode: fromEpisode.reducer,
  episodeSelect: fromEpisodeSelect.reducer,
  podcastAllTimeDownloads: fromPodcastAllTimeDownloads.reducer,
  episodeAllTimeDownloads: fromEpisodeAllTimeDownloads.reducer,
  PodcastDownloads: PodcastDownloadsReducer,
  podcastListeners: PodcastListenersReducer,
  podcastRanks: fromPodcastRanks.reducer,
  podcastTotals: fromPodcastTotals.reducer,
  groupCharted: fromGroupCharted.reducer,
  episodeDownloads: fromEpisodeDownloads.reducer,
  episodeRanks: fromEpisodeRanks.reducer,
  episodeTotals: fromEpisodeTotals.reducer,
  episodeDropday: fromEpisodeDropday.reducer
};

export { CustomSerializer } from './router.serializer';

export const selectAppState = (state: RootState) => state;
