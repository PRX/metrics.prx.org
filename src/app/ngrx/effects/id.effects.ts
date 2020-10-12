import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, mergeMap, switchMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { AuthService, UserinfoService, Userinfo } from 'ngx-prx-styleguide';
import { Env } from '../../core/core.env';

import { User } from '../';
import * as ACTIONS from '../actions';

@Injectable()
export class IdEffects {
  loadUserinfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.IdUserinfoLoad),
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
                this.store.dispatch(ACTIONS.IdUserinfoFailure({ error: 'Permission denied' }));
              }
              return this.user.getUserinfo().pipe(
                mergeMap((userinfo: Userinfo) => {
                  return this.user.getUserDoc(userinfo).pipe(
                    map(doc => {
                      const user: User = { loggedIn, authorized, doc, userinfo };
                      return ACTIONS.IdUserinfoSuccess({ user });
                    })
                  );
                })
              );
            } else {
              return of(ACTIONS.IdUserinfoFailure({ error: 'You are not logged in' }));
            }
          }),
          catchError(error => of(ACTIONS.IdUserinfoFailure({ error })))
        );
      })
    )
  );

  constructor(private actions$: Actions, private store: Store<any>, private auth: AuthService, private user: UserinfoService) {
    this.user.config(Env.AUTH_HOST);
  }
}
