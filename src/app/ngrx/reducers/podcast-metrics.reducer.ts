import { ActionTypes, ActionWithPayload, CastlePodcastMetricsPayload } from '../actions';
import { PodcastMetricsModel } from '../model';

const initialState = [];

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: ActionWithPayload<CastlePodcastMetricsPayload>) {
  let podcastIdx: number, podcast: PodcastMetricsModel, newState: PodcastMetricsModel[], metricsProperty: string;
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS:
      metricsProperty = action.payload.filter.interval.key
        + action.payload.metricsType.charAt(0).toUpperCase()
        + action.payload.metricsType.slice(1);
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
