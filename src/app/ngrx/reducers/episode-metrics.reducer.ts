import { ActionTypes, CastleEpisodeMetricsAction } from '../actions';
import { EpisodeMetricsModel, IntervalModel, MetricsType } from '../model';
import { getMetricsProperty } from '../../shared/util/metrics.util';

const initialState = [];

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: CastleEpisodeMetricsAction) {
  let epIdx: number, episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_METRICS:
      const { id, seriesId, guid, page } = action.payload.episode;
      epIdx = state.findIndex(e => e.seriesId === seriesId && e.id === id);
      if (epIdx > -1) {
        episode = {...state[epIdx], guid, page };
        setEpisodeMetrics(action.payload.filter.interval, action.payload.metricsType, episode, action.payload.metrics);
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = { seriesId, id, guid, page };
        setEpisodeMetrics(action.payload.filter.interval, action.payload.metricsType, episode, action.payload.metrics);
        newState = [episode, ...state];
      }
      // console.log('EpisodeMetricsReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}

const setEpisodeMetrics = (interval: IntervalModel, metricsType: MetricsType, episode: EpisodeMetricsModel, metrics: any[][]) => {
  const metricsProperty = getMetricsProperty(interval, metricsType);
  episode[metricsProperty] = metrics;
};
