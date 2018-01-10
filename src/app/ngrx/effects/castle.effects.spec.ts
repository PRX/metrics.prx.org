import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { getActions, TestActions } from './test.actions';

import { MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '../../core';

import { PodcastModel, FilterModel, EpisodeModel } from '../';
import { reducers } from '../../ngrx/reducers';
import { ActionTypes, CastlePodcastAllTimeMetricsLoadAction,
  CastlePodcastAllTimeMetricsSuccessAction, CastlePodcastAllTimeMetricsFailureAction,
  CastleEpisodeAllTimeMetricsSuccessAction } from '../actions';
import { CastleEffects } from './castle.effects';

describe('CastleEffects', () => {
  let effects: CastleEffects;
  let actions$: TestActions;
  let castle: MockHalService;

  const podcasts: PodcastModel[] = [{
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  }];
  const filter: FilterModel = {
    podcastSeriesId: 37800,
  };
  const episode: EpisodeModel = {
    id: 1,
    guid: 'abcde',
    seriesId: 37800,
    title: 'A Pet Talks Episode',
    publishedAt: new Date()
  }

  beforeEach(async(() => {
    castle = new MockHalService();
    const podcastDownloads = castle.root.mockList('prx:podcast', [{
      id: 37800,
      downloads: {
        total: 10
      }
    }]);
    const episodeDownloads = castle.root.mockList('prx:episode', [{
      guid: 'abcde',
      downloads: {
        total: 11
      }
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

    effects.podcasts = podcasts;
  }));

  it('should find the selected podcast from the payload filter', () => {
    const action = {
      type: ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD,
      payload: {
        filter: { podcastSeriesId: 37800 }
      }
    };
    const success = new CastlePodcastAllTimeMetricsSuccessAction({
      podcast: podcasts[0],
      allTimeDownloads: 10
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadAllTimePodcastMetrics).toBeObservable(expected);
  });

  it('should dispatch a failure action if no podcasts', () => {
    const action = {
      type: ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD,
      payload: {
        filter: { podcastSeriesId: 37801 }
      }
    };
    const failure = new CastlePodcastAllTimeMetricsFailureAction({
      error: 'No podcasts yet'
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: failure });
    expect(effects.loadAllTimePodcastMetrics).toBeObservable(expected);
  });

  it('should request episode all time metrics from castle', () => {
    const action = {
      type: ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_LOAD,
      payload: { episode }
    };
    const success = new CastleEpisodeAllTimeMetricsSuccessAction({
      episode: episode,
      allTimeDownloads: 11
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-r', { r: success });
    expect(effects.loadAllTimeEpisodeMetrics).toBeObservable(expected);
  });

});
