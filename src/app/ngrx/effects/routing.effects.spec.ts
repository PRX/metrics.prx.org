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
import { ChartType, MetricsType, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, INTERVAL_HOURLY, METRICSTYPE_DOWNLOADS } from '../';
import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { RoutingEffects } from './routing.effects';
import * as dateUtil from '../../shared/util/date';
import * as localStorageUtil from '../../shared/util/local-storage.util';

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
    page: 1,
    interval: INTERVAL_HOURLY,
    beginDate: new Date('2017-11-01T00:00:00.000Z'),
    endDate: new Date('2017-11-01T22:00:00.000'),
    episodeIds: [123, 1234],
    chartPodcast: true
  };

  const routes: Route[] = [
    {
      path: ':seriesId/:podcastId/reach/:chartType/:interval',
      component: TestComponent
    },
    {
      path: ':seriesId/:podcastId/demographics',
      component: TestComponent
    },
    {
      path: ':seriesId/:podcastId/devices',
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
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(RoutingEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));

    spyOn(effects, 'routeFromNewRouterParams').and.callThrough();
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

  it('should route to podcast on episode page 1 and reset charted episodes', () => {
    const action = new ACTIONS.RoutePodcastAction({podcastId: '70', podcastSeriesId: 37800});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routePodcast$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith(
      {podcastId: '70', podcastSeriesId: 37800, episodePage: 1, episodeIds: []});
  });

  it('should route to podcast charted', () => {
    const action = new ACTIONS.RoutePodcastChartedAction({chartPodcast: false});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routePodcastCharted$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({chartPodcast: false});
  });

  it('should route to episode page and reset episode route', () => {
    const action = new ACTIONS.RouteEpisodePageAction({episodePage: 1});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeEpisodePage$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({episodePage: 1, episodeIds: []});
  });

  it('should route to episodes charted', () => {
    const action = new ACTIONS.RouteEpisodesChartedAction({episodeIds: [123, 1234]});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeEpisodesCharted$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({episodeIds: [123, 1234]});
  });

  it('should route to single episode charted', () => {
    const action = new ACTIONS.RouteSingleEpisodeChartedAction({episodeId: 123, chartType: CHARTTYPE_EPISODES});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeSingleEpisodeCharted$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith(
      {episodeIds: [123], chartType: CHARTTYPE_EPISODES, metricsType: METRICSTYPE_DOWNLOADS});
  });

  it('routes to single episode on a specific page', () => {
    const action = new ACTIONS.RouteSingleEpisodeChartedAction({episodeId: 123, chartType: CHARTTYPE_EPISODES, episodePage: 2});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeSingleEpisodeCharted$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith(
      {episodeIds: [123], chartType: CHARTTYPE_EPISODES, episodePage: 2, metricsType: METRICSTYPE_DOWNLOADS});
  });

  it('should route to toggle episode charted ', () => {
    const action = new ACTIONS.RouteToggleEpisodeChartedAction({episodeId: 123, charted: false});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeToggleEpisodeCharted$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({episodeIds: routerParams.episodeIds.filter(id => id !== 123)});
  });

  it('should route to chart type', () => {
    const action = new ACTIONS.RouteChartTypeAction({chartType: CHARTTYPE_EPISODES});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeChartType$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({chartType: CHARTTYPE_EPISODES});
  });

  it('should route to interval', () => {
    const action = new ACTIONS.RouteIntervalAction({interval: INTERVAL_HOURLY});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeInterval$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({interval: INTERVAL_HOURLY});
  });

  it('should route to standard range and include begin and end dates', () => {
    const action = new ACTIONS.RouteStandardRangeAction({standardRange: dateUtil.LAST_WEEK});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeStandardRange$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({
      standardRange: dateUtil.LAST_WEEK,
      beginDate: dateUtil.beginningOfLastWeekUTC().toDate(),
      endDate: dateUtil.endOfLastWeekUTC().toDate()
    });
  });

  it('should route to advanced range', () => {
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
    expect(effects.routeFromNewRouterParams).toHaveBeenCalled();
  });

  it('should route to metrics type', () => {
    const action = new ACTIONS.RouteMetricsTypeAction({metricsType: METRICSTYPE_DOWNLOADS});
    store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: null });
    expect(effects.routeMetricsType$).toBeObservable(expected);
    expect(effects.routeFromNewRouterParams).toHaveBeenCalledWith({metricsType: METRICSTYPE_DOWNLOADS});
  });

  it('should save routerState in localStorage', () => {
    localStorage.clear();
    effects.routeFromNewRouterParams(routerParams);
    expect(localStorageUtil.getItem(localStorageUtil.KEY_ROUTER_PARAMS).podcastSeriesId).toEqual(routerParams.podcastSeriesId);
  });
});
