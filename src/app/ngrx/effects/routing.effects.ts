import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { RouterModel, ChartType, MetricsType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../';
import { selectRouter } from '../reducers';
import { ActionTypes } from '../actions';
import * as ACTIONS from '../actions';
import * as dateUtil from '../../shared/util/date';

@Injectable()
export class RoutingEffects {
  routerState: RouterModel;

  // ROUTER_NAVIGATION/RouterNavigationAction originates from the ngrx StoreRouterConnectingModule.
  // It is serialized from a RouterStateSnapshot by the custom RouterStateSerializer to a custom RouterModel
  // after serialize, a RouterNavigationAction still has router event extras attached
  // so here in the effect it is mapped to a CustomRouterNavigationAction to strip it down.
  // The router reducer captures the CustomRouterNavigationAction to save routing state.
  // The CustomRouterNavigationAction is mocked by tests but is _not_ otherwise ever manually called by the application,
  // only through routing and the router-store connecting module.
  @Effect()
  customRouterNavigation$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((action: ACTIONS.CustomRouterNavigationAction) => action.payload)
    .switchMap((payload: ACTIONS.CustomRouterNavigationPayload) => {
      const routerState: RouterModel = {...payload.routerState};
      // map to an action with our CUSTOM_ROUTER_NAVIGATION type
      return Observable.of(new ACTIONS.CustomRouterNavigationAction({routerState}));
    });

  @Effect({dispatch: false})
  routeSeries$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_SERIES)
    .map((action: ACTIONS.RouteSeriesAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteSeriesPayload) => {
      const { podcastSeriesId } = payload;
      this.routeFromNewRouterState({podcastSeriesId});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routePodcastCharted$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_PODCAST_CHARTED)
    .map((action: ACTIONS.RoutePodcastChartedAction) => action.payload)
    .switchMap((payload: ACTIONS.RoutePodcastChartedPayload) => {
      const { chartPodcast } = payload;
      this.routeFromNewRouterState({chartPodcast});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeEpisodePage$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_EPISODE_PAGE)
    .map((action: ACTIONS.RouteEpisodePageAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteEpisodePagePayload) => {
      const { page } = payload;
      this.routeFromNewRouterState({page});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeEpisodesCharted$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_EPISODES_CHARTED)
    .map((action: ACTIONS.RouteEpisodesChartedAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteEpisodesChartedPayload) => {
      const { episodeIds } = payload;
      this.routeFromNewRouterState({episodeIds});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeSingleEpisodeCharted$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_SINGLE_EPISODE_CHARTED)
    .map((action: ACTIONS.RouteSingleEpisodeChartedAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteSingleEpisodeChartedPayload) => {
     const { episodeId, chartType } = payload;
     this.routeFromNewRouterState({episodeIds: [episodeId], chartType});
      return Observable.of(null);
    });

  // note that this is an Observable<void> dispatch: false because it only needs to dispatch when charted is false
  // so toggle off is handled via manual dispatch rather than by transform and dispatch an action from the effect
  // thought about doing this differently but it will go away soon enuf
  @Effect({dispatch: false})
  routeToggleEpisodeCharted$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_TOGGLE_EPISODE_CHARTED)
    .map((action: ACTIONS.RouteToggleEpisodeChartedAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteToggleEpisodeChartedPayload) => {
      const { episodeId, charted } = payload;
      let episodeIds;
      if (!charted) {
        this.store.dispatch(new ACTIONS.CastleEpisodeChartToggleAction({
          id: episodeId, seriesId: this.routerState.podcastSeriesId, charted}));
        episodeIds = this.routerState.episodeIds ? this.routerState.episodeIds.filter(id => id !== episodeId) : [];
      } else {
        episodeIds = this.routerState.episodeIds ? this.routerState.episodeIds.concat(episodeId) : [episodeId];
      }
      this.routeFromNewRouterState({episodeIds});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeChartType$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_CHART_TYPE)
    .map((action: ACTIONS.RouteChartTypeAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteChartTypePayload) => {
      const { chartType } = payload;
      this.routeFromNewRouterState({chartType});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeInterval$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_INTERVAL)
    .map((action: ACTIONS.RouteIntervalAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteIntervalPayload) => {
      const { interval } = payload;
      this.routeFromNewRouterState({interval});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeStandardRange$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_STANDARD_RANGE)
    .map((action: ACTIONS.RouteStandardRangeAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteStandardRangePayload) => {
      const { standardRange } = payload;
      const range = dateUtil.getBeginEndDateFromStandardRange(standardRange);
      this.routeFromNewRouterState({standardRange, ...range});
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeAdvancedRange$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_ADVANCED_RANGE)
    .map((action: ACTIONS.RouteAdvancedRangeAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteAdvancedRangePayload) => {
      // just keep doing this for now. soon.
      const { interval } = payload;
      const beginDate = dateUtil.roundDateToBeginOfInterval(payload.beginDate, interval);
      const endDate = dateUtil.roundDateToEndOfInterval(payload.endDate, interval);
      let standardRange = dateUtil.getStandardRangeForBeginEndDate(payload.beginDate, payload.endDate, interval);
      // if the dates for the given range are the same but the resulting string does match what is given, keep don't override
      const payloadRange = dateUtil.getBeginEndDateFromStandardRange(payload.standardRange);
      if (payload.standardRange !== standardRange &&
        payloadRange.beginDate.valueOf() === beginDate.valueOf() &&
        payloadRange.endDate.valueOf() === endDate.valueOf()) {
        standardRange = payload.standardRange;
      }
      this.routeFromNewRouterState({beginDate, endDate, interval, standardRange});
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
      params['beginDate'] = combinedRouterState.beginDate.toUTCString();
    }
    if (combinedRouterState.endDate) {
      params['endDate'] = combinedRouterState.endDate.toUTCString();
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
