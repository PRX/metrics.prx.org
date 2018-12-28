import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions'
import { PodcastMetrics } from './models/podcast-metrics.model';

const initialState = [];

const podcastIndex = (state: PodcastMetrics[], id: string) => {
  return state.findIndex(p => p.id === id);
};

export function PodcastMetricsReducer(state: PodcastMetrics[] = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS_LOAD: {
      const { id } = action.payload;
      const podcastIdx = podcastIndex(state, id);
      let podcast: PodcastMetrics, newState: PodcastMetrics[];
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx], error: null, loading: true, loaded: false};
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {id, charted: true, error: null, loading: true, loaded: false};
        newState = [podcast, ...state];
      }
      return newState;
    }
    case ActionTypes.CASTLE_PODCAST_METRICS_SUCCESS: {
      const { id, metricsPropertyName, metrics } = action.payload;
      const podcastIdx = podcastIndex(state, id);
      let podcast: PodcastMetrics, newState: PodcastMetrics[];
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx], loading: false, loaded: true};
        podcast[metricsPropertyName] = metrics;
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {id, charted: true, loading: false, loaded: true};
        podcast[metricsPropertyName] = metrics;
        newState = [podcast, ...state];
      }
      return newState;
    }
    case ActionTypes.CASTLE_PODCAST_METRICS_FAILURE: {
      const { id, error } = action.payload;
      const podcastIdx = podcastIndex(state, id);
      let podcast: PodcastMetrics, newState: PodcastMetrics[];
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx], error, loading: false, loaded: false};
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {id, error, loading: false, loaded: false};
        newState = [podcast, ...state];
      }
      return newState;
    }
    case ActionTypes.CHART_TOGGLE_PODCAST: {
      const { id, charted } = action.payload;
      const podcastIdx = podcastIndex(state, id);
      if (podcastIdx > -1) {
        const podcast = {...state[podcastIdx], charted};
        return [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      }
    }
    break;
  }
  return state;
}
