import { Action } from '@ngrx/store';
import ActionTypes from '../actions/action.types';
import { EpisodeMetricsModel } from '../../shared';

const initialState = [];

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: Action) {
  let epIdx: number, episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_METRICS:
      const metricsProperty = action.payload.interval.key
        + action.payload.metricsType.charAt(0).toUpperCase()
        + action.payload.metricsType.slice(1);
      const { id, seriesId, guid } = action.payload.episode;

      epIdx = state.findIndex(e => e.seriesId === seriesId && e.id === id);
      if (epIdx > -1) {
        episode = Object.assign({}, state[epIdx], {guid});
        episode[metricsProperty] = action.payload.metrics;
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = { seriesId, id, guid };
        episode[metricsProperty] = action.payload.metrics;
        newState = [episode, ...state];
      }
      console.log('EpisodeMetricsReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}
