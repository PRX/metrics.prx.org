import { Component } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { getActions, TestActions } from './test.actions';
import {
  CHARTTYPE_EPISODES,
  INTERVAL_HOURLY,
  METRICSTYPE_DOWNLOADS,
  User
} from '../';
import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { RoutingEffects } from './routing.effects';
import { RoutingService } from '../../core/routing/routing.service';
import * as dateUtil from '../../shared/util/date';
import { routerParams, userinfo } from '../../../testing/downloads.fixtures';
import { METRICSTYPE_DROPDAY } from '../reducers/models';

@Component({
  selector: 'metrics-test-component',
  template: ``
})
class TestComponent {}

describe('RoutingEffects', () => {
  let effects: RoutingEffects;
  let actions$: TestActions;
  let store: Store<any>;

  const user: User = {doc: null, loggedIn: true, authorized: true, userinfo};

  const routes: Route[] = [
    {
      path: ':podcastId/reach/:chartType/:interval',
      component: TestComponent
    },
    {
      path: ':podcastId/dropday/:chartType/:interval',
      component: TestComponent
    },
    {
      path: ':podcastId/demographics',
      component: TestComponent
    },
    {
      path: ':podcastId/devices',
      component: TestComponent
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        StoreModule.forRoot({...reducers, routerReducer: routerReducer}),
        EffectsModule.forRoot([RoutingEffects]),
      ],
      providers: [
        RoutingEffects,
        RoutingService,
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(RoutingEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);

    jest.spyOn(store, 'dispatch');
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
    store.dispatch(new ACTIONS.IdUserinfoSuccessAction({user}));

    jest.spyOn(effects.routingService, 'normalizeAndRoute');
  }));

  it('should map ROUTER_NAVIGATION to CustomRouterNavigationAction', () => {
    const action = {
      type: ROUTER_NAVIGATION,
      payload: {routerState: routerParams}
    };
    const result = new ACTIONS.CustomRouterNavigationAction({routerParams});
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: result });
    expect(effects.customRouterNavigation$).toBeObservable(expected);
  });

  it('should select episodes from incoming route but drop them from custom route', () => {
    jest.spyOn(store, 'dispatch');
    const selectedEpisodesRouterParams = {...routerParams, guids: ['abcdefg', 'hijklmn']};
    const action = {
      type: ROUTER_NAVIGATION,
      payload: {routerState: selectedEpisodesRouterParams}
    };
    // result does not have selected episodes
    const result = new ACTIONS.CustomRouterNavigationAction({routerParams});
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: result });
    expect(effects.customRouterNavigation$).toBeObservable(expected);
    // selected episodes dispatched to store
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: ['abcdefg', 'hijklmn']}));
  });

  it('should route to podcast on episode page 1', () => {
    const action = new ACTIONS.RoutePodcastAction({podcastId: '70'});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routePodcast$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({podcastId: '70', episodePage: 1});
  });

  it('should route to episode page', () => {
    const action = new ACTIONS.RouteEpisodePageAction({episodePage: 1});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeEpisodePage$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({episodePage: 1});
  });

  xit('should route to chart type', () => {
    const action = new ACTIONS.RouteChartTypeAction({chartType: CHARTTYPE_EPISODES});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeChartType$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({chartType: CHARTTYPE_EPISODES});
  });

  xit('should route to interval', () => {
    const action = new ACTIONS.RouteIntervalAction({interval: INTERVAL_HOURLY});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeInterval$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({interval: INTERVAL_HOURLY});
  });

  xit('should route to standard range and include begin and end dates', () => {
    const action = new ACTIONS.RouteStandardRangeAction({standardRange: dateUtil.LAST_WEEK});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeStandardRange$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({
      standardRange: dateUtil.LAST_WEEK,
      beginDate: dateUtil.beginningOfLastWeekUTC().toDate(),
      endDate: dateUtil.endOfLastWeekUTC().toDate()
    });
  });

  xit('should route to advanced range', () => {
    const action = new ACTIONS.RouteAdvancedRangeAction({
      interval: INTERVAL_HOURLY,
      standardRange: dateUtil.LAST_WEEK,
      beginDate: dateUtil.beginningOfLastWeekUTC().toDate(),
      endDate: dateUtil.endOfLastWeekUTC().toDate()
    });
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeAdvancedRange$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalled();
  });

  it('should route to metrics and group type', () => {
    const action = new ACTIONS.RouteMetricsGroupTypeAction({metricsType: METRICSTYPE_DOWNLOADS});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeMetricsGroupType$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({metricsType: METRICSTYPE_DOWNLOADS, group: undefined});
  });

  it('should route to filter', () => {
    const action = new ACTIONS.RouteGroupFilterAction({filter: METRICSTYPE_DOWNLOADS});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeGroupFilter$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({filter: METRICSTYPE_DOWNLOADS});
  });

  it('should route to days', () => {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, metricsType: METRICSTYPE_DROPDAY}}));
    const action = new ACTIONS.RouteDaysAction({days: 7});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeDays$).toBeObservable(expected);
    expect(effects.routingService.normalizeAndRoute).toHaveBeenCalledWith({days: 7});
  });
});
