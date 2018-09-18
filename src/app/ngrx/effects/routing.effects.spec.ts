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
  ChartType,
  MetricsType,
  CHARTTYPE_PODCAST,
  CHARTTYPE_EPISODES,
  INTERVAL_HOURLY,
  METRICSTYPE_DOWNLOADS
} from '../';
import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { RoutingEffects } from './routing.effects';
import { RoutingService } from '../../core/routing/routing.service';
import * as dateUtil from '../../shared/util/date';

@Component({
  selector: 'metrics-test-component',
  template: ``
})
class TestComponent {}

describe('RoutingEffects', () => {
  let effects: RoutingEffects;
  let actions$: TestActions;
  let store: Store<any>;

  const routerParams = {
    podcastId: '70',
    podcastSeriesId: 37800,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    chartType: <ChartType>CHARTTYPE_PODCAST,
    episodePage: 1,
    interval: INTERVAL_HOURLY,
    beginDate: new Date('2017-11-01T00:00:00.000Z'),
    endDate: new Date('2017-11-01T22:00:00.000')
  };

  const routes: Route[] = [
    {
      path: ':podcastId/reach/:chartType/:interval',
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

    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));

    spyOn(effects.routingService, 'normalizeAndRoute').and.callThrough();
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
});
