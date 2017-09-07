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
      epIdx = state.findIndex(e => e.seriesId === action.payload.podcast.seriesId && e.id === action.payload.episode.id);
      if (epIdx > -1) {
        episode = Object.assign({}, state[epIdx]);
        episode[metricsProperty] = action.payload.metrics;
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = {
          seriesId: action.payload.podcast.seriesId,
          id: action.payload.episode.id,
          guid: action.payload.episode.guid
        };
        episode[metricsProperty] = action.payload.metrics;
        newState = [episode, ...state];
      }
      console.log('EpisodeMetricsReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}
