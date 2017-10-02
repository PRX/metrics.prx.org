import { ActionTypes, ActionWithPayload, CastleEpisodeMetricsPayload } from '../actions';
import { EpisodeMetricsModel, FilterModel, MetricsType } from '../model';
import { getTotal } from './metrics.util';

const initialState = [];

export function EpisodeMetricsReducer(state: EpisodeMetricsModel[] = initialState, action: ActionWithPayload<CastleEpisodeMetricsPayload>) {
  let epIdx: number, episode: EpisodeMetricsModel, newState: EpisodeMetricsModel[];
  switch (action.type) {
    case ActionTypes.CASTLE_EPISODE_METRICS:
      const { id, seriesId, guid } = action.payload.episode;
      epIdx = state.findIndex(e => e.seriesId === seriesId && e.id === id);
      if (epIdx > -1) {
        episode = {...state[epIdx], guid};
        setEpisodeMetrics(action.payload.filter, action.payload.metricsType, episode, action.payload.metrics);
        newState = [...state.slice(0, epIdx), episode, ...state.slice(epIdx + 1)];
      } else {
        episode = { seriesId, id, guid };
        setEpisodeMetrics(action.payload.filter, action.payload.metricsType, episode, action.payload.metrics);
        newState = [episode, ...state];
      }
      // console.log('EpisodeMetricsReducer', action.type, newState);
      return newState;
    default:
      return state;
  }
}

const setEpisodeMetrics = (filter: FilterModel, metricsType: MetricsType, episode: EpisodeMetricsModel, metrics: any[][]) => {
  const metricsProperty = filter.interval.key
    + metricsType.charAt(0).toUpperCase()
    + metricsType.slice(1);
  episode[metricsProperty] = metrics;
};
