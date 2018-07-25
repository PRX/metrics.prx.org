import * as ACTIONS from '../actions';

export interface EpisodeMetricsModel {
  seriesId: number;
  feederId: string;
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

const episodeIndex = (state: EpisodeMetricsModel[], guid: string, seriesId: number) => {
  return state.findIndex(e => e.seriesId === seriesId && e.guid === guid);
};

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD: {
      const {seriesId, feederId, guid, page} = action.payload;
      const epIdx = episodeIndex(state, guid, seriesId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], seriesId, feederId, guid, page, loading: true, loaded: false};
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {seriesId, feederId, guid, page, loading: true, loaded: false};
        newState = [episode, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_SUCCESS: {
      const {seriesId, feederId, guid, page, metricsPropertyName, metrics} = action.payload;
      const epIdx = episodeIndex(state, guid, seriesId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], seriesId, feederId, guid, page, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {seriesId, feederId, guid, page, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [episode, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_FAILURE: {
      const {seriesId, feederId, guid, page, error} = action.payload;
      const epIdx = episodeIndex(state, guid, seriesId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], seriesId, feederId, guid, page, error, loading: false, loaded: false};
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {seriesId, feederId, guid, page, error, loading: false, loaded: false};
        newState = [episode, ...state];
      }
      return newState;
    }
  }
  return state;
}
