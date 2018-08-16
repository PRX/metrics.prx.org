import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { first } from 'rxjs/operators/first';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AuthService } from 'ngx-prx-styleguide';
import { CmsService } from '../../core';

import { AccountModel } from '../';
import * as ACTIONS from '../actions';

@Injectable()
export class CmsEffects {

  @Effect()
  loadAccount$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CMS_ACCOUNT),
    switchMap(() => {
      return this.auth.token.pipe(
        first(),
        mergeMap(token => {
          if (token) {
            if (!this.auth.parseToken(token)) {
              return Observable.of(new ACTIONS.CmsAccountFailureAction({error: 'Permission denied'}));
            } else {
              return this.cms.individualAccount.map(doc => {
                const account: AccountModel = {doc, id: doc.id, name: doc['name']};
                return new ACTIONS.CmsAccountSuccessAction({account});
              });
            }
          } else {
            return Observable.of(new ACTIONS.CmsAccountFailureAction({error: 'You are not logged in'}));
          }
        }),
        catchError(error => Observable.of(new ACTIONS.CmsAccountFailureAction({error})))
      );
    })
  );

  constructor(private actions$: Actions,
              private auth: AuthService,
              private cms: CmsService) {}
}
