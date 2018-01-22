import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { hot, cold } from 'jasmine-marbles';
import { AuthService, MockHalDoc, HalService, MockHalService } from 'ngx-prx-styleguide';
import { CmsService } from '../../core';

import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { CmsEffects } from './cms.effects';
import {RouteEpisodesChartedAction} from "../actions/router.action.creator";

describe('CmsEffects', () => {
  const authToken = new ReplaySubject<string>(1);

  let effects: CmsEffects;
  let actions$: Observable<any>;
  let expect$: Observable<any>;
  let cms: MockHalService;
  let auth: MockHalDoc;
  let store: Store<any>;

  beforeEach(() => {
    authToken.next('some-auth-token');
    cms = new MockHalService();
    auth = cms.mock('prx:authorization', {});
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot(reducers)
      ],
      providers: [
        {provide: AuthService, useValue: {token: authToken}},
        {provide: HalService, useValue: cms},
        CmsService,
        CmsEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.get(CmsEffects);
    store = TestBed.get(Store);
    spyOn(effects, 'getEpisodeColor').and.returnValue('#fff');
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('loadAccount', () => {

    it('successfully loads the account', () => {
      const accounts = auth.mockItems('prx:accounts', [
        {name: 'TheAccountName', type: 'IndividualAccount', id: 111},
        {name: 'DefaultName', type: 'DefaultAccount', id: 222}
      ]);
      const account = {id: 111, name: 'TheAccountName', doc: accounts[0]};
      const action = new ACTIONS.CmsAccountAction();
      const completion = new ACTIONS.CmsAccountSuccessAction({account});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadAccount$).toBeObservable(expect$);
    });

    it('fails to load the account', () => {
      const error = new Error('Whaaaa?');
      auth.mockError('prx:accounts', error);
      const action = new ACTIONS.CmsAccountAction();
      const completion = new ACTIONS.CmsAccountFailureAction({error});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadAccount$).toBeObservable(expect$);
    });

    it('catches login errors', () => {
      const action = new ACTIONS.CmsAccountAction();
      const completion = new ACTIONS.CmsAccountFailureAction({error: 'You are not logged in'});
      authToken.next(null);
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadAccount$).toBeObservable(expect$);
    });

  });

  describe('loadPodcasts', () => {

    it('successfully loads podcasts and navigates to the first one', () => {
      const series = auth.mockItems('prx:series', [
        {id: 111, title: 'Series #1'},
        {id: 222, title: 'Series #2'},
        {id: 333, title: 'Series #3'}
      ]);
      series[0].mockItems('prx:distributions', [{kind: 'podcast', url: 'http://my/podcast/url1'}]);
      series[1].mockItems('prx:distributions', [{kind: 'foo', url: 'http://my/podcast/url2'}]);
      series[2].mockItems('prx:distributions', []);
      const podcasts = [{
        seriesId: 111,
        title: 'Series #1',
        feederUrl: 'http://my/podcast/url1',
        feederId: 'url1',
        doc: series[0]
      }];
      const action = new ACTIONS.CmsPodcastsAction();
      const completion = new ACTIONS.CmsPodcastsSuccessAction({podcasts});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadPodcasts$).toBeObservable(expect$);
      expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.RouteSeriesAction({podcastSeriesId: 111}));
    });

    it('fails to load podcasts', () => {
      const error = new Error('Whaaaa?');
      const series = auth.mockError('prx:series', error);
      const action = new ACTIONS.CmsPodcastsAction();
      const completion = new ACTIONS.CmsPodcastsFailureAction({error});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadPodcasts$).toBeObservable(expect$);
    });

    it('handles lack of podcasts', () => {
      const series = auth.mockItems('prx:series', []);
      const action = new ACTIONS.CmsPodcastsAction();
      const completion = new ACTIONS.CmsPodcastsFailureAction({error: `Looks like you don't have any podcasts.`});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadPodcasts$).toBeObservable(expect$);
    });

    it('catches login errors', () => {
      const action = new ACTIONS.CmsPodcastsAction();
      const completion = new ACTIONS.CmsPodcastsFailureAction({error: 'You are not logged in'});
      authToken.next(null);
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadPodcasts$).toBeObservable(expect$);
    });

  });

  describe('loadEpisodes', () => {

    const seriesId = 111;
    const s1 = {id: 121, publishedAt: new Date('2018-01-01'), title: 'A Pet Talk Episode'};
    const s2 = {id: 122, publishedAt: new Date('2018-01-02'), title: 'A More Recent Pet Talk Episode'};
    const s3 = {id: 123, publishedAt: new Date('2018-01-03'), title: 'A Most Recent Pet Talk Episode'};
    const s4 = {id: 124, publishedAt: new Date('2018-01-12'), title: 'Episode s4'};
    const s5 = {id: 125, publishedAt: new Date('2018-01-19'), title: 'Episode s5'};
    const s6 = {id: 126, publishedAt: new Date('2017-12-04'), title: 'Episode s6'};

    it('successfully loads a page of episodes', () => {
      const stories = cms.mock('prx:series', {}).mockItems('prx:stories', [s1, s2, s3, s4, s5, s6]);
      stories[0].mockItems('prx:distributions', [{kind: 'episode', url: 'http://my/episode/guid1'}]);
      stories[1].mockItems('prx:distributions', [{kind: 'episode', url: 'http://my/episode/guid2'}]);
      stories[2].mockItems('prx:distributions', [{kind: 'whatev', url: 'http://my/episode/guid3'}]);
      const episodes = [
        {...s1, doc: stories[0], feederUrl: 'http://my/episode/guid1', guid: 'guid1'},
        {...s2, doc: stories[1], feederUrl: 'http://my/episode/guid2', guid: 'guid2'},
      ].map(episode => {
        return {...episode, page: 1, seriesId: 111, color: '#fff'};
      });
      const action = new ACTIONS.CmsPodcastEpisodePageAction({seriesId, page: 1});
      const completion = new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadEpisodes$).toBeObservable(expect$);
    });

    it('fails to load a page of episodes', () => {
      const error = new Error('Whaaaa?');
      const stories = cms.mock('prx:series', {}).mockError('prx:stories', error);
      const action = new ACTIONS.CmsPodcastEpisodePageAction({seriesId, page: 1});
      const completion = new ACTIONS.CmsPodcastEpisodePageFailureAction({error});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.loadEpisodes$).toBeObservable(expect$);
    });

    it('updates the route to include the first five episodes', () => {
      const allStories = [s1, s2, s3, s4, s5, s6];
      const stories = cms.mock('prx:series', {}).mockItems('prx:stories', allStories);
      stories.forEach((story, index) => {
        story.mockItems('prx:distributions', [{kind: 'episode', url: `http://my/episode/guid${index}`}]);
      });
      const action = new ACTIONS.CmsPodcastEpisodePageAction({seriesId, page: 1});
      actions$ = hot('-a', {a: action});
      effects.loadEpisodes$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(new RouteEpisodesChartedAction({episodeIds: [121, 122, 123, 124, 125]}));
      });
    });

    it('does not change the route if some episodes are selected', () => {
      const allStories = [s1, s2, s3, s4, s5, s6];
      const stories = cms.mock('prx:series', {}).mockItems('prx:stories', allStories);
      stories.forEach((story, index) => {
        story.mockItems('prx:distributions', [{kind: 'episode', url: `http://my/episode/guid${index}`}]);
      });
      const action = new ACTIONS.CmsPodcastEpisodePageAction({seriesId, page: 1});
      effects.episodeMetrics = [{seriesId: 111, id: 124, charted: true}];
      actions$ = hot('-a', {a: action});
      effects.loadEpisodes$.subscribe(() => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

  });

});
