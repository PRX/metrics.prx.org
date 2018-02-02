import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { getActions, TestActions } from './test.actions';

import { MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '../../core';

import { PodcastModel, RouterModel, EpisodeModel, MetricsType,
  METRICSTYPE_DOWNLOADS, INTERVAL_DAILY, getMetricsProperty } from '../';
import { reducers } from '../../ngrx/reducers';
import * as ACTIONS from '../actions';
import { CastleEffects } from './castle.effects';

describe('CastleEffects', () => {
  let effects: CastleEffects;
  let actions$: TestActions;
  let castle: MockHalService;
  let store: Store<any>;

  const podcasts: PodcastModel[] = [{
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  }];
  const routerState: RouterModel = {
    podcastSeriesId: 37800,
  };
  const episode: EpisodeModel = {
    id: 1,
    page: 1,
    guid: 'abcde',
    seriesId: 37800,
    title: 'A Pet Talks Episode',
    publishedAt: new Date()
  };
  const downloads = [
    ['2017-08-27T00:00:00Z', 52522],
    ['2017-08-28T00:00:00Z', 162900],
    ['2017-08-29T00:00:00Z', 46858],
    ['2017-08-30T00:00:00Z', 52522],
    ['2017-08-31T00:00:00Z', 162900],
    ['2017-09-01T00:00:00Z', 46858],
    ['2017-09-02T00:00:00Z', 52522],
    ['2017-09-03T00:00:00Z', 162900],
    ['2017-09-04T00:00:00Z', 46858],
    ['2017-09-05T00:00:00Z', 52522],
    ['2017-09-06T00:00:00Z', 162900],
    ['2017-09-07T00:00:00Z', 46858]
  ];

  beforeEach(async(() => {
    castle = new MockHalService();
    const podcastAllTimeDownloads = castle.root.mockList('prx:podcast', [{
      id: +podcasts[0].feederId,
      downloads: {
        total: 10
      }
    }]);
    const episodeAllTimeDownloads = castle.root.mockList('prx:episode', [{
      guid: episode.guid,
      downloads: {
        total: 11
      }
    }]);
    const podcastDownloads = castle.root.mockList('prx:podcast-downloads', [{
      id: +podcasts[0].feederId,
      downloads
    }]);
    const episodeDownloads = castle.root.mockList('prx:episode-downloads', [{
      guid: episode.guid,
      downloads
    }]);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({...reducers}),
        EffectsModule.forRoot([CastleEffects]),
      ],
      providers: [
        CastleEffects,
        { provide: CastleService, useValue: castle.root },
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(CastleEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);

    store.dispatch(new ACTIONS.CmsPodcastsSuccessAction({podcasts}));
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState}));
  }));

  it('should find the selected podcast from the payload routerState', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD,
      payload: {
        filter: { podcastSeriesId: 37800 }
      }
    };
    const success = new ACTIONS.CastlePodcastAllTimeMetricsSuccessAction({
      podcast: podcasts[0],
      allTimeDownloads: 10
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadAllTimePodcastMetrics$).toBeObservable(expected);
  });

  it('should dispatch a failure action if no selected podcast', () => {
    const newRouterState: RouterModel = {
      podcastSeriesId: 37801
    };
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState: newRouterState}));
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD
    };
    const failure = new ACTIONS.CastlePodcastAllTimeMetricsFailureAction({
      podcast: undefined,
      error: 'No selected podcast yet'
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: failure });
    expect(effects.loadAllTimePodcastMetrics$).toBeObservable(expected);
  });

  it('should request episode all time metrics from castle', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_LOAD,
      payload: { episode }
    };
    const success = new ACTIONS.CastleEpisodeAllTimeMetricsSuccessAction({
      episode: episode,
      allTimeDownloads: 11
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadAllTimeEpisodeMetrics$).toBeObservable(expected);
  });

  it('should return 0 on 404s for all time episode metrics', () => {
    castle.root.mockError('prx:episode', <any> {status: 404, message: 'this is an error'});
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_LOAD,
      payload: { episode }
    };
    const success = new ACTIONS.CastleEpisodeAllTimeMetricsSuccessAction({
      episode: episode,
      allTimeDownloads: 0
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadAllTimeEpisodeMetrics$).toBeObservable(expected);
  });

  it('should load podcast metrics', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_LOAD,
      payload: {
        seriesId: podcasts[0].seriesId,
        feederId: podcasts[0].feederId,
        metricsType: METRICSTYPE_DOWNLOADS,
        interval: INTERVAL_DAILY,
        beginDate: new Date(),
        endDate: new Date()
      }
    };
    const success = new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: podcasts[0].seriesId,
      feederId: podcasts[0].feederId,
      metricsPropertyName: getMetricsProperty(INTERVAL_DAILY, <MetricsType>METRICSTYPE_DOWNLOADS),
      metrics: downloads
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadPodcastMetrics$).toBeObservable(expected);
  });

  it('should load episode metrics', () => {
    const action = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD,
      payload: {
        seriesId: podcasts[0].seriesId,
        page: episode.page,
        id: episode.id,
        guid: episode.guid,
        metricsType: METRICSTYPE_DOWNLOADS,
        interval: INTERVAL_DAILY,
        beginDate: new Date(),
        endDate: new Date()
      }
    };
    const success = new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: podcasts[0].seriesId,
      page: episode.page,
      id: episode.id,
      guid: episode.guid,
      metricsPropertyName: getMetricsProperty(INTERVAL_DAILY, <MetricsType>METRICSTYPE_DOWNLOADS),
      metrics: downloads
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadEpisodeMetrics$).toBeObservable(expected);
  });
});
