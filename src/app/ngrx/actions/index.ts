import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsAccountAction, CmsAccountSuccessAction, CmsAccountFailureAction, CmsPodcastsSuccessAction,
  CmsPodcastEpisodePageAction, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
import { CastlePodcastAllTimeMetricsLoadAction, CastlePodcastAllTimeMetricsSuccessAction, CastlePodcastAllTimeMetricsFailureAction,
  CastleEpisodeAllTimeMetricsLoadAction, CastleEpisodeAllTimeMetricsSuccessAction, CastleEpisodeAllTimeMetricsFailureAction,
  CastlePodcastChartToggleAction, CastleEpisodeChartToggleAction,
  CastlePodcastMetricsLoadAction, CastlePodcastMetricsSuccessAction, CastlePodcastMetricsFailureAction,
  CastleEpisodeMetricsLoadAction, CastleEpisodeMetricsSuccessAction, CastleEpisodeMetricsFailureAction } from './castle.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';
import { CustomRouterNavigationAction,
  RouteSeriesAction, RoutePodcastChartedAction,
  RouteEpisodePageAction, RouteEpisodesChartedAction,
  RouteSingleEpisodeChartedAction, RouteToggleEpisodeChartedAction,
  RouteChartTypeAction, RouteIntervalAction,
  RouteStandardRangeAction, RouteAdvancedRangeAction } from './router.action.creator';

export type AllActions
  = CmsAccountAction
  | CmsAccountSuccessAction
  | CmsAccountFailureAction
  | CmsPodcastsSuccessAction
  | CmsPodcastEpisodePageAction
  | CmsPodcastEpisodePageSuccessAction
  | CmsPodcastEpisodePageFailureAction
  | CastlePodcastMetricsLoadAction
  | CastlePodcastMetricsSuccessAction
  | CastlePodcastMetricsFailureAction
  | CastlePodcastChartToggleAction
  | CastleEpisodeMetricsLoadAction
  | CastleEpisodeMetricsSuccessAction
  | CastleEpisodeMetricsFailureAction
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
  | RouteSeriesAction
  | RoutePodcastChartedAction
  | RouteEpisodePageAction
  | RouteEpisodesChartedAction
  | RouteSingleEpisodeChartedAction
  | RouteToggleEpisodeChartedAction
  | RouteChartTypeAction
  | RouteIntervalAction
  | RouteStandardRangeAction
  | RouteAdvancedRangeAction;

export { ActionTypes } from './action.types';
export { CmsAccountSuccessPayload, CmsAccountSuccessAction,
  CmsAccountAction, CmsAccountFailureAction,
  CmsPodcastsSuccessPayload, CmsPodcastsSuccessAction,
  CmsPodcastsAction, CmsPodcastsFailureAction,
  CmsEpisodePagePayload, CmsPodcastEpisodePageAction,
  CmsEpisodePageSuccessPayload, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
export { CastlePodcastMetricsLoadPayload, CastlePodcastMetricsLoadAction,
  CastlePodcastMetricsSuccessPayload, CastlePodcastMetricsSuccessAction,
  CastlePodcastMetricsFailurePayload, CastlePodcastMetricsFailureAction,
  CastlePodcastChartTogglePayload, CastlePodcastChartToggleAction,
  CastlePodcastAllTimeMetricsLoadAction,
  CastlePodcastAllTimeMetricsSuccessPayload, CastlePodcastAllTimeMetricsSuccessAction,
  CastlePodcastAllTimeMetricsFailureAction,
  CastleEpisodeAllTimeMetricsLoadPayload, CastleEpisodeAllTimeMetricsLoadAction,
  CastleEpisodeAllTimeMetricsSuccessPayload, CastleEpisodeAllTimeMetricsSuccessAction,
  CastleEpisodeAllTimeMetricsFailureAction,
  CastleEpisodeMetricsLoadPayload, CastleEpisodeMetricsLoadAction,
  CastleEpisodeMetricsSuccessPayload, CastleEpisodeMetricsSuccessAction,
  CastleEpisodeMetricsFailurePayload, CastleEpisodeMetricsFailureAction,
  CastleEpisodeChartTogglePayload, CastleEpisodeChartToggleAction } from './castle.action.creator';
export { GoogleAnalyticsEventPayload, GoogleAnalyticsEventAction } from './google-analytics.action.creator';
export { CustomRouterNavigationPayload, CustomRouterNavigationAction,
  RouteSeriesPayload, RouteSeriesAction,
  RoutePodcastChartedPayload, RoutePodcastChartedAction,
  RouteEpisodePagePayload, RouteEpisodePageAction,
  RouteEpisodesChartedPayload, RouteEpisodesChartedAction,
  RouteSingleEpisodeChartedPayload, RouteSingleEpisodeChartedAction,
  RouteToggleEpisodeChartedPayload, RouteToggleEpisodeChartedAction,
  RouteChartTypePayload, RouteChartTypeAction,
  RouteIntervalPayload, RouteIntervalAction,
  RouteAdvancedRangePayload, RouteAdvancedRangeAction,
  RouteStandardRangePayload, RouteStandardRangeAction } from './router.action.creator';
