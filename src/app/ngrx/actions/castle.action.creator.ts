import { CastlePodcastMetricsAction, CastleEpisodeMetricsAction, CastleFilterAction } from './action.types';
import { EpisodeModel, PodcastModel, FilterModel, MetricsType } from '../model';

// TODO: action creators are now classes, so I can get rid of these wrappers and just do new XyzAction()

export const castlePodcastMetrics = (podcast: PodcastModel,
                                     filter: FilterModel,
                                     metricsType: MetricsType,
                                     metrics: any[][]): CastlePodcastMetricsAction => {
  return new CastlePodcastMetricsAction({podcast, filter, metricsType, metrics});
};

export const castleEpisodeMetrics = (episode: EpisodeModel,
                                     filter: FilterModel,
                                     metricsType: MetricsType,
                                     metrics: any[][]): CastleEpisodeMetricsAction => {
  return new CastleEpisodeMetricsAction({episode, filter, metricsType, metrics});
};

export const castleFilter = (filter: FilterModel): CastleFilterAction => {
  return new CastleFilterAction({filter});
};

