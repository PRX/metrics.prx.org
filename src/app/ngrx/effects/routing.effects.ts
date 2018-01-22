import { Injectable } from '@angular/core';
import { RouterStateSnapshot, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationPayload, RouterNavigationAction } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { FilterModel, RouterModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../';
import { ActionTypes } from '../actions';
import { selectRouter } from '../reducers';
import { CastleFilterAction, CastlePodcastChartToggleAction, CastleEpisodeChartToggleAction } from '../actions';
import { RouteSeriesAction, RouteSeriesPayload } from '../actions';
import {RouteEpisodesChartedAction, RouteEpisodesChartedPayload} from "../actions/router.action.creator";

@Injectable()
export class RoutingEffects {
  routerState: RouterModel;

  @Effect()
  filterFromRoute$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((action: RouterNavigationAction) => action.payload)
    .switchMap((payload: RouterNavigationPayload<RouterStateSnapshot>) => {
      const filter: FilterModel = {...payload.routerState};

      // Please note that this is not correct, but it is temporary
      // because of our RouterStateSerializer, what we're getting here is our custom defined RouterModel
      // instead of the RouterNavigationPayload<RouterStateSnapShot> action payload that ROUTER_NAVIGATION expects
      // TypeScript complains about it,
      // but when FilterModel is replaced with our RouterModel CustomSerializer
      // and we can combine selectors with these charted route params
      // we won't be storing charted with the metrics entry and won't need this effect anymore, so meh
      if (payload.routerState['episodeIds']) {
        payload.routerState['episodeIds'].forEach(episodeId => {
          this.store.dispatch(new CastleEpisodeChartToggleAction({id: episodeId, seriesId: filter.podcastSeriesId, charted: true}));
        });
      }

      if (payload.routerState['chartPodcast']) {
        this.store.dispatch(new CastlePodcastChartToggleAction({
          seriesId: filter.podcastSeriesId, charted: payload.routerState['chartPodcast']}));
      }

      // eventually will get rid of FilterModel, but until then
      // we are still creating the FilterModel state from the route, but because of the serializer the types match up
      return Observable.of(new CastleFilterAction({filter}));
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
    if (newRouteParams.page) {
      params['page'] = newRouteParams.page;
    }
    if (newRouteParams.standardRange) {
      params['standardRange'] = newRouteParams.standardRange;
    }
    if (newRouteParams.beginDate) {
      params['beginDate'] = newRouteParams.beginDate;
    }
    if (newRouteParams.endDate) {
      params['endDate'] = newRouteParams.endDate;
    }
    if (newRouteParams.chartPodcast !== undefined) {
      params['chartPodcast'] = newRouteParams.chartPodcast;
    } else if (combinedRouterState.metricsType === METRICSTYPE_DOWNLOADS) {
      params['chartPodcast'] = true; // true is the default for downloads
    }
    if (newRouteParams.episodeIds) {
      params['episodes'] = newRouteParams.episodeIds.join(',');
    }

    this.router.navigate([
      combinedRouterState.podcastSeriesId,
      combinedRouterState.metricsType,
      combinedRouterState.chartType,
      combinedRouterState.interval.key,
      params]);
  }
}
