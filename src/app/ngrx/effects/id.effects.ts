import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { first } from 'rxjs/operators/first';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AuthService, UserinfoService, Userinfo } from 'ngx-prx-styleguide';
import { Env } from '../../core/core.env';

import { User } from '../';
import * as ACTIONS from '../actions';

@Injectable()
export class IdEffects {

  @Effect()
  loadUserinfo$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.ID_USERINFO_LOAD),
    switchMap(() => {
      return this.auth.token.pipe(
        first(),
        mergeMap(token => {
          if (token) {
            const loggedIn = true;
            let authorized = true;
            if (!this.auth.parseToken(token)) {
              // permission denied is both failure and success. user is logged in but not authorized.
              authorized = false;
              this.store.dispatch(new ACTIONS.IdUserinfoFailureAction({error: 'Permission denied'}));
            }
            return this.user.getUserinfo().mergeMap((userinfo: Userinfo) => {
              return this.user.getUserDoc(userinfo).map(doc => {
                const user: User = {loggedIn, authorized, doc, userinfo};
                return new ACTIONS.IdUserinfoSuccessAction({user});
              });
            });
          } else {
            return of(new ACTIONS.IdUserinfoFailureAction({error: 'You are not logged in'}));
          }
        }),
        catchError(error => of(new ACTIONS.IdUserinfoFailureAction({error})))
      );
    })
  );

  constructor(private actions$: Actions,
              private store: Store<any>,
              private auth: AuthService,
              private user: UserinfoService) {
    this.user.config(Env.AUTH_HOST);
  }
}
