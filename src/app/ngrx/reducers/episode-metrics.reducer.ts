import * as ACTIONS from '../actions';

export interface EpisodeMetricsModel {
  seriesId: number;
  id: number;
  guid?: string;
  page?: number;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
  allTimeDownloads?: number;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}

const initialState = [];

const episodeIndex = (state: EpisodeMetricsModel[], id: number, seriesId: number) => {
  return state.findIndex(e => e.seriesId === seriesId && e.id === id);
};

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD: {
      const {id, seriesId, guid, page} = action.payload;
      const epIdx = episodeIndex(state, id, seriesId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], id, seriesId, guid, page, loading: true, loaded: false};
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {seriesId, id, guid, page, loading: true, loaded: false};
        newState = [episode, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_SUCCESS: {
      const {id, seriesId, guid, page, metricsPropertyName, metrics} = action.payload;
      const epIdx = episodeIndex(state, id, seriesId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], id, seriesId, guid, page, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {seriesId, id, guid, page, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [episode, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_FAILURE: {
      const {id, seriesId, guid, page, error} = action.payload;
      const epIdx = episodeIndex(state, id, seriesId);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], id, seriesId, guid, page, error, loading: false, loaded: false};
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {seriesId, id, guid, page, error, loading: false, loaded: false};
        newState = [episode, ...state];
      }
      return newState;
    }
  }
  return state;
}
