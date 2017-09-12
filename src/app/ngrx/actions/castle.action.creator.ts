import ActionTypes from './action.types';
import { EpisodeModel, PodcastModel, FilterModel } from '../../shared';

export const castlePodcastMetrics = (podcast: PodcastModel, filter: FilterModel, metricsType, metrics: any[][]) => {
  return {
    type: ActionTypes.CASTLE_PODCAST_METRICS,
    payload: {
      podcast,
      filter,
      metricsType,
      metrics
    }
  };
};

export const castleEpisodeMetrics = (episode: EpisodeModel, filter: FilterModel, metricsType, metrics: any[][]) => {
  return {
    type: ActionTypes.CASTLE_EPISODE_METRICS,
    payload: {
      episode,
      filter,
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

