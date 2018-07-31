import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction, RouterNavigationPayload } from '@ngrx/router-store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterParams, ChartType, MetricsType, Episode,
  CHARTTYPE_PODCAST, INTERVAL_DAILY,
  METRICSTYPE_DOWNLOADS, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES } from '../';
import { selectRouter, selectRoutedPageEpisodes } from '../reducers/selectors';
import { ActionTypes } from '../actions';
import * as ACTIONS from '../actions';
import * as dateUtil from '../../shared/util/date';
import * as localStorageUtil from '../../shared/util/local-storage.util';
import { isBeginDateChanged, isEndDateChanged, isIntervalChanged } from '../../shared/util/filter.util';

@Injectable()
export class RoutingEffects {
  routerParams: RouterParams;
  episodes: Episode[];

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
      this.routeFromNewRouterParams({podcastId, episodePage: 1, episodeIds: []});
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
    this.dontAllowRoot();
    this.subRoutedPageEpisodes();
    this.subAndCheckRouterParams();
  }

  dontAllowRoot() {
    // for redirecting users routed to '/'
    this.router.events.pipe(
      filter(event => event instanceof RoutesRecognized)
    ).subscribe((event: RoutesRecognized) => {
      if (event.url === '/' && this.routerParams && this.routerParams.podcastId) {
        this.routeFromNewRouterParams(this.routerParams);
      }
    });
  }

  subRoutedPageEpisodes() {
    this.store.pipe(select(selectRoutedPageEpisodes)).subscribe((episodes: Episode[]) => {
      this.episodes = episodes;
    });
  }

  routeFromNewRouterParams(newRouterParams: RouterParams): RouterParams {
    const routerParams: RouterParams = this.checkAndGetDefaults({ ...this.routerParams, ...newRouterParams});

    const params = {};
    if (routerParams.episodePage) {
      params['episodePage'] = routerParams.episodePage;
    }
    if (routerParams.guid) {
      params['guid'] = routerParams.guid;
    }
    if (routerParams.standardRange) {
      params['standardRange'] = routerParams.standardRange;
    }
    if (routerParams.beginDate) {
      params['beginDate'] = routerParams.beginDate.toUTCString();
    }
    if (routerParams.endDate) {
      params['endDate'] = routerParams.endDate.toUTCString();
    }
    if (routerParams.chartPodcast !== undefined) {
      params['chartPodcast'] = routerParams.chartPodcast;
    } else if (routerParams.metricsType === METRICSTYPE_DOWNLOADS) {
      params['chartPodcast'] = true; // true is the default for downloads
    }
    if (routerParams.episodeIds) {
      params['episodes'] = routerParams.episodeIds.join(',');
    }

    localStorageUtil.setItem(localStorageUtil.KEY_ROUTER_PARAMS, routerParams);

    switch (routerParams.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        this.router.navigate([
          routerParams.podcastId,
          routerParams.metricsType,
          routerParams.chartType,
          routerParams.interval.key,
          params
        ]);
        break;
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
        this.router.navigate([
          routerParams.podcastId,
          routerParams.metricsType,
          params
        ]);
        break;
    }
    return routerParams;
  }

  checkAndGetDefaults(routerParams: RouterParams) {
    if (!routerParams.metricsType) {
      routerParams.metricsType = <MetricsType>METRICSTYPE_DOWNLOADS;
    }
    if (!routerParams.chartType) {
      routerParams.chartType = <ChartType>CHARTTYPE_PODCAST;
    }
    if (!routerParams.interval) {
      routerParams.interval = INTERVAL_DAILY;
    }
    if (!routerParams.episodePage) {
      routerParams.episodePage = 1;
    }
    if (!routerParams.standardRange) {
      routerParams.standardRange = dateUtil.LAST_28_DAYS;
    }
    if (!routerParams.beginDate) {
      routerParams.beginDate = dateUtil.beginningOfLast28DaysUTC().toDate();
    }
    if (!routerParams.endDate) {
      routerParams.endDate = dateUtil.endOfTodayUTC().toDate();
    }
    return routerParams;
  }

  subAndCheckRouterParams() {
    this.store.pipe(select(selectRouter)).subscribe(routerParams => {
      // don't do anything with setting route or loading metrics until podcast is set
      if (routerParams.podcastId && routerParams.podcastSeriesId) {
        // if this.routerParams has not yet been set, go through routing which checks for and sets defaults
        if (!this.routerParams) {
          this.routeFromNewRouterParams(routerParams);
        }

        // TODO: still a problem here, never loads the episodes if default set to 1
        // load episodes if the episode page changed or not set or if podcast id changed
        if (!this.loadEpisodesIfChanged(routerParams)) {
          // if episode page or podcast didn't change, check if router params changed and load metrics
          // otherwise episode page loading will trigger loading of metrics (in order to load metrics for each episode)
          this.loadMetricsIfRouterParamsChanged(routerParams);
        }
        this.routerParams = routerParams;
      }
    });
  }

  loadEpisodesIfChanged(newRouterParams: RouterParams) {
    // TODO: I think we are actually covered here...
    // if episode page changes, metrics are loaded from castle.effects
    // so is it just podcast id newly set or changed?
    if (newRouterParams && newRouterParams.podcastId && (
      !this.routerParams || !newRouterParams.episodePage ||
      newRouterParams.podcastId !== this.routerParams.podcastId ||
      newRouterParams.episodePage !== this.routerParams.episodePage)) {
        this.store.dispatch(new ACTIONS.CastleEpisodePageLoadAction({
          podcastId: newRouterParams.podcastId,
          page: newRouterParams.episodePage || 1,
          all: !this.routerParams || this.routerParams.podcastId !== newRouterParams.podcastId}));
        return true;
    } else {
      return false;
    }
  }

  loadMetricsIfRouterParamsChanged(newRouterParams: RouterParams) {
    let loadMetrics = false;

    if (isBeginDateChanged(newRouterParams, this.routerParams)) {
      loadMetrics = true;
    }
    if (isEndDateChanged(newRouterParams, this.routerParams)) {
      loadMetrics = true;
    }
    if (isIntervalChanged(newRouterParams, this.routerParams)) {
      loadMetrics = true;
    }

    if (loadMetrics) {
      this.store.dispatch(new ACTIONS.CastlePodcastMetricsLoadAction({
        id: newRouterParams.podcastId,
        metricsType: newRouterParams.metricsType,
        interval: newRouterParams.interval,
        beginDate: newRouterParams.beginDate,
        endDate: newRouterParams.endDate
      }));
      this.store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({id: newRouterParams.podcastId}));
      return this.episodes.forEach((episode: Episode) => {
        this.store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({
          podcastId: episode.podcastId,
          guid: episode.guid
        }));
        this.store.dispatch(new ACTIONS.CastleEpisodeMetricsLoadAction({
          podcastId: episode.podcastId,
          page: episode.page,
          guid: episode.guid,
          metricsType: newRouterParams.metricsType,
          interval: newRouterParams.interval,
          beginDate: newRouterParams.beginDate,
          endDate: newRouterParams.endDate
        }));
      });
    }
  }
}
