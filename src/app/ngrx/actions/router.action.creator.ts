import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { RouterParams, ChartType, IntervalModel, MetricsType, GroupType } from '../';

// CustomRouterNavigation happens as a result of
// the StoreRouterConnectingModule and the RouterStateSerializer and the customRouterNavigation$ routing effect
// It is otherwise not to be used directly by the application
export interface CustomRouterNavigationPayload {
  routerParams: RouterParams;
}

export class CustomRouterNavigationAction implements Action {
  readonly type = ActionTypes.CUSTOM_ROUTER_NAVIGATION;

  constructor(public payload: CustomRouterNavigationPayload) {}
}

export interface RoutePodcastPayload {
  podcastId: string;
}

export class RoutePodcastAction implements Action {
  readonly type = ActionTypes.ROUTE_PODCAST;

  constructor(public payload: RoutePodcastPayload) {}
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

  constructor(public payload: RouteAdvancedRangePayload) {}
}

export interface RouteEpisodePagePayload {
  episodePage: number;
}

export class RouteEpisodePageAction implements Action {
  readonly type = ActionTypes.ROUTE_EPISODE_PAGE;

  constructor(public payload: RouteEpisodePagePayload) {}
}

export interface RouteMetricsGroupTypePayload {
  metricsType: MetricsType;
  group?: GroupType;
}

export class RouteMetricsGroupTypeAction implements Action {
  readonly type = ActionTypes.ROUTE_METRICS_GROUP_TYPE;

  constructor(public payload: RouteMetricsGroupTypePayload) {}
}

export interface RouteGroupFilterPayload {
  filter: string;
}

export class RouteGroupFilterAction implements Action {
  readonly type = ActionTypes.ROUTE_GROUP_FILTER;

  constructor(public payload: RouteGroupFilterPayload) {}
}

export interface RouteDaysPayload {
  days: number;
}

export class RouteDaysAction implements Action {
  readonly type = ActionTypes.ROUTE_DAYS;

  constructor(public payload: RouteDaysPayload) {}
}
