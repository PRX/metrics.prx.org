import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterParams, ChartType, MetricsType, PodcastModel,
  CHARTTYPE_PODCAST, INTERVAL_DAILY,
  METRICSTYPE_DOWNLOADS, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES } from '../';
import { selectRouter, selectPodcasts } from '../reducers/selectors';
import { ActionTypes } from '../actions';
import * as ACTIONS from '../actions';
import * as dateUtil from '../../shared/util/date';
import * as localStorageUtil from '../../shared/util/local-storage.util';

@Injectable()
export class RoutingEffects {
  routerParams: RouterParams;
  podcasts: PodcastModel[];

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
    map((action: ACTIONS.CustomRouterNavigationAction) => action.payload),
    switchMap((payload: ACTIONS.CustomRouterNavigationPayload) => {
      const routerState: RouterParams = {...payload.routerState};
      // map to an action with our CUSTOM_ROUTER_NAVIGATION type
      return Observable.of(new ACTIONS.CustomRouterNavigationAction({routerState}));
    })
  );

  @Effect({dispatch: false})
  routePodcast$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_PODCAST),
    map((action: ACTIONS.RoutePodcastAction) => action.payload),
    switchMap((payload: ACTIONS.RoutePodcastPayload) => {
      const { podcastId, podcastSeriesId } = payload;
      this.routeFromNewRouterParams({podcastId, podcastSeriesId, episodePage: 1, episodeIds: []});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routePodcastCharted$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_PODCAST_CHARTED),
    map((action: ACTIONS.RoutePodcastChartedAction) => action.payload),
    switchMap((payload: ACTIONS.RoutePodcastChartedPayload) => {
      const { chartPodcast } = payload;
      this.routeFromNewRouterParams({chartPodcast});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeEpisodePage$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_EPISODE_PAGE),
    map((action: ACTIONS.RouteEpisodePageAction) => action.payload),
    switchMap((payload: ACTIONS.RouteEpisodePagePayload) => {
      const { episodePage } = payload;
      // route to no episodes so that incoming episodes will be charted again by default (reset state)
      this.routeFromNewRouterParams({episodePage, episodeIds: []});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeEpisodesCharted$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_EPISODES_CHARTED),
    map((action: ACTIONS.RouteEpisodesChartedAction) => action.payload),
    switchMap((payload: ACTIONS.RouteEpisodesChartedPayload) => {
      const { episodeIds } = payload;
      this.routeFromNewRouterParams({episodeIds});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeSingleEpisodeCharted$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_SINGLE_EPISODE_CHARTED),
    map((action: ACTIONS.RouteSingleEpisodeChartedAction) => action.payload),
    switchMap((payload: ACTIONS.RouteSingleEpisodeChartedPayload) => {
      const { episodeId, chartType, episodePage } = payload;
      const metricsType = METRICSTYPE_DOWNLOADS;
      if (episodePage) {
        this.routeFromNewRouterParams({episodeIds: [episodeId], chartType, metricsType, episodePage});
      } else {
        this.routeFromNewRouterParams({episodeIds: [episodeId], chartType, metricsType});
      }
      return Observable.of(null);
    })
  );

  // note that this is an Observable<void> dispatch: false because it only needs to dispatch when charted is false
  // so toggle off is handled via manual dispatch rather than by transform and dispatch an action from the effect
  // thought about doing this differently but it will go away soon enuf
  @Effect({dispatch: false})
  routeToggleEpisodeCharted$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_TOGGLE_EPISODE_CHARTED),
    map((action: ACTIONS.RouteToggleEpisodeChartedAction) => action.payload),
    switchMap((payload: ACTIONS.RouteToggleEpisodeChartedPayload) => {
      const { episodeId, charted } = payload;
      let episodeIds;
      if (charted) {
        episodeIds = this.routerParams.episodeIds ? this.routerParams.episodeIds.concat(episodeId) : [episodeId];
      } else {
        episodeIds = this.routerParams.episodeIds ? this.routerParams.episodeIds.filter(id => id !== episodeId) : [];
      }
      this.routeFromNewRouterParams({episodeIds});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeChartType$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_CHART_TYPE),
    map((action: ACTIONS.RouteChartTypeAction) => action.payload),
    switchMap((payload: ACTIONS.RouteChartTypePayload) => {
      const { chartType } = payload;
      this.routeFromNewRouterParams({chartType});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeInterval$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_INTERVAL),
    map((action: ACTIONS.RouteIntervalAction) => action.payload),
    switchMap((payload: ACTIONS.RouteIntervalPayload) => {
      const { interval } = payload;
      this.routeFromNewRouterParams({interval});
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
      this.routeFromNewRouterParams({standardRange, ...range});
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  routeAdvancedRange$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.ROUTE_ADVANCED_RANGE),
    map((action: ACTIONS.RouteAdvancedRangeAction) => action.payload),
    switchMap((payload: ACTIONS.RouteAdvancedRangePayload) => {
      const { interval, beginDate, endDate, standardRange } = payload;
      this.routeFromNewRouterParams({beginDate, endDate, interval, standardRange});
      return Observable.of(null);
    })
  );

 @Effect({dispatch: false})
 routeMetricsType$: Observable<void> = this.actions$.pipe(
   ofType(ActionTypes.ROUTE_METRICS_TYPE),
   map((action: ACTIONS.RouteMetricsTypeAction) => action.payload),
   switchMap((payload: ACTIONS.RouteMetricsTypePayload) => {
     const { metricsType } = payload;
     this.routeFromNewRouterParams(({metricsType}));
     return Observable.of(null);
   })
 );

  constructor(public store: Store<any>,
              private router: Router,
              private actions$: Actions) {
    this.store.pipe(select(selectRouter)).subscribe(routerParams => {
      this.loadEpisodesIfChanged(routerParams);

      this.routerParams = routerParams;
    });

    /* TODO: don't seem to be using this
    this.store.pipe(select(selectPodcasts)).subscribe(podcasts => this.podcasts = podcasts);*/

    // for redirecting users routed to '/'
    this.router.events.pipe(
      filter(event => event instanceof RoutesRecognized)
    ).subscribe((event: RoutesRecognized) => {
      if (event.url === '/' && this.routerParams && this.routerParams.podcastSeriesId) {
        this.routeFromNewRouterParams(this.routerParams);
      }
    });
  }

  routeFromNewRouterParams(newRouterParams: RouterParams): RouterParams {
    const combinedRouterParams: RouterParams = { ...this.routerParams, ...newRouterParams};
    if (!combinedRouterParams.metricsType) {
      combinedRouterParams.metricsType = <MetricsType>METRICSTYPE_DOWNLOADS;
    }
    if (!combinedRouterParams.chartType) {
      combinedRouterParams.chartType = <ChartType>CHARTTYPE_PODCAST;
    }
    if (!combinedRouterParams.interval) {
      combinedRouterParams.interval = INTERVAL_DAILY;
    }

    const params = {};
    if (combinedRouterParams.episodePage) {
      params['episodePage'] = combinedRouterParams.episodePage;
    }
    if (combinedRouterParams.episodePage) {
      params['page'] = combinedRouterParams.episodePage;
    }
    if (combinedRouterParams.guid) {
      params['guid'] = combinedRouterParams.guid;
    }
    if (combinedRouterParams.standardRange) {
      params['standardRange'] = combinedRouterParams.standardRange;
    }
    if (combinedRouterParams.beginDate) {
      params['beginDate'] = combinedRouterParams.beginDate.toUTCString();
    }
    if (combinedRouterParams.endDate) {
      params['endDate'] = combinedRouterParams.endDate.toUTCString();
    }
    if (combinedRouterParams.chartPodcast !== undefined) {
      params['chartPodcast'] = combinedRouterParams.chartPodcast;
    } else if (combinedRouterParams.metricsType === METRICSTYPE_DOWNLOADS) {
      params['chartPodcast'] = true; // true is the default for downloads
    }
    if (combinedRouterParams.episodeIds) {
      params['episodes'] = combinedRouterParams.episodeIds.join(',');
    }

    localStorageUtil.setItem(localStorageUtil.KEY_ROUTER_PARAMS, combinedRouterParams);

    switch (combinedRouterParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        this.router.navigate([
          combinedRouterParams.podcastSeriesId,
          combinedRouterParams.podcastId,
          combinedRouterParams.metricsType,
          combinedRouterParams.chartType,
          combinedRouterParams.interval.key,
          params
        ]);
        break;
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        this.router.navigate([
          combinedRouterParams.podcastSeriesId,
          combinedRouterParams.podcastId,
          combinedRouterParams.metricsType,
          params
        ]);
        break;
    }
    return combinedRouterParams;
  }

  loadEpisodesIfChanged(newRouterParams: RouterParams) {
    if (newRouterParams && newRouterParams.podcastId && (!this.routerParams ||
      newRouterParams.podcastId !== this.routerParams.podcastId ||
      newRouterParams.episodePage !== this.routerParams.episodePage)) {
        this.store.dispatch(new ACTIONS.CastleEpisodePageLoadAction({
          podcastId: newRouterParams.podcastId,
          page: newRouterParams.episodePage || 1,
          all: newRouterParams.podcastSeriesId !== this.routerParams.podcastSeriesId}));
    }
  }
}
