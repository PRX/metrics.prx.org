import { ActionTypes, AllActions, CastlePodcastMetricsAction, CastlePodcastChartToggleAction } from '../actions';
import { getMetricsProperty } from './metrics.type';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId?: string;
  charted?: boolean;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
}

const initialState = [];

export function PodcastMetricsReducer(state: PodcastMetricsModel[] = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_PODCAST_METRICS:
      if (action instanceof CastlePodcastMetricsAction) {
        const { seriesId, feederId } = action.payload.podcast;
        const metricsProperty = getMetricsProperty(action.payload.filter.interval, action.payload.metricsType);
        const podcastIdx = podcastIndex(state, seriesId);
        let podcast: PodcastMetricsModel, newState: PodcastMetricsModel[];
        if (podcastIdx > -1) {
          podcast = {...state[podcastIdx]};
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
          podcast = {...state[podcastIdx], charted: action.payload.charted};
          newState = [...state.slice(0, podcastIdx), podcast, ...state.slice(podcastIdx + 1)];
        } else {
          podcast = {seriesId, charted: action.payload.charted};
          newState = [podcast, ...state];
        }
        return newState;
      }
      break;
  }
  return state;
}

const podcastIndex = (state: PodcastMetricsModel[], seriesId: number) => {
  return state.findIndex(p => p.seriesId === seriesId);
};
