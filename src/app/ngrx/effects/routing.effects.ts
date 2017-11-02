import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationPayload, RouterNavigationAction } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { FilterModel } from '../model';
import { CastleFilterAction } from '../actions';

@Injectable()
export class RoutingEffects {
  @Effect()
  filterFromRoute$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((action: RouterNavigationAction) => action.payload)
    .switchMap((payload: RouterNavigationPayload<RouterStateSnapshot>) => {
      let filter: FilterModel = {};
      if (payload.routerState.url && payload.routerState.url.length > 1) {
        const url = payload.routerState.url.split('/');
        if (url[1]) {
          filter.podcastSeriesId = +url[1];
        }
      }
      return Observable.of(new CastleFilterAction({filter}));
    });

  constructor(private actions$: Actions) {}
}
