import ActionTypes from './action.types';
import { EpisodeModel, PodcastModel, IntervalModel, FilterModel } from '../../shared';

export const castlePodcastMetrics = (podcast: PodcastModel, interval: IntervalModel, metricsType, metrics: any[][]) => {
  return {
    type: ActionTypes.CASTLE_PODCAST_METRICS,
    payload: {
      podcast,
      interval,
      metricsType,
      metrics
    }
  };
};

export const castleEpisodeMetrics = (episode: EpisodeModel, interval: IntervalModel, metricsType, metrics: any[][]) => {
  return {
    type: ActionTypes.CASTLE_EPISODE_METRICS,
    payload: {
      episode,
      interval,
      metricsType,
      metrics
    }
  };
};

export const castleFilter = (filter: FilterModel) => {
  return {
    type: ActionTypes.CASTLE_FILTER,
    payload: {
      filter
    }
  };
};

