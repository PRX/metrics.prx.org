import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { hot, cold } from 'jasmine-marbles';

import { AuthService, MockHalDoc, HalService, MockHalService } from 'ngx-prx-styleguide';
import { CmsService } from '../../core';

import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { CmsEffects } from './cms.effects';

describe('CmsEffects', () => {
  let effects: CmsEffects;
  let actions$: Observable<any>;
  let cms: MockHalService;
  let auth: MockHalDoc;

  beforeEach(() => {
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
        AuthService,
        {provide: HalService, useValue: cms},
        CmsService,
        CmsEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.get(CmsEffects);
    spyOn(effects, 'routeWithEpisodeCharted').and.callThrough();
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
      expect(effects.loadAccount$).toBeObservable(cold('-r', {r: completion}));
    });

    it('fails to load the account', () => {
      const error = new Error('Whaaaa?');
      auth.mockError('prx:accounts', error);
      const action = new ACTIONS.CmsAccountAction();
      const completion = new ACTIONS.CmsAccountFailureAction({error});
      actions$ = hot('-a', {a: action});
      expect(effects.loadAccount$).toBeObservable(cold('-r', {r: completion}));
    });

    it('catches login errors', () => {
      const accounts = auth.mockItems('prx:accounts', []);
      const action = new ACTIONS.CmsAccountAction();
      const completion = new ACTIONS.CmsAccountFailureAction({error: 'You are not logged in'});
      actions$ = hot('-a', {a: action});
      expect(effects.loadAccount$).toBeObservable(cold('-r', {r: completion}));
    });

  });

  describe('loadPodcasts', () => {

    it('successfully loads podcasts', () => {
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
      expect(effects.loadPodcasts$).toBeObservable(cold('-r', {r: completion}));
    });

    it('fails to load podcasts', () => {
      const error = new Error('Whaaaa?');
      const series = auth.mockItems('prx:series', [{id: 111, title: 'Series #1'}]);
      series[0].mockError('prx:distributions', error);
      const action = new ACTIONS.CmsPodcastsAction();
      const completion = new ACTIONS.CmsPodcastsFailureAction({error});
      actions$ = hot('-a', {a: action});
      expect(effects.loadPodcasts$).toBeObservable(cold('-r', {r: completion}));
    });

    it('handles lack of podcasts', () => {
      const series = auth.mockItems('prx:series', []);
      const action = new ACTIONS.CmsPodcastsAction();
      const completion = new ACTIONS.CmsPodcastsFailureAction({error: `Looks like you don't have any podcasts.`});
      actions$ = hot('-a', {a: action});
      expect(effects.loadPodcasts$).toBeObservable(cold('-r', {r: completion}));
    });

  });

});
