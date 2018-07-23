import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsAccountAction, CmsAccountSuccessAction, CmsAccountFailureAction, CmsPodcastsSuccessAction,
  CmsRecentEpisodePayload, CmsRecentEpisodeAction, CmsRecentEpisodeSuccessAction, CmsRecentEpisodeFailureAction,
  CmsPodcastEpisodePageAction, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
import { CastlePodcastPageLoadAction, CastlePodcastPageSuccessAction, CastlePodcastPageFailureAction,
  CastleEpisodePageLoadAction, CastleEpisodePageSuccessAction, CastleEpisodePageFailureAction,
  CastlePodcastPerformanceMetricsLoadAction,
  CastlePodcastPerformanceMetricsSuccessAction, CastlePodcastPerformanceMetricsFailureAction,
  CastleEpisodePerformanceMetricsLoadAction, CastleEpisodePerformanceMetricsSuccessAction, CastleEpisodePerformanceMetricsFailureAction,
  CastlePodcastMetricsLoadAction, CastlePodcastMetricsSuccessAction, CastlePodcastMetricsFailureAction,
  CastleEpisodeMetricsLoadAction, CastleEpisodeMetricsSuccessAction, CastleEpisodeMetricsFailureAction } from './castle.action.creator';
import { IdAccountLoadAction, IdAccountSuccessAction, IdAccountFailureAction } from './id.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';
import { CustomRouterNavigationAction,
  RouteSeriesAction, RoutePodcastChartedAction,
  RouteEpisodePageAction, RouteEpisodesChartedAction,
  RouteSingleEpisodeChartedAction, RouteToggleEpisodeChartedAction,
  RouteChartTypeAction, RouteIntervalAction,
  RouteStandardRangeAction, RouteAdvancedRangeAction,
  RouteMetricsTypeAction } from './router.action.creator';

export type AllActions
  = CmsAccountAction
  | CmsAccountSuccessAction
  | CmsAccountFailureAction
  | CmsPodcastsSuccessAction
  | CmsRecentEpisodeSuccessAction
  | CmsRecentEpisodeFailureAction
  | CmsPodcastEpisodePageAction
  | CmsPodcastEpisodePageSuccessAction
  | CmsPodcastEpisodePageFailureAction
  | CastlePodcastPageLoadAction
  | CastlePodcastPageSuccessAction
  | CastlePodcastPageFailureAction
  | CastleEpisodePageLoadAction
  | CastleEpisodePageSuccessAction
  | CastleEpisodePageFailureAction
  | CastlePodcastMetricsLoadAction
  | CastlePodcastMetricsSuccessAction
  | CastlePodcastMetricsFailureAction
  | CastleEpisodeMetricsLoadAction
  | CastleEpisodeMetricsSuccessAction
  | CastleEpisodeMetricsFailureAction
  | CastlePodcastPerformanceMetricsLoadAction
  | CastlePodcastPerformanceMetricsSuccessAction
  | CastlePodcastPerformanceMetricsFailureAction
  | CastleEpisodePerformanceMetricsLoadAction
  | CastleEpisodePerformanceMetricsSuccessAction
  | CastleEpisodePerformanceMetricsFailureAction
  | IdAccountLoadAction
  | IdAccountSuccessAction
  | IdAccountFailureAction
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
  | RouteAdvancedRangeAction
  | RouteMetricsTypeAction;

export { ActionTypes } from './action.types';
export { CmsAccountSuccessPayload, CmsAccountSuccessAction,
  CmsAccountAction, CmsAccountFailureAction,
  CmsPodcastsSuccessPayload, CmsPodcastsSuccessAction,
  CmsPodcastsAction, CmsPodcastsFailureAction,
  CmsRecentEpisodePayload, CmsRecentEpisodeAction,
  CmsRecentEpisodeSuccessPayload, CmsRecentEpisodeSuccessAction, CmsRecentEpisodeFailureAction,
  CmsEpisodePagePayload, CmsPodcastEpisodePageAction,
  CmsEpisodePageSuccessPayload, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
export { CastlePodcastPageLoadAction, CastlePodcastPageSuccessPayload, CastlePodcastPageSuccessAction, CastlePodcastPageFailureAction,
  CastleEpisodePageLoadPayload, CastleEpisodePageLoadAction,
  CastleEpisodePageSuccessPayload, CastleEpisodePageSuccessAction, CastleEpisodePageFailureAction,
  CastlePodcastMetricsLoadPayload, CastlePodcastMetricsLoadAction,
  CastlePodcastMetricsSuccessPayload, CastlePodcastMetricsSuccessAction,
  CastlePodcastMetricsFailurePayload, CastlePodcastMetricsFailureAction,
  CastlePodcastPerformanceMetricsLoadPayload, CastlePodcastPerformanceMetricsLoadAction,
  CastlePodcastPerformanceMetricsSuccessPayload, CastlePodcastPerformanceMetricsSuccessAction,
  CastlePodcastPerformanceMetricsFailureAction,
  CastleEpisodePerformanceMetricsLoadPayload, CastleEpisodePerformanceMetricsLoadAction,
  CastleEpisodePerformanceMetricsSuccessPayload, CastleEpisodePerformanceMetricsSuccessAction,
  CastleEpisodePerformanceMetricsFailureAction,
  CastleEpisodeMetricsLoadPayload, CastleEpisodeMetricsLoadAction,
  CastleEpisodeMetricsSuccessPayload, CastleEpisodeMetricsSuccessAction,
  CastleEpisodeMetricsFailurePayload, CastleEpisodeMetricsFailureAction } from './castle.action.creator';
export { IdAccountLoadAction, IdAccountSuccessPayload, IdAccountSuccessAction, IdAccountFailureAction } from './id.action.creator';
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
  RouteStandardRangePayload, RouteStandardRangeAction,
  RouteMetricsTypePayload, RouteMetricsTypeAction } from './router.action.creator';
