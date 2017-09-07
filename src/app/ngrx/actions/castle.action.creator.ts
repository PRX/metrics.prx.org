import ActionTypes from './action.types';
import { EpisodeModel, PodcastModel, IntervalModel } from '../../shared';

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

export const castleEpisodeMetrics = (podcast: PodcastModel, episode: EpisodeModel,
                                     interval: IntervalModel, metricsType, metrics: any[][]) => {
  return {
    type: ActionTypes.CASTLE_EPISODE_METRICS,
    payload: {
      podcast,
      episode,
      interval,
      metricsType,
      metrics
    }
  };
};
