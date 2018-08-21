import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { filter } from 'rxjs/operators/filter';
import { RoutingService } from './routing.service';
import { StoreModule, Store } from '@ngrx/store';
import { reducers } from '../../ngrx/reducers';
import * as ACTIONS from '../../ngrx/actions';
import {
  GROUPTYPE_GEOCOUNTRY,
  INTERVAL_DAILY,
  INTERVAL_MONTHLY,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_DOWNLOADS
} from '../../ngrx/';
import * as dateUtil from '../../shared/util/date/date.util';
import * as localStorageUtil from '../../shared/util/local-storage.util';
import { routerParams, episodes } from '../../../testing/downloads.fixtures';

@Component({
  selector: 'metrics-test-component',
  template: ``
})
class TestComponent {}

describe('RoutingService', () => {
  let routingService: RoutingService;
  let store: Store<any>;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: ':podcastId/reach/:chartType/:interval', component: TestComponent },
          { path: ':podcastId/demographics/:group/:chartType/:interval', component: TestComponent }
        ]),
        StoreModule.forRoot(reducers)
      ],
      providers: [
        RoutingService
      ]
    }).compileComponents().then(() => {
      routingService = TestBed.get(RoutingService);
      store = TestBed.get(Store);
      router = TestBed.get(Router);
    });
  }));

  it('should redirect users away from / and back to existing or default route params', () => {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
    spyOn(routingService, 'normalizeAndRoute').and.callThrough();
    router.navigate([]);
    router.events.pipe(
      filter(event => event instanceof RoutesRecognized)
    ).subscribe((event: RoutesRecognized) => {
      expect(routingService.normalizeAndRoute).toHaveBeenCalledWith(routerParams);
    });
  });

  it('should load episodes if podcast or episodePage changes', () => {
    spyOn(routingService, 'loadEpisodes').and.callThrough();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {podcastId: routerParams.podcastId, episodePage: 2}}));
    expect(routingService.loadEpisodes).toHaveBeenCalled();
  });

  it('should reload metrics data if podcast or episodes has not changed but begin/end dates or interval changes', () => {
    spyOn(routingService, 'loadEpisodes').and.callThrough();
    spyOn(routingService, 'loadDownloads').and.callThrough();
    const beginDate = new Date();
    store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
      episodes: [{
        guid: episodes[1].guid,
        title: episodes[1].title,
        publishedAt: episodes[1].publishedAt,
        page: 2,
        podcastId: episodes[1].podcastId
      }],
      page: 2,
      total: episodes.length
    }));
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {
      ...routerParams, podcastId: routerParams.podcastId, episodePage: 2}}));
    expect(routingService.loadEpisodes).toHaveBeenCalled();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {beginDate}}));
    expect(routingService.loadDownloads).toHaveBeenCalled();
  });

  it('should reload episodes if metrics type changes to reach/downloads', () => {
    spyOn(routingService, 'loadEpisodes').and.callThrough();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams:
        {...routerParams, metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY}}));
    expect(routingService.loadEpisodes).not.toHaveBeenCalled();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {metricsType: METRICSTYPE_DOWNLOADS}}));
    expect(routingService.loadEpisodes).toHaveBeenCalled();
  });

  it('should save routerState in localStorage', () => {
    localStorage.clear();
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
    routingService.normalizeAndRoute(routerParams);
    expect(localStorageUtil.getItem(localStorageUtil.KEY_ROUTER_PARAMS).podcastId).toEqual(routerParams.podcastId);
  });

  it('should normalize router params and navigate using defaults if params not present', () => {
    const newParams = {podcastId: '82'};
    const { podcastId, metricsType, chartType, interval, beginDate, endDate, ...params } = routingService.checkAndGetDefaults(newParams);
    spyOn(routingService, 'normalizeAndRoute').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
    // other route params are not yet defined
    expect(routingService.routerParams).toBeUndefined();
    // update router params state via routing action using only the podcastId
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: newParams}));
    // expect that we've routed to podcastId with other params as defaults
    expect(router.navigate).toHaveBeenCalledWith([
      podcastId,
      metricsType,
      chartType,
      interval.key,
      {...params, beginDate: beginDate.toUTCString(), endDate: endDate.toUTCString()}
    ]);
  });

  it('should check if podcast changed', () => {
    routingService.routerParams = undefined;
    expect(routingService.isPodcastChanged({podcastId: '123'})).toBeTruthy();
    expect(routingService.isPodcastChanged(undefined)).toBeFalsy();

    routingService.routerParams = {};
    expect(routingService.isPodcastChanged({podcastId: '123'})).toBeTruthy();

    routingService.routerParams = {podcastId: '1234'};
    expect(routingService.isPodcastChanged({podcastId: '123'})).toBeTruthy();
    expect(routingService.isPodcastChanged(undefined)).toBeFalsy();

    routingService.routerParams = {podcastId: '123'};
    expect(routingService.isPodcastChanged({podcastId: '123'})).toBeFalsy();
  });

  it ('should check if episodes changed', () => {
    routingService.routerParams = undefined;
    expect(routingService.isEpisodesChanged({episodePage: 1})).toBeTruthy();
    routingService.routerParams = undefined;
    expect(routingService.isEpisodesChanged(undefined)).toBeFalsy();

    routingService.routerParams = {};
    expect(routingService.isEpisodesChanged({episodePage: 1})).toBeTruthy();

    routingService.routerParams = {episodePage: 2};
    expect(routingService.isEpisodesChanged({episodePage: 1})).toBeTruthy();

    routingService.routerParams = {episodePage: 1};
    expect(routingService.isEpisodesChanged(undefined)).toBeFalsy();
    expect(routingService.isEpisodesChanged({episodePage: 1})).toBeFalsy();
  });

  it('should check if interval changed', () => {
    routingService.routerParams = {};
    expect(routingService.isIntervalChanged({interval: INTERVAL_DAILY})).toBeTruthy();
    expect(routingService.isIntervalChanged({})).toBeFalsy();

    routingService.routerParams = {interval: INTERVAL_MONTHLY};
    expect(routingService.isIntervalChanged({interval: INTERVAL_DAILY})).toBeTruthy();

    routingService.routerParams = {interval: INTERVAL_DAILY};
    expect(routingService.isIntervalChanged({interval: INTERVAL_DAILY})).toBeFalsy();
  });

  it('should check if begin date changed', () => {
    routingService.routerParams = {};
    expect(routingService.isBeginDateChanged({beginDate: dateUtil.beginningOfTodayUTC().toDate()})).toBeTruthy();
    expect(routingService.isBeginDateChanged({})).toBeFalsy();

    routingService.routerParams = {beginDate: dateUtil.beginningOfLastWeekUTC().toDate()};
    expect(routingService.isBeginDateChanged({beginDate: dateUtil.beginningOfTodayUTC().toDate()})).toBeTruthy();

    routingService.routerParams = {beginDate: dateUtil.beginningOfTodayUTC().toDate()};
    expect(routingService.isBeginDateChanged({beginDate: dateUtil.beginningOfTodayUTC().toDate()})).toBeFalsy();
  });

  it('should check if end date changed', () => {
    routingService.routerParams = {};
    expect(routingService.isEndDateChanged({endDate: dateUtil.endOfTodayUTC().toDate()})).toBeTruthy();
    expect(routingService.isEndDateChanged({})).toBeFalsy();

    routingService.routerParams = {endDate: dateUtil.endOfLastWeekUTC().toDate()};
    expect(routingService.isEndDateChanged({endDate: dateUtil.endOfTodayUTC().toDate()})).toBeTruthy();

    routingService.routerParams = {endDate: dateUtil.endOfTodayUTC().toDate()};
    expect(routingService.isEndDateChanged({endDate: dateUtil.endOfTodayUTC().toDate()})).toBeFalsy();
  });
});
