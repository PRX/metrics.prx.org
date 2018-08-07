import * as ACTIONS from '../actions';

export interface PodcastPerformanceMetricsModel {
  id: string;
  total?: number;
  previous7days?: number;
  this7days?: number;
  yesterday?: number;
  today?: number;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}

export interface PodcastPerformanceMetricsState {
  entities?: {[id: string]: PodcastPerformanceMetricsModel};
}

export const initialState = {
  entities: {}
};

export function PodcastPerformanceMetricsReducer(state: PodcastPerformanceMetricsState = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_LOAD: {
      const {id} = action.payload;
      return {
        entities: {
          ...state.entities,
          [id]: {...state.entities[id], loading: true, loaded: false}
        }
      };
    }
    case ACTIONS.ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_SUCCESS: {
      const {id, total, previous7days, this7days, yesterday, today} = action.payload;
      return {
        entities: {
          ...state.entities,
          [id]: {
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
    case ACTIONS.ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_FAILURE: {
      const {id, error} = action.payload;
      return {
        entities: {
          ...state.entities,
          [id]: {...state.entities[id], error, loading: false, loaded: false}
        }
      };
    }
  }
  return state;
}

export const getPodcastPerformanceMetricsEntities = (state: PodcastPerformanceMetricsState) => state.entities;
