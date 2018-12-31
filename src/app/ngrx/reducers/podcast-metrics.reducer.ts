import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions'
import { PodcastMetrics } from './models/podcast-metrics.model';
import { UpdateStr } from '@ngrx/entity/src/models';

export interface PodcastMetricsState extends EntityState<PodcastMetrics> {

}
const podcastIndex = (state: PodcastMetrics[], id: string) => {
  return state.findIndex(p => p.id === id);
};

export const adapter: EntityAdapter<PodcastMetrics> = createEntityAdapter<PodcastMetrics>(); 

export const initialState: EntityState<PodcastMetrics> = adapter.getInitialState();

export function PodcastMetricsReducer(state: PodcastMetricsState = initialState, action: AllActions) {
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
      const podcastUpdate: UpdateStr<PodcastMetrics> = {
        id: id,
        changes: {
          [metricsPropertyName]: metrics
        }
      }
      return adapter.upsertOne(podcastUpdate, state);
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
      const podcastUpdate: UpdateStr<PodcastMetrics> = {
        id: action.payload.id,
        changes: {
          charted: action.payload.charted
        }
      }
      return adapter.updateOne(podcastUpdate, state);
    }
    default:
      return state;
  }
}

export const {
  selectIds: selectPodcastMetricsIds,
  selectEntities: selectPodcastMetricsEntities,
  selectAll: selectAllPodcastMetrics,
  selectTotal: selectTotalPodcastMetrics,
} = adapter.getSelectors();
