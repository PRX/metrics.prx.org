import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { getActions, TestActions } from './test.actions';

import { HalService, MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '../../core';

import {
  MetricsType, getMetricsProperty,
  METRICSTYPE_DOWNLOADS, INTERVAL_DAILY, PODCAST_PAGE_SIZE,
  GROUPTYPE_AGENTNAME, EPISODE_PAGE_SIZE, EPISODE_SELECT_PAGE_SIZE
} from '../';
import { reducers } from '../../ngrx/reducers';
import * as ACTIONS from '../actions';
import { CastleEffects } from './castle.effects';
import * as localStorageUtil from '../../shared/util/local-storage.util';

import {
  userinfo,
  routerParams,
  podcast,
  episodes,
  podDownloads,
  ep0Downloads,
  podcastAgentNameRanks,
  podcastAgentNameDownloads,
  ep0AgentNameRanks,
  ep0AgentNameDownloads
} from '../../../testing/downloads.fixtures';

describe('CastleEffects', () => {
  let effects: CastleEffects;
  let actions$: TestActions;
  let castle: MockHalService;
  let store: Store<any>;

  beforeEach(async(() => {
    castle = new MockHalService();
    castle.root.mockList('prx:podcast', [{
      id: podcast.id,
      downloads: {
        total: 10,
        this7days: 5,
        previous7days: 6,
        today: 1,
        yesterday: 1
      }
    }]);
    castle.root.mockList('prx:episode', [{
      guid: episodes[0].guid,
      downloads: {
        total: 11,
        this7days: 5,
        previous7days: 6,
        today: 1,
        yesterday: 1
      }
    }]);
    castle.root.mockList('prx:podcast-downloads', [{
      id: podcast.id,
      downloads: podDownloads
    }]);
    castle.root.mockList('prx:episode-downloads', [{
      guid: episodes[0].guid,
      downloads: ep0Downloads
    }]);
    castle.root.mockItems('prx:podcasts', [podcast]);
    castle.root.mock('prx:podcast-ranks', {
      downloads: podcastAgentNameDownloads,
      ranks: podcastAgentNameRanks
    });
    castle.root.mock('prx:podcast-totals', {
      ranks: podcastAgentNameRanks.map(rank => {
        const { total, label, code } = rank;
        return { count: total, label, code };
      })
    });
    castle.root.mockList('prx:episode-ranks', [{
      downloads: ep0AgentNameDownloads,
      ranks: ep0AgentNameRanks
    }]);
    castle.root.mockList('prx:episode-totals', [{
      ranks: ep0AgentNameRanks.map(rank => {
        const { total, label, code } = rank;
        return { count: total, label, code };
      })
    }]);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...reducers }),
        EffectsModule.forRoot([CastleEffects])
      ],
      providers: [
        CastleEffects,
        { provide: HalService, useValue: castle },
        { provide: CastleService, useValue: castle.root },
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(CastleEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);

    store.dispatch(new ACTIONS.CustomRouterNavigationAction({ routerParams }));
  }));

  it('should request podcast all time downloads from castle', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_LOAD,
      payload: {
        id: podcast.id
      }
    };
    const success = new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({
      id: podcast.id,
      total: 10
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadPodcastAllTimeDownloads$).toBeObservable(expected);
  });

  it('should return a failure action on non 404 errors for all time podcast downloads', () => {
    const error: any = { status: 500, message: 'this is an error' };
    castle.root.mockError('prx:podcast', error);
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_LOAD,
      payload: {
        id: podcast.id
      }
    };
    const failure = new ACTIONS.CastlePodcastAllTimeDownloadsFailureAction({
      id: podcast.id,
      error
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: failure });
    expect(effects.loadPodcastAllTimeDownloads$).toBeObservable(expected);
  });

  it('should request episode all time downloads from castle', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD,
      payload: { podcastId: episodes[0].podcastId, guid: episodes[0].guid }
    };
    const success = new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({
      podcastId: episodes[0].podcastId,
      guid: episodes[0].guid,
      total: 11
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadEpisodeAllTimeDownloads$).toBeObservable(expected);
  });

  it('should return 0 downloads on 404s for all time episode downloads', () => {
    castle.root.mockError('prx:episode', <any>{ status: 404, message: 'this is an error' });
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD,
      payload: {
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
      }
    };
    const success = new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({
      podcastId: episodes[0].podcastId,
      guid: episodes[0].guid,
      total: 0
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadEpisodeAllTimeDownloads$).toBeObservable(expected);
  });

  it('should return a failure action on non 404 errors for all time episode downloads', () => {
    const error: any = { status: 500, message: 'this is an error' };
    castle.root.mockError('prx:episode', error);
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD,
      payload: {
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
      }
    };
    const failure = new ACTIONS.CastleEpisodeAllTimeDownloadsFailureAction({
      podcastId: episodes[0].podcastId,
      guid: episodes[0].guid,
      error
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: failure });
    expect(effects.loadEpisodeAllTimeDownloads$).toBeObservable(expected);
  });

  it('should load podcast metrics', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_DOWNLOADS_LOAD,
      payload: {
        id: podcast.id,
        metricsType: METRICSTYPE_DOWNLOADS,
        interval: INTERVAL_DAILY,
        beginDate: new Date(),
        endDate: new Date()
      }
    };
    const success = new ACTIONS.CastlePodcastDownloadsSuccessAction({
      id: podcast.id,
      metricsPropertyName: getMetricsProperty(INTERVAL_DAILY, <MetricsType>METRICSTYPE_DOWNLOADS),
      metrics: podDownloads
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadPodcastDownloads$).toBeObservable(expected);
  });

  it('should load episode metrics', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD,
      payload: {
        podcastId: episodes[0].podcastId,
        page: episodes[0].page,
        guid: episodes[0].guid,
        metricsType: METRICSTYPE_DOWNLOADS,
        interval: INTERVAL_DAILY,
        beginDate: new Date(),
        endDate: new Date()
      }
    };
    const success = new ACTIONS.CastleEpisodeMetricsSuccessAction({
      podcastId: episodes[0].podcastId,
      page: episodes[0].page,
      guid: episodes[0].guid,
      metricsPropertyName: getMetricsProperty(INTERVAL_DAILY, <MetricsType>METRICSTYPE_DOWNLOADS),
      metrics: ep0Downloads
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadEpisodeMetrics$).toBeObservable(expected);
  });

  it('should load podcasts on account success', () => {
    const action = new ACTIONS.IdUserinfoSuccessAction({
      user: {
        doc: null,
        loggedIn: true,
        authorized: true,
        userinfo
      }
    });
    const success = new ACTIONS.CastlePodcastPageLoadAction({
      page: 1,
      all: true
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadUserinfoSuccess$).toBeObservable(expected);
  });

  it('should load page 1 of podcasts', () => {
    const action = new ACTIONS.CastlePodcastPageLoadAction({
      page: 1,
      all: true
    });
    const success = new ACTIONS.CastlePodcastPageSuccessAction({
      podcasts: [podcast],
      page: 1,
      total: 1,
      all: true
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadPodcastPage$).toBeObservable(expected);
  });

  it('should load next page of podcasts', () => {
    const pageOfPodcasts = new Array(PODCAST_PAGE_SIZE).fill(podcast);
    const firstPageAction = new ACTIONS.CastlePodcastPageSuccessAction({
      podcasts: pageOfPodcasts,
      page: 1,
      total: pageOfPodcasts.length * 2,
      all: true
    });
    const nextPageLoadAction = new ACTIONS.CastlePodcastPageLoadAction({
      page: 2,
      all: true
    });
    actions$.stream = hot('-a', { a: firstPageAction });
    const expected = cold('-r', { r: nextPageLoadAction });
    expect(effects.loadNextPodcastPage$).toBeObservable(expected);
  });

  it('should handle lack of podcasts', () => {
    castle.root.mockItems('prx:podcasts', []);
    const action = new ACTIONS.CastlePodcastPageLoadAction({ page: 1 });
    const completion = new ACTIONS.CastlePodcastPageFailureAction({ error: `Looks like you don't have any podcasts.` });
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: completion });
    expect(effects.loadPodcastPage$).toBeObservable(expected);
  });

  it('should produce failure action if fails to load podcasts', () => {
    const error = new Error('Whaaaa?');
    castle.root.mockError('prx:podcasts', error);
    const action = new ACTIONS.CastlePodcastPageLoadAction({ page: 1 });
    const completion = new ACTIONS.CastlePodcastPageFailureAction({ error });
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: completion });
    expect(effects.loadPodcastPage$).toBeObservable(expected);
  });

  describe('loadPodcastsSuccess$ on podcast load navigation', () => {
    beforeEach(() => {
      effects.routerParams.podcastId = undefined;
      localStorage.clear();
    });

    it('if none in local storage, navigates to the first podcast in the payload on success', () => {
      const action = new ACTIONS.CastlePodcastPageSuccessAction({ podcasts: [podcast], page: 1, total: 1 });
      const completion = new ACTIONS.RoutePodcastAction({ podcastId: podcast.id });
      actions$.stream = hot('-a', { a: action });
      const expected = cold('-r', { r: completion });
      expect(effects.loadPodcastsSuccess$).toBeObservable(expected);
    });

    it('navigates to the podcastId saved in localStorage', () => {
      localStorageUtil.setItem(localStorageUtil.KEY_ROUTER_PARAMS, routerParams);
      const somePodcasts = [
        {
          id: 'url1',
          title: 'Series #1'
        },
        podcast
      ];
      const action = new ACTIONS.CastlePodcastPageSuccessAction({ podcasts: somePodcasts, page: 1, total: somePodcasts.length });
      const completion = new ACTIONS.RoutePodcastAction({
        podcastId: routerParams.podcastId
      });
      actions$.stream = hot('-a', { a: action });
      const expected = cold('-r', { r: completion });
      expect(effects.loadPodcastsSuccess$).toBeObservable(expected);
    });

    it('navigates to the first podcast in the payload, if localStorage podcast is not in user\'s podcasts', () => {
      localStorageUtil.setItem(localStorageUtil.KEY_ROUTER_PARAMS, routerParams);
      const somePodcasts = [
        {
          id: 'url1',
          title: 'Series #1'
        }
      ];
      const action = new ACTIONS.CastlePodcastPageSuccessAction({ podcasts: somePodcasts, page: 1, total: somePodcasts.length });
      const completion = new ACTIONS.RoutePodcastAction({
        podcastId: somePodcasts[0].id
      });
      actions$.stream = hot('-a', { a: action });
      const expected = cold('-r', { r: completion });
      expect(effects.loadPodcastsSuccess$).toBeObservable(expected);
    });

  });

  describe('load episodes', () => {
    beforeEach(() => {
      castle.root.mock('prx:podcast', { id: podcast.id }).mockItems('prx:episodes',
        episodes.map(e => {
          return {
            ...e,
            id: e.guid
          };
        }));
    });

    it('should load first page of episodes', () => {
      const action = new ACTIONS.CastleEpisodePageLoadAction({
        podcastId: episodes[0].podcastId,
        page: 1,
        per: EPISODE_PAGE_SIZE
      });
      const success = new ACTIONS.CastleEpisodePageSuccessAction({
        episodes,
        page: 1,
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      });
      actions$.stream = hot('-a', { a: action });
      const expected = cold('-r', { r: success });
      expect(effects.loadEpisodePage$).toBeObservable(expected);
    });

    it('should load first page of episodes for episode selection', () => {
      const action = new ACTIONS.CastleEpisodeSelectPageLoadAction({
        podcastId: episodes[0].podcastId,
        page: 1,
        per: EPISODE_SELECT_PAGE_SIZE,
        search: 'title'
      });
      const success = new ACTIONS.CastleEpisodeSelectPageSuccessAction({
        episodes,
        page: 1,
        per: EPISODE_SELECT_PAGE_SIZE,
        total: episodes.length,
        search: 'title'
      });
      actions$.stream = hot('-a', { a: action });
      const expected = cold('-r', { r: success });
      expect(effects.loadEpisodePage$).toBeObservable(expected);
    });

    describe('error loading episodes', () => {
      const error = new Error('Whaaaa?');
      beforeEach(() => {
        castle.root.mock('prx:podcast', { id: podcast.id }).mockError('prx:episodes', error);
      });
      it('fails to load a page of episodes', () => {
        const action = new ACTIONS.CastleEpisodePageLoadAction({ podcastId: podcast.id, page: 1, per: EPISODE_PAGE_SIZE });
        const completion = new ACTIONS.CastleEpisodePageFailureAction({ error });
        actions$.stream = hot('-a', { a: action });
        const expected = cold('-r', { r: completion });
        expect(effects.loadEpisodePage$).toBeObservable(expected);
      });
      it('fails to load a page of episodes for episode selection', () => {
        const action = new ACTIONS.CastleEpisodeSelectPageLoadAction({ podcastId: podcast.id, page: 1, per: EPISODE_SELECT_PAGE_SIZE });
        const completion = new ACTIONS.CastleEpisodeSelectPageFailureAction({ error });
        actions$.stream = hot('-a', { a: action });
        const expected = cold('-r', { r: completion });
        expect(effects.loadEpisodePage$).toBeObservable(expected);
      });
    });

    it('should load downloads on episode page success', () => {
      jest.spyOn(store, 'dispatch');
      const action = new ACTIONS.CastleEpisodePageSuccessAction({
        episodes,
        page: routerParams.episodePage,
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      });
      const episodeMetricsActions = episodes.map(e => {
        return new ACTIONS.CastleEpisodeMetricsLoadAction({
          podcastId: e.podcastId,
          page: e.page,
          guid: e.guid,
          metricsType: routerParams.metricsType,
          interval: routerParams.interval,
          beginDate: routerParams.beginDate,
          endDate: routerParams.endDate
        });
      });
      const completionString = episodes.map((e, i) => `-${i}`);
      const completion = {};
      // create an object with indices (toString) as keys to each action for marble mapping
      episodeMetricsActions.forEach((a, i) => {
        completion[i.toString()] = a;
      });

      actions$.stream = hot('-a--', { a: action });
      // Marble syntax: '()' to sync groupings
      // When multiple events need to be in the same frame synchronously, parentheses are used to group those events.
      // eg '-(-0-1)' events '0' and '1' will both be in frame 10
      const expected = cold(`-(${completionString.join('')})`, completion);
      expect(effects.loadRoutedMetrics$).toBeObservable(expected);

      expect(store.dispatch).toHaveBeenCalledWith(
        new ACTIONS.CastlePodcastDownloadsLoadAction({
          id: episodes[0].podcastId,
          metricsType: routerParams.metricsType,
          interval: routerParams.interval,
          beginDate: routerParams.beginDate,
          endDate: routerParams.endDate
        }));
      expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.CastlePodcastAllTimeDownloadsLoadAction({ id: episodes[0].podcastId }));
      episodes.forEach(e => {
        expect(store.dispatch).toHaveBeenCalledWith(
          new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({ podcastId: e.podcastId, guid: e.guid })
        );
      });
    });

  });

  it('should load more than one grouped podcast ranks at a time', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_RANKS_LOAD,
      payload: {
        id: podcast.id,
        group: GROUPTYPE_AGENTNAME,
        interval: INTERVAL_DAILY,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate,
      }
    };
    const success = new ACTIONS.CastlePodcastRanksSuccessAction({
      id: podcast.id,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks,
      downloads: podcastAgentNameDownloads
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadPodcastRanks$).toBeObservable(expected);
  });

  it('should load more than one grouped podcast totals at a time', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_TOTALS_LOAD,
      payload: {
        id: podcast.id,
        group: GROUPTYPE_AGENTNAME,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate
      }
    };
    const success = new ACTIONS.CastlePodcastTotalsSuccessAction({
      id: podcast.id,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks.map(rank => {
        const { label, total, code } = rank;
        return { label, total, code };
      })
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadPodcastTotals$).toBeObservable(expected);
  });

  it('should load more than one grouped episode ranks at a time', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_RANKS_LOAD,
      payload: {
        guid: episodes[0].guid,
        group: GROUPTYPE_AGENTNAME,
        interval: INTERVAL_DAILY,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate,
      }
    };
    const success = new ACTIONS.CastleEpisodeRanksSuccessAction({
      guid: episodes[0].guid,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: ep0AgentNameRanks,
      downloads: ep0AgentNameDownloads
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadEpisodeRanks$).toBeObservable(expected);
  });

  it('should load more than one grouped episode totals at a time', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_TOTALS_LOAD,
      payload: {
        guid: episodes[0].guid,
        group: GROUPTYPE_AGENTNAME,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate
      }
    };
    const success = new ACTIONS.CastleEpisodeTotalsSuccessAction({
      guid: episodes[0].guid,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: ep0AgentNameRanks.map(rank => {
        const { label, total, code } = rank;
        return { label, total, code };
      })
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadEpisodeTotals$).toBeObservable(expected);
  });
});
