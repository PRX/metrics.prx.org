import { ActionTypes, AllActions,
  CastleEpisodeMetricsAction, CastleEpisodeChartToggleAction, CastleEpisodeAllTimeMetricsSuccessAction } from '../actions';
import { IntervalModel, MetricsType, getMetricsProperty } from './models';

export interface EpisodeMetricsModel {
  seriesId: number;
  id: number;
  guid?: string;
  page?: number;
  charted?: boolean;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
  allTimeDownloads?: number;
}

const initialState = [];

const setEpisodeMetrics = (interval: IntervalModel, metricsType: MetricsType, episode: EpisodeMetricsModel, metrics: any[][]) => {
  const metricsProperty = getMetricsProperty(interval, metricsType);
  episode[metricsProperty] = metrics;
};

const episodeIndex = (state: EpisodeMetricsModel[], id: number, seriesId: number) => {
  return state.findIndex(e => e.seriesId === seriesId && e.id === id);
};


export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: AllActions) {
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_METRICS:
      if (action instanceof CastleEpisodeMetricsAction) {
        const {id, seriesId, guid, page} = action.payload.episode;
        const epIdx = episodeIndex(state, id, seriesId);
        let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
        if (epIdx > -1) {
          episode = {...state[epIdx], id, seriesId, guid, page};
          setEpisodeMetrics(action.payload.filter.interval, action.payload.metricsType, episode, action.payload.metrics);
          newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
        } else {
          episode = {seriesId, id, guid, page};
          setEpisodeMetrics(action.payload.filter.interval, action.payload.metricsType, episode, action.payload.metrics);
          newState = [episode, ...state];
        }
        return newState;
      }
      break;
    case ActionTypes.CASTLE_EPISODE_CHART_TOGGLE:
      if (action instanceof CastleEpisodeChartToggleAction) {
        const {id, seriesId} = action.payload;
        const epIdx = episodeIndex(state, id, seriesId);
        let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
        if (epIdx > -1) {
          episode = {id, seriesId, ...state[epIdx], charted: action.payload.charted};
          newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
        } else {
          episode = {seriesId, id, charted: action.payload.charted};
          newState = [episode, ...state];
        }
        return newState;
      }
      break;
    case ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_SUCCESS:
      if (action instanceof CastleEpisodeAllTimeMetricsSuccessAction) {
        const { id, seriesId } = action.payload.episode;
        const epIdx = episodeIndex(state, id, seriesId);

        if (epIdx > -1) {
          let episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
          episode = {id, seriesId, ...state[epIdx], allTimeDownloads: action.payload.allTimeDownloads};
          newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
          return newState;
        } else {
          return state;
        }
      }
      break;
    case ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_FAILURE:
      break;

  }
  return state;
}
