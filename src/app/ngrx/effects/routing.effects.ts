import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as ACTIONS from '../actions';
import * as dateUtil from '@app/shared/util/date';
import { RoutingService } from '@app/core/routing/routing.service';

@Injectable()
export class RoutingEffects {
  // ROUTER_NAVIGATION/RouterNavigationAction originates from the ngrx StoreRouterConnectingModule.
  // It is serialized from a RouterStateSnapshot by the custom RouterStateSerializer to a custom RouterParams
  // after serialize, a RouterNavigationAction still has router event extras attached
  // so here in the effect it is mapped to a CustomRouterNavigation to strip it down.
  // The router reducer captures the CustomRouterNavigation to save routing state.
  // The CustomRouterNavigation is mocked by tests but is _not_ otherwise ever manually called by the application,
  // only through routing and the router-store connecting module.
  customRouterNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      switchMap(action => {
        // drop guids from router params
        const { guids, ...routerParams } = action.payload.routerState['routerParams'];
        // select any episode guids on the route
        if (guids) {
          this.store.dispatch(
            ACTIONS.EpisodeSelectEpisodes({
              podcastId: routerParams.podcastId,
              metricsType: routerParams.metricsType,
              episodeGuids: guids
            })
          );
        }
        // map to an action with our CUSTOM_ROUTER_NAVIGATION type
        return of(ACTIONS.CustomRouterNavigation({ url: action.payload.routerState.url, routerParams }));
      })
    )
  );

  routePodcast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RoutePodcast),
        switchMap(action => {
          const { podcastId } = action;
          this.routingService.normalizeAndRoute({ podcastId, episodePage: 1 });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeEpisodePage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteEpisodePage),
        switchMap(action => {
          const { episodePage } = action;
          this.routingService.normalizeAndRoute({ episodePage });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeChartType$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteChartType),
        switchMap(action => {
          const { chartType } = action;
          this.routingService.normalizeAndRoute({ chartType });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeInterval$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteInterval),
        switchMap(action => {
          const { interval } = action;
          this.routingService.normalizeAndRoute({ interval });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeStandardRange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteStandardRange),
        switchMap(action => {
          const { standardRange } = action;
          const range = dateUtil.getBeginEndDateFromStandardRange(standardRange);
          this.routingService.normalizeAndRoute({ standardRange, ...range });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeAdvancedRange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteAdvancedRange),
        switchMap(action => {
          const { interval, beginDate, endDate, standardRange } = action;
          this.routingService.normalizeAndRoute({ beginDate, endDate, interval, standardRange });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeMetricsGroupType$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteMetricsGroupType),
        switchMap(action => {
          const { metricsType, group } = action;
          this.routingService.normalizeAndRoute({ metricsType, group });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeGroupFilter$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteGroupFilter),
        switchMap(action => {
          const { filter } = action;
          this.routingService.normalizeAndRoute({ filter });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  routeDays$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ACTIONS.RouteDays),
        switchMap(action => {
          const { days } = action;
          this.routingService.normalizeAndRoute({ days });
          return of(null);
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, public routingService: RoutingService, private store: Store<any>) {}
}
