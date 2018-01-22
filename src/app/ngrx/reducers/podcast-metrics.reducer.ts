import { ActionTypes, AllActions,
  CastlePodcastMetricsAction, CastlePodcastChartToggleAction, CastlePodcastAllTimeMetricsSuccessAction } from '../actions';
import { getMetricsProperty } from './models';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId?: string;
  charted?: boolean;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
  allTimeDownloads?: number;
}

const initialState = [];

const podcastIndex = (state: PodcastMetricsModel[], seriesId: number) => {
  return state.findIndex(p => p.seriesId === seriesId);
};

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS:
      if (action instanceof CastlePodcastMetricsAction) {
        const { seriesId, feederId } = action.payload.podcast;
        const metricsProperty = getMetricsProperty(action.payload.filter.interval, action.payload.metricsType);
        const podcastIdx = podcastIndex(state, seriesId);
        let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
        if (podcastIdx > -1) {
          podcast = {...state[podcastIdx], seriesId};
          podcast[metricsProperty] = action.payload.metrics;
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
        } else {
          podcast = {seriesId, feederId};
          podcast[metricsProperty] = action.payload.metrics;
          newState = [podcast, ...state];
        }
        return newState;
      }
    break;
    case ActionTypes.CASTLE_PODCAST_CHART_TOGGLE:
      if (action instanceof CastlePodcastChartToggleAction) {
        const { seriesId } = action.payload;
        const podcastIdx = podcastIndex(state, seriesId);
        let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
        if (podcastIdx > -1) {
          podcast = {...state[podcastIdx], charted: action.payload.charted, seriesId};
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
        } else {
          podcast = {seriesId, charted: action.payload.charted};
          newState = [podcast, ...state];
        }
        return newState;
      }
      break;
    case ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_SUCCESS:
      if (action instanceof CastlePodcastAllTimeMetricsSuccessAction) {
        const { seriesId } = action.payload.podcast;
        const podcastIdx = podcastIndex(state, seriesId);

        if (podcastIdx > -1) {
          let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
          podcast = {seriesId, ...state[podcastIdx], allTimeDownloads: action.payload.allTimeDownloads};
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
          return newState;
        } else {
          return state;
        }
      }
      break;
    case ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_FAILURE:
      break;
  }
  return state;
}
