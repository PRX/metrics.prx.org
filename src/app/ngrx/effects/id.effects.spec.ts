import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';

import { hot, cold } from 'jasmine-marbles';
import { AuthService, MockHalDoc, HalService, MockHalService, UserinfoService } from 'ngx-prx-styleguide';

import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { IdEffects } from './id.effects';
import { User } from '../reducers/models';

import { userinfo } from '../../../testing/downloads.fixtures';

describe('IdEffects', () => {
  const authToken = new ReplaySubject<string>(1);

  let effects: IdEffects;
  let actions$: Observable<any>;
  let expect$: Observable<any>;
  const id: MockHalService = new MockHalService();
  const userDoc: MockHalDoc = id.mock('userinfo', userinfo);
  const user: User = { doc: userDoc, loggedIn: true, authorized: true, userinfo };
  let store: Store<any>;
  let tokenIsValid: Boolean;

  beforeEach(() => {
    authToken.next('some-auth-token');
    tokenIsValid = true;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        {
          provide: UserinfoService,
          useValue: {
            config: () => {},
            getUserinfo: () => of(userinfo),
            getUserDoc: () => of(userDoc)
          }
        },
        {
          provide: AuthService,
          useValue: {
            token: authToken,
            parseToken: () => tokenIsValid
          }
        },
        { provide: HalService, useValue: id },
        IdEffects,
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.get(IdEffects);
    store = TestBed.get(Store);
  });

  describe('loadUserinfo', () => {
    it('successfully loads the userinfo', () => {
      const action = ACTIONS.IdUserinfoLoad();
      const completion = ACTIONS.IdUserinfoSuccess({ user });
      actions$ = hot('-a', { a: action });
      expect$ = cold('-r', { r: completion });
      expect(effects.loadUserinfo$).toBeObservable(expect$);
    });

    it('catches permission denied', () => {
      jest.spyOn(store, 'dispatch');
      const action = ACTIONS.IdUserinfoLoad();
      const completion = ACTIONS.IdUserinfoSuccess({ user: { ...user, authorized: false } });
      tokenIsValid = false;
      authToken.next('AUTHORIZATION_DENIED');
      actions$ = hot('-a', { a: action });
      expect$ = cold('-r', { r: completion });
      expect(effects.loadUserinfo$).toBeObservable(expect$);
      expect(store.dispatch).toHaveBeenCalledWith(ACTIONS.IdUserinfoFailure({ error: 'Permission denied' }));
    });

    it('catches login errors', () => {
      const action = ACTIONS.IdUserinfoLoad();
      const completion = ACTIONS.IdUserinfoFailure({ error: 'You are not logged in' });
      authToken.next(null);
      actions$ = hot('-a', { a: action });
      expect$ = cold('-r', { r: completion });
      expect(effects.loadUserinfo$).toBeObservable(expect$);
    });
  });
});
