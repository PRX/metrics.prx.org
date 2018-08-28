import { TestBed } from '@angular/core/testing';
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

describe('CmsEffects', () => {
  const authToken = new ReplaySubject<string>(1);

  let effects: CmsEffects;
  let actions$: Observable<any>;
  let expect$: Observable<any>;
  let cms: MockHalService;
  let auth: MockHalDoc;
  let store: Store<any>;
  let tokenIsValid: Boolean;

  beforeEach(() => {
    authToken.next('some-auth-token');
    cms = new MockHalService();
    auth = cms.mock('prx:authorization', {});
    tokenIsValid = true;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ],
      providers: [
        {provide: AuthService, useValue: {
             token: authToken,
             parseToken: () => tokenIsValid
           }
        },
        {provide: HalService, useValue: cms},
        CmsService,
        CmsEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.get(CmsEffects);
    store = TestBed.get(Store);
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

    it('reloads the account to retry failed actions', () => {
      spyOn(store, 'dispatch').and.callThrough();
      const accounts = auth.mockItems('prx:accounts', [
        {name: 'TheAccountName', type: 'IndividualAccount', id: 111},
        {name: 'DefaultName', type: 'DefaultAccount', id: 222}
      ]);
      const retryActions = [new ACTIONS.CastlePodcastPageLoadAction({page: 1, all: true})];
      const action = new ACTIONS.CmsAccountRetryActionsAction({actions: retryActions});
      const account = {id: 111, name: 'TheAccountName', doc: accounts[0]};
      const completion = new ACTIONS.CmsAccountSuccessAction({account});
      actions$ = hot('-a', {a: action});
      expect$ = cold('-r', {r: completion});
      expect(effects.retryActions$).toBeObservable(expect$);
      expect(store.dispatch).toHaveBeenCalledWith(retryActions[0]);
    });

  });

});
