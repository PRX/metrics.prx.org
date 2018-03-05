import * as ACTIONS from '../actions';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId?: string;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
  allTimeDownloads?: number;
  previous7days?: number;
  this7days?: number;
  yesterday?: number;
  today?: number;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}

const initialState = [];

const podcastIndex = (state: PodcastMetricsModel[], seriesId: number) => {
  return state.findIndex(p => p.seriesId === seriesId);
};

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_LOAD: {
      const { seriesId, feederId} = action.payload;
      const podcastIdx = podcastIndex(state, seriesId);
      let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx], seriesId, loading: true, loaded: false};
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {seriesId, feederId, loading: true, loaded: false};
        newState = [podcast, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_SUCCESS: {
      const { seriesId, feederId, metricsPropertyName, metrics } = action.payload;
      const podcastIdx = podcastIndex(state, seriesId);
      let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx], seriesId, loading: false, loaded: true};
        podcast[metricsPropertyName] = metrics;
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {seriesId, feederId, loading: false, loaded: true};
        podcast[metricsPropertyName] = metrics;
        newState = [podcast, ...state];
      }
      return newState;
    }
    case ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_FAILURE: {
      const { seriesId, error } = action.payload;
      const podcastIdx = podcastIndex(state, seriesId);
      let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx], seriesId, error, loading: false, loaded: false};
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {seriesId, error, loading: false, loaded: false};
        newState = [podcast, ...state];
      }
      return newState;
    }
  }
  return state;
}
