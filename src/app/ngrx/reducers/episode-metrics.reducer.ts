import * as ACTIONS from '../actions';

export interface EpisodeMetricsModel {
  podcastId: string;
  guid?: string;
  page?: number;
  monthlyReach?: any[][];
  weeklyReach?: any[][];
  dailyReach?: any[][];
  hourlyReach?: any[][];
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}

const initialState = [];

const episodeIndex = (state: EpisodeMetricsModel[], guid: string, podcastId: string) => {
  return state.findIndex(e => e.podcastId === podcastId && e.guid === guid);
};

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD: {
      const {podcastId, guid, page} = action.payload;
      const epIdx = episodeIndex(state, guid, podcastId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], podcastId, guid, page, loading: true, loaded: false};
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {podcastId, guid, page, loading: true, loaded: false};
        newState = [episode, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_SUCCESS: {
      const {podcastId, guid, page, metricsPropertyName, metrics} = action.payload;
      const epIdx = episodeIndex(state, guid, podcastId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], podcastId, guid, page, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {podcastId, guid, page, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [episode, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_FAILURE: {
      const {podcastId, guid, page, error} = action.payload;
      const epIdx = episodeIndex(state, guid, podcastId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], podcastId, guid, page, error, loading: false, loaded: false};
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {podcastId, guid, page, error, loading: false, loaded: false};
        newState = [episode, ...state];
      }
      return newState;
    }
  }
  return state;
}
