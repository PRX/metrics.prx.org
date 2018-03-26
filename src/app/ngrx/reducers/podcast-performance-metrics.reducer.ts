import * as ACTIONS from '../actions';
import { PodcastPerformanceMetricsModel } from './models';
import { getTotal } from '../../shared/util/metrics.util';

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
      const {seriesId, feederId, total, previous7days, this7days, yesterday, today} = action.payload;
      return {
        entities: {
          ...state.entities,
          [seriesId]: {
            seriesId,
            feederId,
            total: state.entities[seriesId] && state.entities[seriesId].total > total ? state.entities[seriesId].total : total,
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
      const {seriesId, feederId, error} = action.payload;
      return {
        entities: {
          ...state.entities,
          [seriesId]: {...state.entities[seriesId], seriesId, feederId, error, loading: false, loaded: false}
        }
      };
    }
    case ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_SUCCESS: {
      const { seriesId, feederId, metrics } = action.payload;
      const total = getTotal(metrics);
      if (state.entities[seriesId] && total > state.entities[seriesId].total) {
        return {
          entities: {
            ...state.entities,
            [seriesId]: {
              seriesId,
              feederId,
              total,
              previous7days: state.entities[seriesId].previous7days,
              this7days: state.entities[seriesId].this7days,
              yesterday: state.entities[seriesId].yesterday,
              today: state.entities[seriesId].today,
              loading: false,
              loaded: true
            }
          }
        };
      } else if (!state.entities[seriesId]) {
        // 1) else if not yet on state, set total but also set loaded: false
        // 2) when performance metrics is loaded check if exists to set total if larger
        return {
          entities: {
            ...state.entities,
            [seriesId]: {
              seriesId,
              feederId,
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

export const getPodcastPerformanceMetricsEntities = (state: PodcastPerformanceMetricsState) => state.entities;
