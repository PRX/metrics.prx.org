import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { RouterModel, ChartType, IntervalModel } from '../';

// CustomRouterNavigation happens as a result of
// the StoreRouterConnectingModule and the RouterStateSerializer and the customRouterNavigation$ routing effect
// It is otherwise not to be used directly by the application
export interface CustomRouterNavigationPayload {
  routerState: RouterModel;
}

export class CustomRouterNavigationAction implements Action {
  readonly type = ActionTypes.CUSTOM_ROUTER_NAVIGATION;

  constructor(public payload: CustomRouterNavigationPayload) {}
}

export interface RouteSeriesPayload {
  podcastSeriesId: number;
}

export class RouteSeriesAction implements Action {
  readonly type = ActionTypes.ROUTE_SERIES;

  constructor(public payload: RouteSeriesPayload) {}
}

export interface RouteEpisodesChartedPayload {
  episodeIds: number[];
}

export class RouteEpisodesChartedAction implements Action {
  readonly type = ActionTypes.ROUTE_EPISODES_CHARTED;

  constructor(public payload: RouteEpisodesChartedPayload) {}
}

export interface RouteSingleEpisodeChartedPayload {
  episodeId: number;
  chartType?: ChartType;
  page?: number;
}

export class RouteSingleEpisodeChartedAction implements Action {
  readonly type = ActionTypes.ROUTE_SINGLE_EPISODE_CHARTED;

  constructor(public payload: RouteSingleEpisodeChartedPayload) {}
}

export interface RouteToggleEpisodeChartedPayload {
  episodeId: number;
  charted: boolean;
}

export class RouteToggleEpisodeChartedAction {
  readonly type = ActionTypes.ROUTE_TOGGLE_EPISODE_CHARTED;

  constructor(public payload: RouteToggleEpisodeChartedPayload) {}
}

export interface RouteChartTypePayload {
  chartType: ChartType;
}

export class RouteChartTypeAction implements Action {
  readonly type = ActionTypes.ROUTE_CHART_TYPE;

  constructor(public payload: RouteChartTypePayload) {}
}

export interface RouteIntervalPayload {
  interval: IntervalModel;
}

export class RouteIntervalAction implements Action {
  readonly type = ActionTypes.ROUTE_INTERVAL;

  constructor(public payload: RouteIntervalPayload) {}
}

export interface RouteStandardRangePayload {
  standardRange: string;
}

export class RouteStandardRangeAction implements Action {
  readonly type = ActionTypes.ROUTE_STANDARD_RANGE;

  constructor(public payload: RouteStandardRangePayload) {}
}

export interface RouteAdvancedRangePayload {
  standardRange: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
}

export class RouteAdvancedRangeAction implements Action {
  readonly type = ActionTypes.ROUTE_ADVANCED_RANGE;

  constructor(public payload: any) {}
}

export interface RouteEpisodePagePayload {
  page: number;
}

export class RouteEpisodePageAction implements Action {
  readonly type = ActionTypes.ROUTE_EPISODE_PAGE;

  constructor(public payload: RouteEpisodePagePayload) {}
}

export interface RoutePodcastChartedPayload {
  chartPodcast: boolean;
}

export class RoutePodcastChartedAction implements Action {
  readonly type = ActionTypes.ROUTE_PODCAST_CHARTED;

  constructor(public payload: RoutePodcastChartedPayload) {}
}
