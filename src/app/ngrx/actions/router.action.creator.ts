import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { RouterParams, ChartType, IntervalModel, MetricsType, GroupType } from '../';

// CustomRouterNavigation happens as a result of
// the StoreRouterConnectingModule and the RouterStateSerializer and the customRouterNavigation$ routing effect
// It is otherwise not to be dispatched directly by the application
export const CustomRouterNavigation = createAction(
  ActionTypes.CUSTOM_ROUTER_NAVIGATION,
  props<{ url?: string; routerParams: RouterParams }>()
);

export const RoutePodcast = createAction(ActionTypes.ROUTE_PODCAST, props<{ podcastId: string }>());

export const RouteChartType = createAction(ActionTypes.ROUTE_CHART_TYPE, props<{ chartType: ChartType }>());

export const RouteInterval = createAction(ActionTypes.ROUTE_INTERVAL, props<{ interval: IntervalModel }>());

export const RouteStandardRange = createAction(ActionTypes.ROUTE_STANDARD_RANGE, props<{ standardRange: string }>());

export const RouteAdvancedRange = createAction(
  ActionTypes.ROUTE_ADVANCED_RANGE,
  props<{ standardRange: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

export const RouteEpisodePage = createAction(ActionTypes.ROUTE_EPISODE_PAGE, props<{ episodePage: number }>());

export const RouteMetricsGroupType = createAction(
  ActionTypes.ROUTE_METRICS_GROUP_TYPE,
  props<{ metricsType: MetricsType; group?: GroupType }>()
);

export const RouteGroupFilter = createAction(ActionTypes.ROUTE_GROUP_FILTER, props<{ filter: string }>());

export const RouteDays = createAction(ActionTypes.ROUTE_DAYS, props<{ days: number }>());
