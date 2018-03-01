import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { RouterModel, ChartType, MetricsType, PodcastModel,
  CHARTTYPE_PODCAST, INTERVAL_DAILY,
  METRICSTYPE_DOWNLOADS, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES } from '../';
import { selectRouter, selectPodcasts } from '../reducers/selectors';
import { ActionTypes } from '../actions';
import * as ACTIONS from '../actions';
import * as dateUtil from '../../shared/util/date';

@Injectable()
export class RoutingEffects {
  routerState: RouterModel;
  podcasts: PodcastModel[];

  // ROUTER_NAVIGATION/RouterNavigationAction originates from the ngrx StoreRouterConnectingModule.
  // It is serialized from a RouterStateSnapshot by the custom RouterStateSerializer to a custom RouterModel
  // after serialize, a RouterNavigationAction still has router event extras attached
  // so here in the effect it is mapped to a CustomRouterNavigationAction to strip it down.
  // The router reducer captures the CustomRouterNavigationAction to save routing state.
  // The CustomRouterNavigationAction is mocked by tests but is _not_ otherwise ever manually called by the application,
  // only through routing and the router-store connecting module.
  @Effect({dispatch: false})
  customRouterNavigation$: Observable<void> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((action: ACTIONS.CustomRouterNavigationAction) => action.payload)
    .switchMap((payload: ACTIONS.CustomRouterNavigationPayload) => {
      const routerState: RouterModel = {...payload.routerState};
      // map to an action with our CUSTOM_ROUTER_NAVIGATION type
      if (Object.keys(routerState).length > 0) {
        // TODO: fix below and return Action rather than only sometimes dispatch
        this.store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState}));
      }
      // TODO: #141 and #142
      // because of the unsupported link to '/' in the PRX header,
      // only sending custom routing action if there are params on the route
      // so as not to clear the charted episodes in the episode metrics reducer
      // what was happening is it would get an empty CustomRouterNavigationAction, clear charted on episode metrics,
      // then there would be no ROUTER_NAVIGATION event or CustomRouterNavigationAction for the navigation back to the previous route
      // so even though they were on the route, episodes were uncharted
      // combining episode data selectors with the route selectors and not duplicating state would fix this
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  routeSeries$: Observable<void> = this.actions$
    .ofType(ActionTypes.ROUTE_SERIES)
    .map((action: ACTIONS.RouteSeriesAction) => action.payload)
    .switchMap((payload: ACTIONS.RouteSeriesPayload) => {
      const { podcastSeriesId } = payload;
      this.routeFromNewRouterState({podcastSeriesId, page: 1, episodeIds: []});
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
      // route to no episodes so that incoming episodes will be charted again by default (reset state)
      this.routeFromNewRouterState({page, episodeIds: []});
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
      const { episodeId, chartType, page } = payload;
      const metricsType = METRICSTYPE_DOWNLOADS;
      if (page) {
        this.routeFromNewRouterState({episodeIds: [episodeId], chartType, metricsType, page});
      } else {
        this.routeFromNewRouterState({episodeIds: [episodeId], chartType, metricsType});
      }
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
      if (charted) {
        episodeIds = this.routerState.episodeIds ? this.routerState.episodeIds.concat(episodeId) : [episodeId];
      } else {
        episodeIds = this.routerState.episodeIds ? this.routerState.episodeIds.filter(id => id !== episodeId) : [];
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
      const { interval, beginDate, endDate, standardRange } = payload;
      this.routeFromNewRouterState({beginDate, endDate, interval, standardRange});
      return Observable.of(null);
    });

 @Effect({dispatch: false})
 routeMetricsType$: Observable<void> = this.actions$
  .ofType(ActionTypes.ROUTE_METRICS_TYPE)
  .map((action: ACTIONS.RouteMetricsTypeAction) => action.payload)
  .switchMap((payload: ACTIONS.RouteMetricsTypePayload) => {
    const { metricsType } = payload;
    this.routeFromNewRouterState(({metricsType}));
    return Observable.of(null);
  });

  constructor(public store: Store<any>,
              private router: Router,
              private actions$: Actions) {
    this.store.select(selectRouter).subscribe(routerState => this.routerState = routerState);
    this.store.select(selectPodcasts).subscribe(podcasts => this.podcasts = podcasts);
    this.router.events.filter(event => event instanceof RoutesRecognized).subscribe((event: RoutesRecognized) => {
      if (event.url === '/' && this.routerState && this.routerState.podcastSeriesId) {
        this.routeFromNewRouterState(this.routerState);
      }
    });
  }

  routeFromNewRouterState(newRouteParams: RouterModel): RouterModel {
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

    switch (combinedRouterState.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        this.router.navigate([
            combinedRouterState.podcastSeriesId,
            combinedRouterState.metricsType,
            combinedRouterState.chartType,
            combinedRouterState.interval.key,
            params
          ]);
        break;
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        this.router.navigate([
            combinedRouterState.podcastSeriesId,
            combinedRouterState.metricsType,
            params
          ]);
        break;
    }
    return combinedRouterState;
  }
}
