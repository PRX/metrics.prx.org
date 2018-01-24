import { Injectable } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ActionTypes,
  CastlePodcastAllTimeMetricsSuccessAction, CastlePodcastAllTimeMetricsFailureAction,
  CastleEpisodeAllTimeMetricsLoadAction, CastleEpisodeAllTimeMetricsLoadPayload,
  CastleEpisodeAllTimeMetricsSuccessAction, CastleEpisodeAllTimeMetricsFailureAction } from '../actions';
import { selectSelectedPodcast } from '../reducers';
import { CastleService } from '../../core';
import { PodcastModel } from '../';

@Injectable()
export class CastleEffects {
  selectedPodcast: PodcastModel;

  @Effect()
  loadAllTimePodcastMetrics = this.actions$
    .ofType(ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD)
    .switchMap(() => {
      return this.castle.followList('prx:podcast', {id: this.selectedPodcast.feederId})
        .map(
          metrics => {
            const allTimeDownloads = metrics[0]['downloads']['total'];
            return new CastlePodcastAllTimeMetricsSuccessAction({podcast: this.selectedPodcast, allTimeDownloads});
          },
          error => Observable.of(new CastlePodcastAllTimeMetricsFailureAction({error}))
        );
    });

  @Effect()
  loadAllTimeEpisodeMetrics = this.actions$
    .ofType(ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_LOAD)
    .map((action: CastleEpisodeAllTimeMetricsLoadAction) => action.payload)
    .flatMap((payload: CastleEpisodeAllTimeMetricsLoadPayload) => {
      return this.castle.followList('prx:episode', {guid: payload.episode.guid})
        .map(
          metrics => {
            const allTimeDownloads = metrics[0]['downloads']['total'];
            return new CastleEpisodeAllTimeMetricsSuccessAction({ episode: payload.episode, allTimeDownloads});
          },
          error => Observable.of(new CastleEpisodeAllTimeMetricsFailureAction({error}))
        );
    });

  constructor(private actions$: Actions,
              private castle: CastleService,
              private store: Store<any>) {
                this.store.select(selectSelectedPodcast).subscribe((podcast: PodcastModel) => {
                  this.selectedPodcast = podcast;
                });
              }
}
