import { Action } from '@ngrx/store';
import ActionTypes from '../actions/action.types';
import { PodcastMetricsModel } from '../../shared';

const initialState = [];

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: Action) {
  let podcastIdx: number, podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS:
      const metricsProperty = action.payload.interval.key
        + action.payload.metricsType.charAt(0).toUpperCase()
        + action.payload.metricsType.slice(1);
      podcastIdx = state.findIndex(p => p.seriesId === action.payload.podcast.seriesId);
      if (podcastIdx > -1) {
        podcast = Object.assign({}, state[podcastIdx]);
        podcast[metricsProperty] = action.payload.metrics;
        newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
      } else {
        podcast = {
          seriesId: action.payload.podcast.seriesId,
          feederId: action.payload.podcast.feederId
        };
        podcast[metricsProperty] = action.payload.metrics;
        newState = [podcast, ...state];
      }
      console.log('PodcastMetricsReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}
