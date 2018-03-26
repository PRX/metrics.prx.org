import * as ACTIONS from '../actions';
import { EpisodePerformanceMetricsModel } from './models';
import { getTotal } from '../../shared/util/metrics.util';

export interface EpisodePerformanceMetricsState {
  entities?: {[id: number]: EpisodePerformanceMetricsModel};
}

export const initialState = {
  entities: {}
};

export function EpisodePerformanceMetricsReducer(state: EpisodePerformanceMetricsState = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_LOAD: {
      const {seriesId, id, guid} = action.payload;
      return {
        entities: {
          ...state.entities,
          [id]: {...state.entities[id], seriesId, id, guid, loading: true, loaded: false}
        }
      };
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_SUCCESS: {
      const {seriesId, id, guid, total, previous7days, this7days, yesterday, today} = action.payload;
      return {
        entities: {
          ...state.entities,
          [id]: {seriesId,
            id,
            guid,
            total: state.entities[id] && state.entities[id].total > total ? state.entities[id].total : total,
            previous7days,
            this7days,
            yesterday,
            today,
            loading: false,
            loaded: true
          }
        }
      };
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_FAILURE: {
      const {seriesId, id, guid, error} = action.payload;
      return {
        entities: {
          ...state.entities,
          [id]: {...state.entities[id], seriesId, id, guid, error, loading: false, loaded: false}
        }
      };
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_SUCCESS: {
      const {id, seriesId, guid, metrics} = action.payload;
      const total = getTotal(metrics);
      if (state.entities[id] && total > state.entities[id].total) {
        return {
          entities: {
            ...state.entities,
            [id]: {
              seriesId,
              id,
              guid,
              total,
              previous7days: state.entities[id].previous7days,
              this7days: state.entities[id].this7days,
              yesterday: state.entities[id].yesterday,
              today: state.entities[id].today,
              loading: false,
              loaded: true
            }
          }
        };
      } else {
        // 1) else if not yet on state, set total but also set loaded: false
        // 2) when performance metrics is loaded check if exists to set total if larger
        return {
          entities: {
            ...state.entities,
            [id]: {
              seriesId,
              id,
              guid,
              total,
              loading: false,
              loaded: false
            }
          }
        };
      }
    }
  }
  return state;
}

export const getEpisodePerformanceMetricsEntities = (state: EpisodePerformanceMetricsState) => state.entities;
