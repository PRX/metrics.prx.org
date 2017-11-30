import { ActionTypes, CastlePodcastMetricsAction } from '../actions';
import { PodcastMetricsModel } from '../model';
import { getMetricsProperty } from '../../shared/util/metrics.util';

const initialState = [];

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: CastlePodcastMetricsAction) {
  let podcastIdx: number, podcast: PodcastMetricsModel, newState: PodcastMetricsModel[], metricsProperty: string;
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS:
      metricsProperty = getMetricsProperty(action.payload.filter.interval, action.payload.metricsType);
      podcastIdx = state.findIndex(p => p.seriesId === action.payload.podcast.seriesId);
      if (podcastIdx > -1) {
        podcast = {...state[podcastIdx]};
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
      // console.log('PodcastMetricsReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}
