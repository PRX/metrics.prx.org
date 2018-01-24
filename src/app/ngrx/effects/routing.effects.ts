import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { RouterModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../';
import { ActionTypes } from '../actions';
import { selectRouter } from '../reducers';
import { CustomRouterNavigationAction, CustomRouterNavigationPayload,
  RouteSeriesAction, RouteSeriesPayload,
  RouteEpisodesChartedAction, RouteEpisodesChartedPayload } from '../actions';

@Injectable()
export class RoutingEffects {
  routerState: RouterModel;

  @Effect()
  customRouterNavigation$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((action: CustomRouterNavigationAction) => action.payload)
    .switchMap((payload: CustomRouterNavigationPayload) => {
      const routerState: RouterModel = {...payload.routerState};

      console.log('Routing effect', routerState);

      // map to an action with our CUSTOM_ROUTER_NAVIGATION type
      return Observable.of(new CustomRouterNavigationAction(payload));
    });

  @Effect({dispatch: false})
  routeSeries$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_SERIES)
    .map((action: RouteSeriesAction) => action.payload)
    .switchMap((payload: RouteSeriesPayload) => {
      const { podcastSeriesId } = payload;
      this.routeFromNewRouterState({podcastSeriesId});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeEpisodesCharted$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_EPISODES_CHARTED)
    .map((action: RouteEpisodesChartedAction) => action.payload)
    .switchMap((payload: RouteEpisodesChartedPayload) => {
      const { episodeIds } = payload;
      this.routeFromNewRouterState({episodeIds});
      return Observable.of(null);
    });

  constructor(public store: Store<any>,
              private router: Router,
              private actions$: Actions) {
    this.store.select(selectRouter).subscribe(routerState => this.routerState = routerState);
  }

  routeFromNewRouterState(newRouteParams: RouterModel) {
    const combinedRouterState: RouterModel = { ...this.routerState, ...newRouteParams};
    if (!combinedRouterState.metricsType) {
      combinedRouterState.metricsType = <MetricsType>METRICSTYPE_DOWNLOADS;
    }
    if (!combinedRouterState.chartType) {
      combinedRouterState.chartType = <ChartType>CHARTTYPE_PODCAST;
    }
    if (!combinedRouterState.interval) {
      combinedRouterState.interval = INTERVAL_DAILY;
    }

    const params = {};
    if (combinedRouterState.page) {
      params['page'] = combinedRouterState.page;
    }
    if (combinedRouterState.standardRange) {
      params['standardRange'] = combinedRouterState.standardRange;
    }
    if (combinedRouterState.beginDate) {
      params['beginDate'] = combinedRouterState.beginDate;
    }
    if (combinedRouterState.endDate) {
      params['endDate'] = combinedRouterState.endDate;
    }
    if (combinedRouterState.chartPodcast !== undefined) {
      params['chartPodcast'] = combinedRouterState.chartPodcast;
    } else if (combinedRouterState.metricsType === METRICSTYPE_DOWNLOADS) {
      params['chartPodcast'] = true; // true is the default for downloads
    }
    if (combinedRouterState.episodeIds) {
      params['episodes'] = combinedRouterState.episodeIds.join(',');
    }

    this.router.navigate([
      combinedRouterState.podcastSeriesId,
      combinedRouterState.metricsType,
      combinedRouterState.chartType,
      combinedRouterState.interval.key,
      params]);
  }
}
