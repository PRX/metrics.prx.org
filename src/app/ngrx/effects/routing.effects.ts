import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationPayload, RouterNavigationAction } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { FilterModel } from '../';
import { CastleFilterAction, CastlePodcastChartToggleAction, CastleEpisodeChartToggleAction } from '../actions';

@Injectable()
export class RoutingEffects {
  @Effect()
  filterFromRoute$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((action: RouterNavigationAction) => action.payload)
    .switchMap((payload: RouterNavigationPayload<RouterStateSnapshot>) => {
      const filter: FilterModel = {...payload.routerState};

      // Please note that this is not correct, but it is temporary
      // because of our RouterStateSerializer, what we're getting here is our custom defined RouterModel
      // instead of the RouterNavigationPayload<RouterStateSnapShot> action payload that ROUTER_NAVIGATION expects
      // TypeScript complains about it,
      // but when FilterModel is replaced with our RouterModel CustomSerializer
      // and we can combine selectors with these charted route params
      // we won't be storing charted with the metrics entry and won't need this effect anymore, so meh
      if (payload.routerState['episodeIds']) {
        payload.routerState['episodeIds'].forEach(episodeId => {
          this.store.dispatch(new CastleEpisodeChartToggleAction({id: episodeId, seriesId: filter.podcastSeriesId, charted: true}));
        });
      }

      if (payload.routerState['chartPodcast']) {
        this.store.dispatch(new CastlePodcastChartToggleAction({
          seriesId: filter.podcastSeriesId, charted: payload.routerState['chartPodcast']}));
      }

      return Observable.of(new CastleFilterAction({filter}));
    });

  constructor(public store: Store<any>,
              private actions$: Actions) {}
}
