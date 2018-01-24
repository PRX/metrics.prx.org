import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsAccountAction, CmsAccountSuccessAction, CmsAccountFailureAction, CmsPodcastsSuccessAction,
  CmsPodcastEpisodePageAction, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
import { CastlePodcastAllTimeMetricsLoadAction, CastlePodcastAllTimeMetricsSuccessAction, CastlePodcastAllTimeMetricsFailureAction,
  CastleEpisodeAllTimeMetricsLoadAction, CastleEpisodeAllTimeMetricsSuccessAction, CastleEpisodeAllTimeMetricsFailureAction,
  CastleFilterAction, CastlePodcastChartToggleAction, CastleEpisodeChartToggleAction,
  CastlePodcastMetricsAction, CastleEpisodeMetricsAction } from './castle.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';
import { CustomRouterNavigationAction,
  RouteEpisodesChartedAction, RouteSeriesAction, RouteAdvancedAction } from './router.action.creator';

export type AllActions
  = CmsAccountAction
  | CmsAccountSuccessAction
  | CmsAccountFailureAction
  | CmsPodcastsSuccessAction
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
  | GoogleAnalyticsEventAction
  | CustomRouterNavigationAction
  | RouteEpisodesChartedAction
  | RouteSeriesAction
  | RouteAdvancedAction;

export { ActionTypes } from './action.types';
export { CmsAccountSuccessPayload, CmsAccountSuccessAction,
  CmsAccountAction, CmsAccountFailureAction,
  CmsPodcastsSuccessPayload, CmsPodcastsSuccessAction,
  CmsPodcastsAction, CmsPodcastsFailureAction,
  CmsEpisodePagePayload, CmsPodcastEpisodePageAction,
  CmsEpisodePageSuccessPayload, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
export { CastleFilterPayload, CastleFilterAction,
  CastlePodcastMetricsPayload, CastlePodcastMetricsAction,
  CastlePodcastChartTogglePayload, CastlePodcastChartToggleAction,
  CastlePodcastAllTimeMetricsLoadAction,
  CastlePodcastAllTimeMetricsSuccessPayload, CastlePodcastAllTimeMetricsSuccessAction,
  CastlePodcastAllTimeMetricsFailureAction,
  CastleEpisodeAllTimeMetricsLoadPayload, CastleEpisodeAllTimeMetricsLoadAction,
  CastleEpisodeAllTimeMetricsSuccessPayload, CastleEpisodeAllTimeMetricsSuccessAction,
  CastleEpisodeAllTimeMetricsFailureAction,
  CastleEpisodeMetricsPayload, CastleEpisodeMetricsAction,
  CastleEpisodeChartTogglePayload, CastleEpisodeChartToggleAction} from './castle.action.creator';
export { GoogleAnalyticsEventPayload, GoogleAnalyticsEventAction } from './google-analytics.action.creator';
export { CustomRouterNavigationPayload, CustomRouterNavigationAction,
  RouteEpisodesChartedPayload, RouteEpisodesChartedAction,
  RouteSeriesPayload, RouteSeriesAction,
  RouteAdvancedPayload, RouteAdvancedAction } from './router.action.creator';
