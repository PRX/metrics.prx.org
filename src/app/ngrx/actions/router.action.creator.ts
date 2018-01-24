import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { RouterModel, ChartType, IntervalModel, MetricsType } from '../';

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

export interface RouteAdvancedPayload {
  metricsType?: MetricsType;
  podcastSeriesId?: number;
  page?: number;
  standardRange?: string;
  beginDate?: Date;
  endDate?: Date;
  interval?: IntervalModel;
  chartType?: ChartType;
  chartPodcast?: boolean;
  episodeIds?: number[];
}

export class RouteAdvancedAction implements Action {
  readonly type = ActionTypes.ROUTE_ADVANCED;

  constructor(public payload: any) {}
}
