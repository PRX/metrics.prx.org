import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsAccountAction, CmsAccountSuccessAction, CmsAccountFailureAction } from './cms.action.creator';
import {
  CastlePodcastPageLoadAction,
  CastlePodcastPageSuccessAction,
  CastlePodcastPageFailureAction,
  CastleEpisodePageLoadAction,
  CastleEpisodePageSuccessAction,
  CastleEpisodePageFailureAction,
  CastlePodcastPerformanceMetricsLoadAction,
  CastlePodcastPerformanceMetricsSuccessAction,
  CastlePodcastPerformanceMetricsFailureAction,
  CastleEpisodePerformanceMetricsLoadAction,
  CastleEpisodePerformanceMetricsSuccessAction,
  CastleEpisodePerformanceMetricsFailureAction,
  CastlePodcastMetricsLoadAction,
  CastlePodcastMetricsSuccessAction,
  CastlePodcastMetricsFailureAction,
  CastleEpisodeMetricsLoadAction,
  CastleEpisodeMetricsSuccessAction,
  CastleEpisodeMetricsFailureAction,
  CastlePodcastRanksLoadAction,
  CastlePodcastRanksSuccessAction,
  CastlePodcastRanksFailureAction,
  CastlePodcastRanksSuccessPayload,
  CastlePodcastRanksFailurePayload,
  CastlePodcastTotalsLoadAction,
  CastlePodcastTotalsSuccessAction,
  CastlePodcastTotalsFailureAction,
  CastlePodcastTotalsSuccessPayload,
  CastlePodcastTotalsFailurePayload
} from './castle.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';
import { CustomRouterNavigationAction,
  RoutePodcastAction, RouteEpisodePageAction,
  RouteChartTypeAction, RouteIntervalAction,
  RouteStandardRangeAction, RouteAdvancedRangeAction,
  RouteMetricsGroupTypeAction } from './router.action.creator';
import {
  ChartSingleEpisodeAction,
  ChartToggleEpisodeAction,
  ChartTogglePodcastAction,
  ChartTogglePodcastGroupAction
} from './chart-toggle.action.creator';

export type AllActions
  = CmsAccountAction
  | CmsAccountSuccessAction
  | CmsAccountFailureAction
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
  | CastlePodcastRanksLoadAction
  | CastlePodcastRanksSuccessAction
  | CastlePodcastRanksFailureAction
  | CastlePodcastTotalsLoadAction
  | CastlePodcastTotalsSuccessAction
  | CastlePodcastTotalsFailureAction
  | RouterNavigationAction
  | GoogleAnalyticsEventAction
  | CustomRouterNavigationAction
  | RoutePodcastAction
  | RouteEpisodePageAction
  | RouteChartTypeAction
  | RouteIntervalAction
  | RouteStandardRangeAction
  | RouteAdvancedRangeAction
  | RouteMetricsGroupTypeAction
  | ChartSingleEpisodeAction
  | ChartToggleEpisodeAction
  | ChartTogglePodcastAction
  | ChartTogglePodcastGroupAction;

export { ActionTypes } from './action.types';
export { CmsAccountSuccessPayload, CmsAccountSuccessAction,
  CmsAccountAction, CmsAccountFailureAction } from './cms.action.creator';
export {
  CastlePodcastPageLoadPayload, CastlePodcastPageLoadAction,
  CastlePodcastPageSuccessPayload, CastlePodcastPageSuccessAction, CastlePodcastPageFailureAction,
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
  CastleEpisodeMetricsFailurePayload, CastleEpisodeMetricsFailureAction,
  CastlePodcastRanksLoadPayload, CastlePodcastRanksLoadAction,
  CastlePodcastRanksSuccessPayload, CastlePodcastRanksSuccessAction,
  CastlePodcastRanksFailurePayload, CastlePodcastRanksFailureAction,
  CastlePodcastTotalsLoadPayload, CastlePodcastTotalsLoadAction,
  CastlePodcastTotalsSuccessPayload, CastlePodcastTotalsSuccessAction,
  CastlePodcastTotalsFailurePayload, CastlePodcastTotalsFailureAction } from './castle.action.creator';
export { GoogleAnalyticsEventPayload, GoogleAnalyticsEventAction } from './google-analytics.action.creator';
export { CustomRouterNavigationPayload, CustomRouterNavigationAction,
  RoutePodcastPayload, RoutePodcastAction,
  RouteEpisodePagePayload, RouteEpisodePageAction,
  RouteChartTypePayload, RouteChartTypeAction,
  RouteIntervalPayload, RouteIntervalAction,
  RouteAdvancedRangePayload, RouteAdvancedRangeAction,
  RouteStandardRangePayload, RouteStandardRangeAction,
  RouteMetricsGroupTypePayload, RouteMetricsGroupTypeAction } from './router.action.creator';
export { ChartSingleEpisodePayload, ChartSingleEpisodeAction,
  ChartToggleEpisodePayload, ChartToggleEpisodeAction,
  ChartTogglePodcastPayload, ChartTogglePodcastAction,
  ChartTogglePodcastGroupPayload, ChartTogglePodcastGroupAction } from './chart-toggle.action.creator';
