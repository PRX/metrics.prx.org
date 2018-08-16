import * as ACTIONS from '../actions';

export interface EpisodePerformanceMetricsModel {
  id: number;
  guid: string;
  total?: number;
  previous7days?: number;
  this7days?: number;
  yesterday?: number;
  today?: number;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}

export interface EpisodePerformanceMetricsState {
  entities?: {[guid: string]: EpisodePerformanceMetricsModel};
}

export const initialState = {
  entities: {}
};

export function EpisodePerformanceMetricsReducer(state: EpisodePerformanceMetricsState = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_LOAD: {
      const {id, guid} = action.payload;
      return {
        entities: {
          ...state.entities,
          [guid]: {...state.entities[guid], id, guid, error: null, loading: true, loaded: false}
        }
      };
    }
    case ACTIONS.ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_SUCCESS: {
      const {id, guid, total, previous7days, this7days, yesterday, today} = action.payload;
      return {
        entities: {
          ...state.entities,
          [guid]: {
            id,
            guid,
            total,
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
      const {id, guid, error} = action.payload;
      return {
        entities: {
          ...state.entities,
          [guid]: {...state.entities[guid], id, guid, error, loading: false, loaded: false}
        }
      };
    }
  }
  return state;
}

export const getEpisodePerformanceMetricsEntities = (state: EpisodePerformanceMetricsState) => state.entities;
