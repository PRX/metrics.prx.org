import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { getActions, TestActions } from './test.actions';

import { HalService, MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '../../core';

import { INTERVAL_DAILY, EPISODE_PAGE_SIZE, METRICSTYPE_DROPDAY } from '../';
import { reducers } from '../../ngrx/reducers';
import * as ACTIONS from '../actions';
import { CastleDownloadsEffects } from './castle-downloads.effects';

import {
  routerParams,
  podcast,
  episodes,
  podDownloads,
  ep0Downloads
} from '../../../testing/downloads.fixtures';
import * as dateUtil from '../../shared/util/date';

describe('CastleDownloadsEffects', () => {
  let effects: CastleDownloadsEffects;
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

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...reducers }),
        EffectsModule.forRoot([CastleDownloadsEffects])
      ],
      providers: [
        CastleDownloadsEffects,
        { provide: HalService, useValue: castle },
        { provide: CastleService, useValue: castle.root },
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(CastleDownloadsEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);

    store.dispatch(new ACTIONS.CustomRouterNavigationAction({ routerParams }));
  }));

  it('should request podcast all time downloads from castle', () => {
    const action: ACTIONS.CastlePodcastAllTimeDownloadsLoadAction = {
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
    const action: ACTIONS.CastlePodcastAllTimeDownloadsLoadAction = {
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
    const action: ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction = {
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
    const action: ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction = {
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
    const action: ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction = {
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

  it('should load podcast downloads', () => {
    const action: ACTIONS.CastlePodcastDownloadsLoadAction = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_DOWNLOADS_LOAD,
      payload: {
        id: podcast.id,
        interval: INTERVAL_DAILY,
        beginDate: new Date(),
        endDate: new Date()
      }
    };
    const success = new ACTIONS.CastlePodcastDownloadsSuccessAction({
      id: podcast.id,
      downloads: podDownloads
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadPodcastDownloads$).toBeObservable(expected);
  });

  it('should load episode downloads', () => {
    const action: ACTIONS.CastleEpisodeDownloadsLoadAction = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_DOWNLOADS_LOAD,
      payload: {
        podcastId: episodes[0].podcastId,
        page: episodes[0].page,
        guid: episodes[0].guid,
        interval: INTERVAL_DAILY,
        beginDate: new Date(),
        endDate: new Date()
      }
    };
    const success = new ACTIONS.CastleEpisodeDownloadsSuccessAction({
      podcastId: episodes[0].podcastId,
      page: episodes[0].page,
      guid: episodes[0].guid,
      downloads: ep0Downloads
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadEpisodeDownloads$).toBeObservable(expected);
  });

  it('should load episode dropday', () => {
    const action: ACTIONS.CastleEpisodeDropdayLoadAction = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_DROPDAY_LOAD,
      payload: {
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
        interval: INTERVAL_DAILY,
        publishedAt: new Date(),
        days: 28
      }
    };
    const success = new ACTIONS.CastleEpisodeDropdaySuccessAction({
      podcastId: episodes[0].podcastId,
      guid: episodes[0].guid,
      interval: INTERVAL_DAILY,
      publishedAt: new Date(),
      downloads: ep0Downloads
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadEpisodeDropday$).toBeObservable(expected);
  });

  describe('load routed metrics', () => {
    beforeEach(() => {
      castle.root.mock('prx:podcast', { id: podcast.id }).mockItems('prx:episodes',
        episodes.map(e => {
          return {
            ...e,
            id: e.guid
          };
        }));
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
        return new ACTIONS.CastleEpisodeDownloadsLoadAction({
          podcastId: e.podcastId,
          page: e.page,
          guid: e.guid,
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
      expect(effects.loadRoutedDownloads$).toBeObservable(expected);

      expect(store.dispatch).toHaveBeenCalledWith(
        new ACTIONS.CastlePodcastDownloadsLoadAction({
          id: episodes[0].podcastId,
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

    it('should load dropday downloads on episode page success', () => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({
        routerParams: {...routerParams, metricsType: METRICSTYPE_DROPDAY, days: 28}
      }));
      jest.spyOn(store, 'dispatch');
      const action = new ACTIONS.CastleEpisodePageSuccessAction({
        episodes,
        page: routerParams.episodePage,
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      });
      const episodeMetricsActions = episodes.map(e => {
        return new ACTIONS.CastleEpisodeDropdayLoadAction({
          podcastId: e.podcastId,
          guid: e.guid,
          interval: routerParams.interval,
          publishedAt: e.publishedAt,
          days: 28
        });
      });
      const completionString = new Array(1 + (episodes.length * 2)).fill('').map((e, i) => `-${i}`).join('');
      const completion = {};
      // create an object with indices (toString) as keys to each action for marble mapping
      [
        new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: episodes.map(e => e.guid)}),
        ...episodes.map(e => {
          return new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
            podcastId: e.podcastId,
            guid: e.guid
          });
        }),
        ...episodes.map(e => {
          return new ACTIONS.CastleEpisodeDropdayLoadAction({
            podcastId: e.podcastId,
            guid: e.guid,
            interval: routerParams.interval,
            publishedAt: e.publishedAt,
            days: 28
          });
        })
      ].forEach((a, i) => {
        completion[i.toString()] = a;
      });

      actions$.stream = hot('-a--', { a: action });
      // Marble syntax: '()' to sync groupings
      // When multiple events need to be in the same frame synchronously, parentheses are used to group those events.
      // eg '-(-0-1)' events '0' and '1' will both be in frame 10
      const expected = cold(`-(${completionString})`, completion);
      expect(effects.loadRoutedDropday$).toBeObservable(expected);
    });

  });
});
