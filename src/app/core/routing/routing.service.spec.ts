import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { filter, first } from 'rxjs/operators';
import { RoutingService } from './routing.service';
import { StoreModule, Store } from '@ngrx/store';
import { reducers } from '@app/ngrx/reducers';
import * as ACTIONS from '@app/ngrx/actions';
import {
  GroupType,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_GEOMETRO,
  GROUPTYPE_GEOSUBDIV,
  GROUPTYPE_AGENTOS,
  GROUPTYPE_AGENTNAME,
  GROUPTYPE_AGENTTYPE,
  INTERVAL_DAILY,
  INTERVAL_MONTHLY,
  MetricsType,
  METRICSTYPE_TRAFFICSOURCES,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_DROPDAY,
  CHARTTYPE_STACKED,
  CHARTTYPE_HORIZBAR,
  CHARTTYPE_PODCAST,
  CHARTTYPE_EPISODES,
  CHARTTYPE_LINE,
  CHARTTYPE_GEOCHART,
  EPISODE_PAGE_SIZE,
  METRICSTYPE_LISTENERS,
  INTERVAL_LASTWEEK,
  RouterParams,
  INTERVAL_LAST28DAYS
} from '@app/ngrx/';
import * as dateUtil from '@app/shared/util/date/date.util';
import * as localStorageUtil from '@app/shared/util/local-storage.util';
import { userinfo, routerParams, episodes, ep0Downloads, ep1Downloads } from '@testing/downloads.fixtures';

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
          { path: ':podcastId/dropday/:chartType/:interval', component: TestComponent },
          { path: ':podcastId/listeners/:chartType/:interval', component: TestComponent },
          { path: ':podcastId/demographics/:group/:chartType/:interval', component: TestComponent }
        ]),
        StoreModule.forRoot(reducers)
      ],
      providers: [RoutingService]
    })
      .compileComponents()
      .then(() => {
        routingService = TestBed.inject(RoutingService);
        store = TestBed.inject(Store);
        router = TestBed.inject(Router);

        store.dispatch(ACTIONS.IdUserinfoSuccess({ user: { doc: null, loggedIn: true, authorized: true, userinfo } }));
      });
  }));

  it('should redirect users away from / and back to existing or default route params', done => {
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams }));
    jest.spyOn(routingService, 'normalizeAndRoute');
    router.navigate([]);
    router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        first()
      )
      .subscribe((event: RoutesRecognized) => {
        expect(routingService.normalizeAndRoute).toHaveBeenCalledWith(routerParams);
        done();
      });
  });

  it('should load episodes if podcast or episodePage changes', () => {
    jest.spyOn(routingService, 'loadEpisodes');
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, episodePage: 2 } }));
    expect(routingService.loadEpisodes).toHaveBeenCalled();
  });

  it('should reload downloads(metrics) data if podcast or episodes has not changed but begin/end dates or interval changes', () => {
    jest.spyOn(routingService, 'loadEpisodes');
    jest.spyOn(routingService, 'loadDownloads');
    const beginDate = new Date();
    store.dispatch(
      ACTIONS.CastleEpisodePageSuccess({
        episodes: [
          {
            guid: episodes[1].guid,
            title: episodes[1].title,
            publishedAt: episodes[1].publishedAt,
            page: 2,
            podcastId: episodes[1].podcastId
          }
        ],
        page: 2,
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      })
    );
    store.dispatch(
      ACTIONS.CustomRouterNavigation({
        routerParams: {
          ...routerParams,
          podcastId: routerParams.podcastId,
          episodePage: 2
        }
      })
    );
    expect(routingService.loadEpisodes).toHaveBeenCalled();
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { beginDate } }));
    expect(routingService.loadDownloads).toHaveBeenCalled();
  });

  it('should reload episodes if metrics type changes to reach/downloads', () => {
    jest.spyOn(routingService, 'loadEpisodes');
    store.dispatch(
      ACTIONS.CustomRouterNavigation({
        routerParams: { ...routerParams, metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY }
      })
    );
    expect(routingService.loadEpisodes).not.toHaveBeenCalled();
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { metricsType: METRICSTYPE_DOWNLOADS } }));
    expect(routingService.loadEpisodes).toHaveBeenCalled();
  });

  it('should load episodes for dropday if podcast changed', () => {
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, metricsType: METRICSTYPE_DROPDAY, days: 28 } }));
    jest.spyOn(routingService, 'loadEpisodes');
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { podcastId: '72' } }));
    expect(routingService.loadEpisodes).toHaveBeenCalled();
  });

  it('should load episodes for dropday if there are no episodes selected', () => {
    jest.spyOn(routingService, 'loadEpisodes');
    expect(routingService.dropdayEpisodes && routingService.dropdayEpisodes.length).toBeFalsy();
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, metricsType: METRICSTYPE_DROPDAY, days: 28 } }));
    expect(routingService.loadEpisodes).toHaveBeenCalled();
  });

  it('should load dropday downloads and all time downloads', () => {
    jest.spyOn(routingService, 'loadDropdayEpisodeAllTimeDownloads');
    jest.spyOn(routingService, 'loadSelectedEpisodeDropdays');
    store.dispatch(
      ACTIONS.CastleEpisodeDropdaySuccess({
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
        title: episodes[0].title,
        publishedAt: episodes[0].publishedAt,
        interval: routerParams.interval,
        downloads: ep0Downloads
      })
    );
    store.dispatch(
      ACTIONS.CastleEpisodeDropdaySuccess({
        podcastId: episodes[1].podcastId,
        guid: episodes[1].guid,
        title: episodes[1].title,
        publishedAt: episodes[1].publishedAt,
        interval: routerParams.interval,
        downloads: ep1Downloads
      })
    );
    store.dispatch(
      ACTIONS.EpisodeSelectEpisodes({
        metricsType: METRICSTYPE_DROPDAY,
        podcastId: routerParams.podcastId,
        episodeGuids: episodes.map(e => e.guid)
      })
    );
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, metricsType: METRICSTYPE_DROPDAY, days: 28 } }));
    expect(routingService.loadDropdayEpisodeAllTimeDownloads).toHaveBeenCalled();
    expect(routingService.loadSelectedEpisodeDropdays).toHaveBeenCalled();
  });

  it('should load dropday downloads if days or interval changed', () => {
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, metricsType: METRICSTYPE_DROPDAY, days: 28 } }));
    store.dispatch(
      ACTIONS.CastleEpisodeDropdaySuccess({
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
        title: episodes[0].title,
        publishedAt: episodes[0].publishedAt,
        interval: routerParams.interval,
        downloads: ep0Downloads
      })
    );
    store.dispatch(
      ACTIONS.CastleEpisodeDropdaySuccess({
        podcastId: episodes[1].podcastId,
        guid: episodes[1].guid,
        title: episodes[1].title,
        publishedAt: episodes[1].publishedAt,
        interval: routerParams.interval,
        downloads: ep1Downloads
      })
    );
    store.dispatch(
      ACTIONS.EpisodeSelectEpisodes({
        metricsType: METRICSTYPE_DROPDAY,
        podcastId: routerParams.podcastId,
        episodeGuids: episodes.map(e => e.guid)
      })
    );
    jest.spyOn(routingService, 'loadSelectedEpisodeDropdays');
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { interval: INTERVAL_MONTHLY, days: 90 } }));
    expect(routingService.loadSelectedEpisodeDropdays).toHaveBeenCalled();
  });

  it('should reload listeners if router params change', () => {
    const listenersRouterParams: RouterParams = {
      ...routerParams,
      metricsType: METRICSTYPE_LISTENERS,
      chartType: CHARTTYPE_LINE,
      interval: INTERVAL_LASTWEEK
    };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: listenersRouterParams }));
    jest.spyOn(routingService, 'loadListeners');
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...listenersRouterParams, interval: INTERVAL_LAST28DAYS } }));
    expect(routingService.loadListeners).toHaveBeenCalled();
  });

  it('should not reload grouped (geo/agent) podcast totals if interval changes', () => {
    let newRouterParams = {
      ...routerParams,
      metricsType: <MetricsType>METRICSTYPE_DEMOGRAPHICS,
      group: <GroupType>GROUPTYPE_GEOCOUNTRY,
      filter: 'US'
    };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));

    jest.spyOn(routingService, 'loadPodcastTotals');

    newRouterParams = { ...newRouterParams, interval: INTERVAL_MONTHLY };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastTotals).not.toHaveBeenCalled();
  });

  it('should reload grouped (geo/agent) podcast ranks and totals if podcast, metrics type, group, or begin/end dates change', () => {
    let newRouterParams = routerParams;
    jest.spyOn(routingService, 'loadPodcastTotals');
    jest.spyOn(routingService, 'loadPodcastRanks');

    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastTotals).not.toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastRanks).not.toHaveBeenCalledWith(newRouterParams);

    newRouterParams = { ...newRouterParams, metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastTotals).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);

    newRouterParams = { ...newRouterParams, interval: INTERVAL_MONTHLY };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastTotals).not.toHaveBeenCalledWith(newRouterParams);

    newRouterParams = { ...newRouterParams, metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTOS };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastTotals).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);

    newRouterParams = { ...newRouterParams, podcastId: '75' };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastTotals).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);

    newRouterParams = {
      ...newRouterParams,
      beginDate: dateUtil.beginningOfLastYearUTC().toDate(),
      endDate: dateUtil.endOfLastYearUTC().toDate()
    };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastTotals).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);
  });

  it('should reload nested geo podcast ranks and totals if podcast, filter, or begin/end dates change', () => {
    let newRouterParams = routerParams;
    jest.spyOn(routingService, 'loadPodcastRanks');
    jest.spyOn(routingService, 'loadPodcastTotals');

    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastRanks).not.toHaveBeenCalledWith(newRouterParams);

    newRouterParams = { ...newRouterParams, metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, filter: 'US' };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastTotals).toHaveBeenCalledWith(newRouterParams);

    newRouterParams = { ...newRouterParams, podcastId: '85' };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastTotals).toHaveBeenCalledWith(newRouterParams);

    newRouterParams = { ...newRouterParams, interval: INTERVAL_MONTHLY };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastTotals).not.toHaveBeenCalledWith(newRouterParams);

    newRouterParams = {
      ...newRouterParams,
      beginDate: dateUtil.beginningOfLastYearUTC().toDate(),
      endDate: dateUtil.endOfLastYearUTC().toDate()
    };
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newRouterParams }));
    expect(routingService.loadPodcastRanks).toHaveBeenCalledWith(newRouterParams);
    expect(routingService.loadPodcastTotals).toHaveBeenCalledWith(newRouterParams);
  });

  it('should save routerState in localStorage', () => {
    localStorage.clear();
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams }));
    routingService.normalizeAndRoute(routerParams);
    expect(localStorageUtil.getItem(localStorageUtil.KEY_ROUTER_PARAMS).podcastId).toEqual(routerParams.podcastId);
  });

  it('should normalize router params and navigate using defaults if params not present', () => {
    const newParams = { podcastId: '82' };
    const { podcastId, metricsType, chartType, interval, beginDate, endDate, ...params } = routingService.checkAndGetDefaults(newParams);
    jest.spyOn(router, 'navigate');
    // other route params are not yet defined
    expect(routingService.routerParams).toBeUndefined();
    // update router params state via routing action using only the podcastId
    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: newParams }));
    // expect that we've routed to podcastId with other params as defaults
    expect(router.navigate).toHaveBeenCalledWith([
      podcastId,
      metricsType,
      chartType,
      interval.key,
      { ...params, beginDate: beginDate.toUTCString(), endDate: endDate.toUTCString() }
    ]);
  });

  it('should not include filter param for non geo routes', () => {
    jest.spyOn(router, 'navigate');

    const { podcastId, metricsType, chartType, group, interval, beginDate, endDate, ...params } = routingService.checkAndGetDefaults({
      podcastId: '82',
      metricsType: METRICSTYPE_DOWNLOADS
    });

    store.dispatch(
      ACTIONS.CustomRouterNavigation({
        routerParams: { podcastId, metricsType, chartType, group, interval, beginDate, endDate, ...params }
      })
    );
    expect(router.navigate).toHaveBeenCalledWith([
      podcastId,
      METRICSTYPE_DOWNLOADS,
      chartType,
      interval.key,
      {
        ...params,
        beginDate: beginDate.toUTCString(),
        endDate: endDate.toUTCString()
      }
    ]);
  });

  it('should switch to appropriate chart type for metrics type', () => {
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DOWNLOADS,
        chartType: CHARTTYPE_HORIZBAR
      }).chartType
    ).toEqual(CHARTTYPE_PODCAST);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DOWNLOADS,
        chartType: CHARTTYPE_LINE
      }).chartType
    ).toEqual(CHARTTYPE_EPISODES);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DOWNLOADS,
        chartType: CHARTTYPE_STACKED
      }).chartType
    ).toEqual(CHARTTYPE_STACKED);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DOWNLOADS,
        chartType: CHARTTYPE_GEOCHART
      }).chartType
    ).toEqual(CHARTTYPE_PODCAST);

    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DROPDAY,
        chartType: CHARTTYPE_PODCAST
      }).chartType
    ).toEqual(CHARTTYPE_EPISODES);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DROPDAY,
        chartType: CHARTTYPE_GEOCHART
      }).chartType
    ).toEqual(CHARTTYPE_EPISODES);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DROPDAY,
        chartType: CHARTTYPE_LINE
      }).chartType
    ).toEqual(CHARTTYPE_EPISODES);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DROPDAY,
        chartType: CHARTTYPE_STACKED
      }).chartType
    ).toEqual(CHARTTYPE_EPISODES);

    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_LISTENERS
      }).chartType
    ).toEqual(CHARTTYPE_LINE);

    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        chartType: CHARTTYPE_EPISODES
      }).chartType
    ).toEqual(CHARTTYPE_LINE);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        chartType: CHARTTYPE_PODCAST
      }).chartType
    ).toEqual(CHARTTYPE_HORIZBAR);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        chartType: CHARTTYPE_STACKED
      }).chartType
    ).toEqual(CHARTTYPE_STACKED);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        chartType: CHARTTYPE_GEOCHART
      }).chartType
    ).toEqual(CHARTTYPE_HORIZBAR);

    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        chartType: CHARTTYPE_PODCAST
      }).chartType
    ).toEqual(CHARTTYPE_GEOCHART);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        chartType: CHARTTYPE_EPISODES
      }).chartType
    ).toEqual(CHARTTYPE_LINE);
  });

  it('should switch to appropriate group type for metrics type', () => {
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_AGENTOS
      }).group
    ).toEqual(GROUPTYPE_GEOCOUNTRY);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_AGENTNAME
      }).group
    ).toEqual(GROUPTYPE_GEOCOUNTRY);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_AGENTTYPE
      }).group
    ).toEqual(GROUPTYPE_GEOCOUNTRY);

    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_GEOCOUNTRY
      }).group
    ).toEqual(GROUPTYPE_AGENTOS);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_GEOMETRO
      }).group
    ).toEqual(GROUPTYPE_AGENTOS);
    expect(
      routingService.checkAndGetDefaults({
        ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_GEOSUBDIV
      }).group
    ).toEqual(GROUPTYPE_AGENTOS);
  });

  it('should check if podcast changed', () => {
    routingService.routerParams = undefined;
    expect(routingService.isPodcastChanged({ podcastId: '123' })).toBeTruthy();
    expect(routingService.isPodcastChanged(undefined)).toBeFalsy();

    routingService.routerParams = {};
    expect(routingService.isPodcastChanged({ podcastId: '123' })).toBeTruthy();

    routingService.routerParams = { podcastId: '1234' };
    expect(routingService.isPodcastChanged({ podcastId: '123' })).toBeTruthy();
    expect(routingService.isPodcastChanged(undefined)).toBeFalsy();

    routingService.routerParams = { podcastId: '123' };
    expect(routingService.isPodcastChanged({ podcastId: '123' })).toBeFalsy();
  });

  it('should check if episodes changed', () => {
    routingService.routerParams = undefined;
    expect(routingService.isEpisodePageChanged({ episodePage: 1 })).toBeTruthy();
    routingService.routerParams = undefined;
    expect(routingService.isEpisodePageChanged(undefined)).toBeFalsy();

    routingService.routerParams = {};
    expect(routingService.isEpisodePageChanged({ episodePage: 1 })).toBeTruthy();

    routingService.routerParams = { episodePage: 2 };
    expect(routingService.isEpisodePageChanged({ episodePage: 1 })).toBeTruthy();

    routingService.routerParams = { episodePage: 1 };
    expect(routingService.isEpisodePageChanged(undefined)).toBeFalsy();
    expect(routingService.isEpisodePageChanged({ episodePage: 1 })).toBeFalsy();
  });

  it('should check if group changed', () => {
    routingService.routerParams = {};
    expect(routingService.isGroupChanged({ group: GROUPTYPE_AGENTOS })).toBeTruthy();
    expect(routingService.isGroupChanged({})).toBeFalsy();

    routingService.routerParams = { group: GROUPTYPE_GEOCOUNTRY };
    expect(routingService.isGroupChanged({ group: GROUPTYPE_GEOMETRO })).toBeTruthy();

    routingService.routerParams = { group: GROUPTYPE_AGENTNAME };
    expect(routingService.isGroupChanged({ group: GROUPTYPE_AGENTNAME })).toBeFalsy();

    routingService.routerParams = { group: GROUPTYPE_AGENTNAME };
    expect(routingService.isGroupChanged({ group: undefined })).toBeFalsy();
  });

  it('should check if filter changed', () => {
    routingService.routerParams = {};
    expect(routingService.isFilterChanged({ filter: 'US' })).toBeTruthy();
    expect(routingService.isFilterChanged({})).toBeFalsy();

    routingService.routerParams = { filter: 'US' };
    expect(routingService.isFilterChanged({ filter: 'GB' })).toBeTruthy();

    routingService.routerParams = {};
    expect(routingService.isFilterChanged({ filter: 'GB' })).toBeTruthy();

    routingService.routerParams = { filter: 'US' };
    expect(routingService.isFilterChanged({ filter: 'US' })).toBeFalsy();

    routingService.routerParams = { filter: 'US' };
    expect(routingService.isFilterChanged({ filter: undefined })).toBeFalsy();
  });

  it('should check if interval changed', () => {
    routingService.routerParams = {};
    expect(routingService.isIntervalChanged({ interval: INTERVAL_DAILY })).toBeTruthy();
    expect(routingService.isIntervalChanged({})).toBeFalsy();

    routingService.routerParams = { interval: INTERVAL_MONTHLY };
    expect(routingService.isIntervalChanged({ interval: INTERVAL_DAILY })).toBeTruthy();

    routingService.routerParams = { interval: INTERVAL_DAILY };
    expect(routingService.isIntervalChanged({ interval: INTERVAL_DAILY })).toBeFalsy();

    routingService.routerParams = { interval: INTERVAL_DAILY };
    expect(routingService.isIntervalChanged({ interval: undefined })).toBeFalsy();
  });

  it('should check if begin date changed', () => {
    routingService.routerParams = {};
    expect(routingService.isBeginDateChanged({ beginDate: dateUtil.beginningOfTodayUTC().toDate() })).toBeTruthy();
    expect(routingService.isBeginDateChanged({})).toBeFalsy();

    routingService.routerParams = { beginDate: dateUtil.beginningOfLastWeekUTC().toDate() };
    expect(routingService.isBeginDateChanged({ beginDate: dateUtil.beginningOfTodayUTC().toDate() })).toBeTruthy();

    routingService.routerParams = { beginDate: dateUtil.beginningOfTodayUTC().toDate() };
    expect(routingService.isBeginDateChanged({ beginDate: dateUtil.beginningOfTodayUTC().toDate() })).toBeFalsy();

    routingService.routerParams = { beginDate: dateUtil.beginningOfTodayUTC().toDate() };
    expect(routingService.isBeginDateChanged({ beginDate: undefined })).toBeFalsy();
  });

  it('should check if end date changed', () => {
    routingService.routerParams = {};
    expect(routingService.isEndDateChanged({ endDate: dateUtil.endOfTodayUTC().toDate() })).toBeTruthy();
    expect(routingService.isEndDateChanged({})).toBeFalsy();

    routingService.routerParams = { endDate: dateUtil.endOfLastWeekUTC().toDate() };
    expect(routingService.isEndDateChanged({ endDate: dateUtil.endOfTodayUTC().toDate() })).toBeTruthy();

    routingService.routerParams = { endDate: dateUtil.endOfTodayUTC().toDate() };
    expect(routingService.isEndDateChanged({ endDate: dateUtil.endOfTodayUTC().toDate() })).toBeFalsy();

    routingService.routerParams = { endDate: dateUtil.endOfTodayUTC().toDate() };
    expect(routingService.isEndDateChanged({ endDate: undefined })).toBeFalsy();
  });
});
