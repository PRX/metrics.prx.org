import * as ACTIONS from '../actions';

export interface EpisodeMetricsModel {
  podcastId: string;
  guid?: string;
  page?: number;
  monthlyReach?: any[][];
  weeklyReach?: any[][];
  dailyReach?: any[][];
  hourlyReach?: any[][];
  charted?: boolean;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}

const initialState = [];

const episodeIndex = (state: EpisodeMetricsModel[], guid: string) => {
  return state.findIndex(e => e.guid === guid);
};

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD: {
      const {podcastId, guid, page} = action.payload;
      const epIdx = episodeIndex(state, guid);
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
      const epIdx = episodeIndex(state, guid);
      let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
      if (epIdx > -1) {
        episode = {...state[epIdx], podcastId, guid, page, charted: true, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {podcastId, guid, page, charted: true, loading: false, loaded: true};
        episode[metricsPropertyName] = metrics;
        newState = [episode, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_FAILURE: {
      const {podcastId, guid, page, error} = action.payload;
      const epIdx = episodeIndex(state, guid);
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
    case ACTIONS.ActionTypes.CHART_SINGLE_EPISODE: {
      const { guid } = action.payload;
      return state.map(metric => {
        return {...metric, charted: metric.guid === guid};
      });
    }
    case ACTIONS.ActionTypes.CHART_TOGGLE_EPISODE: {
      const { guid, charted } = action.payload;
      const epIdx = episodeIndex(state, guid);
      if (epIdx > -1) {
        const episode = {...state[epIdx], charted};
        return [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      }
    }
    break;
  }
  return state;
}
