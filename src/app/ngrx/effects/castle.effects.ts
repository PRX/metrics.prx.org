import { Injectable } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ActionTypes, CastlePodcastAllTimeMetricsLoadAction, CastlePodcastAllTimeMetricsLoadPayload, CastlePodcastAllTimeMetricsSuccessAction, CastlePodcastAllTimeMetricsFailureAction } from '../actions';
import { selectPodcasts } from '../reducers';

import { filterPodcasts } from '../../shared/util/metrics.util';
import { CastleService } from '../../core';
import { PodcastModel } from '../';

@Injectable()
export class CastleEffects {
  podcasts: PodcastModel[] = [];

  @Effect()
  loadAllTimePodcastMetrics = this.actions$
    .ofType(ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD)
    .map((action: CastlePodcastAllTimeMetricsLoadAction) => action.payload)
    .switchMap((payload: CastlePodcastAllTimeMetricsLoadPayload) => {
      const podcast = filterPodcasts(payload.filter, this.podcasts);
      if (podcast) {
        const feederId = podcast.feederId;
        return this.castle.followList('prx:podcast', {id: podcast.feederId})
          .map(
            metrics => {
              const allTimeDownloads = metrics[0]['downloads']['total'];
              return new CastlePodcastAllTimeMetricsSuccessAction({podcast, allTimeDownloads});
            },
            error => Observable.of(new CastlePodcastAllTimeMetricsFailureAction({error}))
          )
        } else {
          return Observable.of(new CastlePodcastAllTimeMetricsFailureAction({error: 'No podcasts yet'}))

        }
    });

  constructor(private actions$: Actions,
              private castle: CastleService,
              public store: Store<any>) {
                this.store.select(selectPodcasts).subscribe((state: PodcastModel[]) => {
                  this.podcasts = state;
                  console.log('got some podcasts and they are', state)
                });
              }
}
