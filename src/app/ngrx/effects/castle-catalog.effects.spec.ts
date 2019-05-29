import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { getActions, TestActions } from './test.actions';

import { HalService, MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '../../core';

import { PODCAST_PAGE_SIZE, EPISODE_PAGE_SIZE, EPISODE_SELECT_PAGE_SIZE } from '..';
import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { CastleCatalogEffects } from './castle-catalog.effects';
import * as localStorageUtil from '@app/shared/util/local-storage.util';

import {
  userinfo,
  routerParams,
  podcast,
  episodes
} from '@testing/downloads.fixtures';

describe('CastleCatalogEffects', () => {
  let effects: CastleCatalogEffects;
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
    castle.root.mockItems('prx:podcasts', [podcast]);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...reducers }),
        EffectsModule.forRoot([CastleCatalogEffects])
      ],
      providers: [
        CastleCatalogEffects,
        { provide: HalService, useValue: castle },
        { provide: CastleService, useValue: castle.root },
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(CastleCatalogEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);

    store.dispatch(new ACTIONS.CustomRouterNavigationAction({ routerParams }));
  }));

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

  });
});
