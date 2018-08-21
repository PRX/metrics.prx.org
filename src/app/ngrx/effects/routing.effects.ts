import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction, RouterNavigationPayload } from '@ngrx/router-store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterParams } from '../';
import { ActionTypes } from '../actions';
import * as ACTIONS from '../actions';
import * as dateUtil from '../../shared/util/date';
import { RoutingService } from '../../core/routing/routing.service';

@Injectable()
export class RoutingEffects {

  // ROUTER_NAVIGATION/RouterNavigationAction originates from the ngrx StoreRouterConnectingModule.
  // It is serialized from a RouterStateSnapshot by the custom RouterStateSerializer to a custom RouterParams
  // after serialize, a RouterNavigationAction still has router event extras attached
  // so here in the effect it is mapped to a CustomRouterNavigationAction to strip it down.
  // The router reducer captures the CustomRouterNavigationAction to save routing state.
  // The CustomRouterNavigationAction is mocked by tests but is _not_ otherwise ever manually called by the application,
  // only through routing and the router-store connecting module.
  @Effect()
  customRouterNavigation$: Observable<Action> = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    map((action: RouterNavigationAction) => action.payload),
    switchMap((payload: RouterNavigationPayload<any>) => {
      const routerParams: RouterParams = {...payload.routerState};
      // map to an action with our CUSTOM_ROUTER_NAVIGATION type
      return Observable.of(new ACTIONS.CustomRouterNavigationAction({routerParams}));
    })
  );

  @Effect({dispatch: false})
  routePodcast$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_PODCAST),
    map((action: ACTIONS.RoutePodcastAction) => action.payload),
    switchMap((payload: ACTIONS.RoutePodcastPayload) => {
      const { podcastId } = payload;
      this.routingService.normalizeAndRoute({podcastId, episodePage: 1});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeEpisodePage$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_EPISODE_PAGE),
    map((action: ACTIONS.RouteEpisodePageAction) => action.payload),
    switchMap((payload: ACTIONS.RouteEpisodePagePayload) => {
      const { episodePage } = payload;
      this.routingService.normalizeAndRoute({episodePage});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeChartType$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_CHART_TYPE),
    map((action: ACTIONS.RouteChartTypeAction) => action.payload),
    switchMap((payload: ACTIONS.RouteChartTypePayload) => {
      const { chartType } = payload;
      this.routingService.normalizeAndRoute({chartType});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeInterval$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_INTERVAL),
    map((action: ACTIONS.RouteIntervalAction) => action.payload),
    switchMap((payload: ACTIONS.RouteIntervalPayload) => {
      const { interval } = payload;
      this.routingService.normalizeAndRoute({interval});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeStandardRange$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_STANDARD_RANGE),
    map((action: ACTIONS.RouteStandardRangeAction) => action.payload),
    switchMap((payload: ACTIONS.RouteStandardRangePayload) => {
      const { standardRange } = payload;
      const range = dateUtil.getBeginEndDateFromStandardRange(standardRange);
      this.routingService.normalizeAndRoute({standardRange, ...range});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeAdvancedRange$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_ADVANCED_RANGE),
    map((action: ACTIONS.RouteAdvancedRangeAction) => action.payload),
    switchMap((payload: ACTIONS.RouteAdvancedRangePayload) => {
      const { interval, beginDate, endDate, standardRange } = payload;
      this.routingService.normalizeAndRoute({beginDate, endDate, interval, standardRange});
      return Observable.of(null);
    })
  );

 @Effect({dispatch: false})
 routeMetricsGroupType$: Observable<void> = this.actions$.pipe(
   ofType(ActionTypes.ROUTE_METRICS_GROUP_TYPE),
   map((action: ACTIONS.RouteMetricsGroupTypeAction) => action.payload),
   switchMap((payload: ACTIONS.RouteMetricsGroupTypePayload) => {
     const { metricsType, group } = payload;
     this.routingService.normalizeAndRoute(({metricsType, group}));
     return Observable.of(null);
   })
 );

  constructor(private actions$: Actions,
              public routingService: RoutingService) {}
}
