import { Injectable } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CastleService } from '../../core';
import { ActionTypes, CastlePodcastAllTimeMetricsLoadAction } from '../actions';

@Injectable()
export class CastleEffects {

  @Effect()
  loadAllTimePodcastMetrics = this.actions$
    .ofType(ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD)
    .map((action: CastlePodcastAllTimeMetricsLoadAction) => {
      console.log('WE ARE IN THE CASTLE LOAD METRICS EFFECT')
      const feederId = action.payload.podcast.feederId
      this.castle.followList('prx:podcast', {id: feederId}).subscribe(
        metrics => {
          debugger
        },
        err => {
          debugger
        }
      );
    });

  constructor(private actions$: Actions,
              private castle: CastleService,
              public store: Store<any>) {}
}
