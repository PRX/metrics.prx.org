import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsAccountAction, CmsAccountSuccessAction, CmsAccountFailureAction } from './cms.action.creator';
import {
  CastlePodcastPageLoadAction,
  CastlePodcastPageSuccessAction,
  CastlePodcastPageFailureAction,
  CastleEpisodePageLoadAction,
  CastleEpisodePageSuccessAction,
  CastleEpisodePageFailureAction,
  CastleEpisodeSelectPageLoadAction,
  CastleEpisodeSelectPageSuccessAction,
  CastleEpisodeSelectPageFailureAction,
  CastlePodcastAllTimeDownloadsLoadAction,
  CastlePodcastAllTimeDownloadsSuccessAction,
  CastlePodcastAllTimeDownloadsFailureAction,
  CastleEpisodeAllTimeDownloadsLoadAction,
  CastleEpisodeAllTimeDownloadsSuccessAction,
  CastleEpisodeAllTimeDownloadsFailureAction,
  CastlePodcastDownloadsLoadAction,
  CastlePodcastDownloadsSuccessAction,
  CastlePodcastDownloadsFailureAction,
  CastleEpisodeMetricsLoadAction,
  CastleEpisodeMetricsSuccessAction,
  CastleEpisodeMetricsFailureAction,
  CastlePodcastRanksLoadAction,
  CastlePodcastRanksSuccessAction,
  CastlePodcastRanksFailureAction,
  CastlePodcastTotalsLoadAction,
  CastlePodcastTotalsSuccessAction,
  CastlePodcastTotalsFailureAction,
  CastleEpisodeRanksLoadAction,
  CastleEpisodeRanksSuccessAction,
  CastleEpisodeRanksFailureAction,
  CastleEpisodeTotalsLoadAction,
  CastleEpisodeTotalsSuccessAction,
  CastleEpisodeTotalsFailureAction
} from './castle.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';
import { CustomRouterNavigationAction,
  RoutePodcastAction, RouteEpisodePageAction,
  RouteChartTypeAction, RouteIntervalAction,
  RouteStandardRangeAction, RouteAdvancedRangeAction,
  RouteMetricsGroupTypeAction, RouteGroupFilterAction } from './router.action.creator';
import {
  ChartSingleEpisodeAction,
  ChartToggleEpisodeAction,
  ChartTogglePodcastAction,
  ChartTogglePodcastGroupAction
} from './chart-toggle.action.creator';
import { EpisodeSelectEpisodesAction } from './episode-select.action.creator';

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
  | CastleEpisodeSelectPageLoadAction
  | CastleEpisodeSelectPageSuccessAction
  | CastleEpisodeSelectPageFailureAction
  | CastlePodcastDownloadsLoadAction
  | CastlePodcastDownloadsSuccessAction
  | CastlePodcastDownloadsFailureAction
  | CastleEpisodeMetricsLoadAction
  | CastleEpisodeMetricsSuccessAction
  | CastleEpisodeMetricsFailureAction
  | CastlePodcastAllTimeDownloadsLoadAction
  | CastlePodcastAllTimeDownloadsSuccessAction
  | CastlePodcastAllTimeDownloadsFailureAction
  | CastleEpisodeAllTimeDownloadsLoadAction
  | CastleEpisodeAllTimeDownloadsSuccessAction
  | CastleEpisodeAllTimeDownloadsFailureAction
  | CastlePodcastRanksLoadAction
  | CastlePodcastRanksSuccessAction
  | CastlePodcastRanksFailureAction
  | CastlePodcastTotalsLoadAction
  | CastlePodcastTotalsSuccessAction
  | CastlePodcastTotalsFailureAction
  | CastleEpisodeRanksLoadAction
  | CastleEpisodeRanksSuccessAction
  | CastleEpisodeRanksFailureAction
  | CastleEpisodeTotalsLoadAction
  | CastleEpisodeTotalsSuccessAction
  | CastleEpisodeTotalsFailureAction
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
  | RouteGroupFilterAction
  | ChartSingleEpisodeAction
  | ChartToggleEpisodeAction
  | ChartTogglePodcastAction
  | ChartTogglePodcastGroupAction
  | EpisodeSelectEpisodesAction;

export { ActionTypes } from './action.types';
export { CmsAccountSuccessPayload, CmsAccountSuccessAction,
  CmsAccountAction, CmsAccountFailureAction } from './cms.action.creator';
export {
  CastlePodcastPageLoadPayload, CastlePodcastPageLoadAction,
  CastlePodcastPageSuccessPayload, CastlePodcastPageSuccessAction, CastlePodcastPageFailureAction,
  CastleEpisodePageLoadPayload, CastleEpisodePageLoadAction,
  CastleEpisodePageSuccessPayload, CastleEpisodePageSuccessAction, CastleEpisodePageFailureAction,
  CastleEpisodeSelectPageLoadAction, CastleEpisodeSelectPageSuccessAction, CastleEpisodeSelectPageFailureAction,
  CastlePodcastDownloadsLoadPayload, CastlePodcastDownloadsLoadAction,
  CastlePodcastDownloadsSuccessPayload, CastlePodcastDownloadsSuccessAction,
  CastlePodcastDownloadsFailurePayload, CastlePodcastDownloadsFailureAction,
  CastlePodcastAllTimeDownloadsLoadPayload, CastlePodcastAllTimeDownloadsLoadAction,
  CastlePodcastAllTimeDownloadsSuccessPayload, CastlePodcastAllTimeDownloadsSuccessAction,
  CastlePodcastAllTimeDownloadsFailurePayload, CastlePodcastAllTimeDownloadsFailureAction,
  CastleEpisodeAllTimeDownloadsLoadPayload, CastleEpisodeAllTimeDownloadsLoadAction,
  CastleEpisodeAllTimeDownloadsSuccessPayload, CastleEpisodeAllTimeDownloadsSuccessAction,
  CastleEpisodeAllTimeDownloadsFailurePayload, CastleEpisodeAllTimeDownloadsFailureAction,
  CastleEpisodeMetricsLoadPayload, CastleEpisodeMetricsLoadAction,
  CastleEpisodeMetricsSuccessPayload, CastleEpisodeMetricsSuccessAction,
  CastleEpisodeMetricsFailurePayload, CastleEpisodeMetricsFailureAction,
  CastlePodcastRanksLoadPayload, CastlePodcastRanksLoadAction,
  CastlePodcastRanksSuccessPayload, CastlePodcastRanksSuccessAction,
  CastlePodcastRanksFailurePayload, CastlePodcastRanksFailureAction,
  CastlePodcastTotalsLoadPayload, CastlePodcastTotalsLoadAction,
  CastlePodcastTotalsSuccessPayload, CastlePodcastTotalsSuccessAction,
  CastlePodcastTotalsFailurePayload, CastlePodcastTotalsFailureAction,
  CastleEpisodeRanksLoadPayload, CastleEpisodeRanksLoadAction,
  CastleEpisodeRanksSuccessPayload, CastleEpisodeRanksSuccessAction,
  CastleEpisodeRanksFailurePayload, CastleEpisodeRanksFailureAction,
  CastleEpisodeTotalsLoadPayload, CastleEpisodeTotalsLoadAction,
  CastleEpisodeTotalsSuccessPayload, CastleEpisodeTotalsSuccessAction,
  CastleEpisodeTotalsFailurePayload, CastleEpisodeTotalsFailureAction } from './castle.action.creator';
export { GoogleAnalyticsEventPayload, GoogleAnalyticsEventAction } from './google-analytics.action.creator';
export { CustomRouterNavigationPayload, CustomRouterNavigationAction,
  RoutePodcastPayload, RoutePodcastAction,
  RouteEpisodePagePayload, RouteEpisodePageAction,
  RouteChartTypePayload, RouteChartTypeAction,
  RouteIntervalPayload, RouteIntervalAction,
  RouteAdvancedRangePayload, RouteAdvancedRangeAction,
  RouteStandardRangePayload, RouteStandardRangeAction,
  RouteMetricsGroupTypePayload, RouteMetricsGroupTypeAction,
  RouteGroupFilterPayload, RouteGroupFilterAction } from './router.action.creator';
export { ChartSingleEpisodePayload, ChartSingleEpisodeAction,
  ChartToggleEpisodePayload, ChartToggleEpisodeAction,
  ChartTogglePodcastPayload, ChartTogglePodcastAction,
  ChartTogglePodcastGroupPayload, ChartTogglePodcastGroupAction } from './chart-toggle.action.creator';
export { EpisodeSelectEpisodesPayload, EpisodeSelectEpisodesAction } from './episode-select.action.creator';
