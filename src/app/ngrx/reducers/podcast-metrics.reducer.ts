import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionTypes, AllActions } from '../actions'
import { PodcastMetrics } from './models/podcast-metrics.model';
import { UpdateStr } from '@ngrx/entity/src/models';

export interface PodcastMetricsState extends EntityState<PodcastMetrics>{};

export const adapter: EntityAdapter<PodcastMetrics> = createEntityAdapter<PodcastMetrics>(); 

export const initialState: EntityState<PodcastMetrics> = adapter.getInitialState();

export function PodcastMetricsReducer(state: PodcastMetricsState = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS_LOAD: {
      const { id } = action.payload;
      const currentIds = <string[]>selectPodcastMetricsIds(state);
      const charted = currentIds.includes(id);
      const podcastUpdate: UpdateStr<PodcastMetrics> = {
        id,
        changes: {
          error: null,
          loading: true,
          loaded: false,
          ...(charted && { charted }) // Conditionally add charted as object member
        }
      }
      return adapter.upsertOne(podcastUpdate, state);
    }
    case ActionTypes.CASTLE_PODCAST_METRICS_SUCCESS: {
      const { id, metricsPropertyName, metrics } = action.payload;
      const podcastUpdate: UpdateStr<PodcastMetrics> = {
        id,
        changes: {
          [metricsPropertyName]: metrics,
          loading: false,
          loaded: true
        }
      }
      return adapter.upsertOne(podcastUpdate, state);
    }
    case ActionTypes.CASTLE_PODCAST_METRICS_FAILURE: {
      const { id, error } = action.payload;
      const podcastUpdate: UpdateStr<PodcastMetrics> = {
        id,
        changes: {
          error,
          loading: false,
          loaded: true
        }
      }
      return adapter.upsertOne(podcastUpdate, state);
    }
    case ActionTypes.CHART_TOGGLE_PODCAST: {
      const { id, charted } = action.payload;
      const podcastUpdate: UpdateStr<PodcastMetrics> = {
        id,
        changes: {
          charted
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
