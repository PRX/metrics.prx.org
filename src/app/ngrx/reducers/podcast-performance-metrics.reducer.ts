import * as ACTIONS from '../actions';

export interface PodcastPerformanceMetricsModel {
  seriesId: number;
  feederId: string;
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
  entities?: {[id: number]: PodcastPerformanceMetricsModel};
}

export const initialState = {
  entities: {}
};

export function PodcastPerformanceMetricsReducer(state: PodcastPerformanceMetricsState = initialState, action: ACTIONS.AllActions) {
  switch (action.type) {
    case ACTIONS.ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_LOAD: {
      const {seriesId, feederId} = action.payload;
      return {
        entities: {
          ...state.entities,
          [seriesId]: {...state.entities[seriesId], seriesId, feederId, loading: true, loaded: false}
        }
      };
    }
    case ACTIONS.ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_SUCCESS: {
      const {seriesId, feederId, total, previous7days, this7days, yesterday, today} = action['payload'];
      return {
        entities: {
          ...state.entities,
          [seriesId]: {
            seriesId,
            feederId,
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
      const {seriesId, feederId, error} = action['payload'];
      return {
        entities: {
          ...state.entities,
          [seriesId]: {...state.entities[seriesId], seriesId, feederId, error, loading: false, loaded: false}
        }
      };
    }
  }
  return state;
}

export const getPodcastPerformanceMetricsEntities = (state: PodcastPerformanceMetricsState) => state.entities;
