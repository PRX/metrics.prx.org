import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsPodcastsSuccessAction,
  CmsPodcastEpisodePageAction, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
import { CastleFilterAction, CastlePodcastMetricsAction, CastlePodcastChartToggleAction,
  CastleEpisodeMetricsAction, CastleEpisodeChartToggleAction, CastlePodcastAllTimeMetricsLoadAction, CastlePodcastAllTimeMetricsSuccessAction, CastlePodcastAllTimeMetricsFailureAction, CastleEpisodeAllTimeMetricsLoadAction, CastleEpisodeAllTimeMetricsSuccessAction, CastleEpisodeAllTimeMetricsFailureAction } from './castle.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';

export type AllActions
  = CmsPodcastsSuccessAction
  | CmsPodcastEpisodePageAction
  | CmsPodcastEpisodePageSuccessAction
  | CmsPodcastEpisodePageFailureAction
  | CastleFilterAction
  | CastlePodcastMetricsAction
  | CastlePodcastChartToggleAction
  | CastleEpisodeMetricsAction
  | CastleEpisodeChartToggleAction
  | CastlePodcastAllTimeMetricsLoadAction
  | CastlePodcastAllTimeMetricsSuccessAction
  | CastlePodcastAllTimeMetricsFailureAction
  | CastleEpisodeAllTimeMetricsLoadAction
  | CastleEpisodeAllTimeMetricsSuccessAction
  | CastleEpisodeAllTimeMetricsFailureAction
  | RouterNavigationAction
  | GoogleAnalyticsEventAction;

export { ActionTypes } from './action.types';
export { CmsPodcastsSuccessPayload, CmsPodcastsSuccessAction,
  CmsPodcastsAction, CmsPodcastsFailureAction,
  CmsEpisodePagePayload, CmsPodcastEpisodePageAction,
  CmsEpisodePageSuccessPayload, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
export { CastleFilterPayload, CastleFilterAction,
  CastlePodcastMetricsPayload, CastlePodcastMetricsAction,
  CastlePodcastChartTogglePayload, CastlePodcastChartToggleAction,
  CastlePodcastAllTimeMetricsLoadPayload, CastlePodcastAllTimeMetricsLoadAction,
  CastlePodcastAllTimeMetricsSuccessPayload, CastlePodcastAllTimeMetricsSuccessAction,
  CastlePodcastAllTimeMetricsFailureAction,
  CastleEpisodeAllTimeMetricsLoadPayload, CastleEpisodeAllTimeMetricsLoadAction,
  CastleEpisodeAllTimeMetricsSuccessPayload, CastleEpisodeAllTimeMetricsSuccessAction,
  CastleEpisodeAllTimeMetricsFailureAction,
  CastleEpisodeMetricsPayload, CastleEpisodeMetricsAction,
  CastleEpisodeChartTogglePayload, CastleEpisodeChartToggleAction} from './castle.action.creator';
export { GoogleAnalyticsEventPayload, GoogleAnalyticsEventAction } from './google-analytics.action.creator';
