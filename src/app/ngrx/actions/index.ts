import { RouterNavigationAction } from '@ngrx/router-store';
import {
  CastlePodcastPageLoadAction,
  CastlePodcastPageSuccessAction,
  CastlePodcastPageFailureAction,
  CastleEpisodePageLoadAction,
  CastleEpisodePageSuccessAction,
  CastleEpisodePageFailureAction,
  CastleEpisodeSelectPageLoadAction,
  CastleEpisodeSelectPageSuccessAction,
  CastleEpisodeSelectPageFailureAction
} from './castle-catalog.action.creator';
import {
  CastlePodcastAllTimeDownloadsLoadAction,
  CastlePodcastAllTimeDownloadsSuccessAction,
  CastlePodcastAllTimeDownloadsFailureAction,
  CastleEpisodeAllTimeDownloadsLoadAction,
  CastleEpisodeAllTimeDownloadsSuccessAction,
  CastleEpisodeAllTimeDownloadsFailureAction,
  CastlePodcastDownloadsLoadAction,
  CastlePodcastDownloadsSuccessAction,
  CastlePodcastDownloadsFailureAction,
  CastleEpisodeDownloadsLoadAction,
  CastleEpisodeDownloadsSuccessAction,
  CastleEpisodeDownloadsFailureAction,
  CastleEpisodeDropdayLoadAction,
  CastleEpisodeDropdaySuccessAction,
  CastleEpisodeDropdayFailureAction
} from './castle-downloads.action.creator';
import {
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
} from './castle-ranks-totals.action.creator';
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
  ChartToggleGroupAction
} from './chart-toggle.action.creator';
import { EpisodeSelectEpisodesAction } from './episode-select.action.creator';
import { IdUserinfoLoadAction, IdUserinfoSuccessAction, IdUserinfoFailureAction } from './id.action.creator';

export type AllActions
  = CastlePodcastPageLoadAction
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
  | CastleEpisodeDownloadsLoadAction
  | CastleEpisodeDownloadsSuccessAction
  | CastleEpisodeDownloadsFailureAction
  | CastlePodcastAllTimeDownloadsLoadAction
  | CastlePodcastAllTimeDownloadsSuccessAction
  | CastlePodcastAllTimeDownloadsFailureAction
  | CastleEpisodeAllTimeDownloadsLoadAction
  | CastleEpisodeAllTimeDownloadsSuccessAction
  | CastleEpisodeAllTimeDownloadsFailureAction
  | CastleEpisodeDropdayLoadAction
  | CastleEpisodeDropdaySuccessAction
  | CastleEpisodeDropdayFailureAction
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
  | ChartToggleGroupAction
  | EpisodeSelectEpisodesAction
  | IdUserinfoLoadAction
  | IdUserinfoSuccessAction
  | IdUserinfoFailureAction;

export { ActionTypes } from './action.types';
export {
  CastlePodcastPageLoadPayload, CastlePodcastPageLoadAction,
  CastlePodcastPageSuccessPayload, CastlePodcastPageSuccessAction, CastlePodcastPageFailureAction,
  CastleEpisodePageLoadPayload, CastleEpisodePageLoadAction,
  CastleEpisodePageSuccessPayload, CastleEpisodePageSuccessAction, CastleEpisodePageFailureAction,
  CastleEpisodeSelectPageLoadAction, CastleEpisodeSelectPageSuccessAction, CastleEpisodeSelectPageFailureAction
} from './castle-catalog.action.creator';
export {
  CastlePodcastDownloadsLoadPayload, CastlePodcastDownloadsLoadAction,
  CastlePodcastDownloadsSuccessPayload, CastlePodcastDownloadsSuccessAction,
  CastlePodcastDownloadsFailurePayload, CastlePodcastDownloadsFailureAction,
  CastlePodcastAllTimeDownloadsLoadPayload, CastlePodcastAllTimeDownloadsLoadAction,
  CastlePodcastAllTimeDownloadsSuccessPayload, CastlePodcastAllTimeDownloadsSuccessAction,
  CastlePodcastAllTimeDownloadsFailurePayload, CastlePodcastAllTimeDownloadsFailureAction,
  CastleEpisodeAllTimeDownloadsLoadPayload, CastleEpisodeAllTimeDownloadsLoadAction,
  CastleEpisodeAllTimeDownloadsSuccessPayload, CastleEpisodeAllTimeDownloadsSuccessAction,
  CastleEpisodeAllTimeDownloadsFailurePayload, CastleEpisodeAllTimeDownloadsFailureAction,
  CastleEpisodeDownloadsLoadPayload, CastleEpisodeDownloadsLoadAction,
  CastleEpisodeDownloadsSuccessPayload, CastleEpisodeDownloadsSuccessAction,
  CastleEpisodeDownloadsFailurePayload, CastleEpisodeDownloadsFailureAction,
  CastleEpisodeDropdayLoadPayload, CastleEpisodeDropdayLoadAction,
  CastleEpisodeDropdaySuccessPayload, CastleEpisodeDropdaySuccessAction,
  CastleEpisodeDropdayFailurePayload, CastleEpisodeDropdayFailureAction
} from './castle-downloads.action.creator';
export {
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
  CastleEpisodeTotalsFailurePayload, CastleEpisodeTotalsFailureAction
} from './castle-ranks-totals.action.creator';
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
  ChartToggleGroupPayload, ChartToggleGroupAction } from './chart-toggle.action.creator';
export { EpisodeSelectEpisodesPayload, EpisodeSelectEpisodesAction } from './episode-select.action.creator';
export { IdUserinfoLoadAction, IdUserinfoSuccessPayload, IdUserinfoSuccessAction, IdUserinfoFailureAction } from './id.action.creator';
