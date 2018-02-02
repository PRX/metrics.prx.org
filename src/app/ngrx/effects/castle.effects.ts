import { Injectable } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { selectSelectedPodcast } from '../reducers';
import { CastleService } from '../../core';
import { PodcastModel, getMetricsProperty } from '../';

@Injectable()
export class CastleEffects {
  selectedPodcast: PodcastModel;

  @Effect()
  loadPodcastMetrics$ = this.actions$
    .ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_LOAD)
    .map((action: ACTIONS.CastlePodcastMetricsLoadAction) => action.payload)
    .switchMap((payload: ACTIONS.CastlePodcastMetricsLoadPayload) => {
      const { seriesId, feederId, metricsType, interval, beginDate, endDate } = payload;
      return this.castle.followList('prx:podcast-downloads', {
        id: feederId,
        from: beginDate.toISOString(),
        to: endDate.toISOString(),
        interval: interval.value
      }).map(
        metrics => {
          this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'load', value: metrics[0]['downloads'].length}));
          return new ACTIONS.CastlePodcastMetricsSuccessAction({
            seriesId,
            feederId,
            metricsPropertyName: getMetricsProperty(interval, metricsType),
            metrics: metrics[0]['downloads']
          });
        }
      ).catch(error => Observable.of(new ACTIONS.CastlePodcastMetricsFailureAction({
          seriesId, feederId, error})));
    });

  @Effect()
  loadEpisodeMetrics$ = this.actions$
    .ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD)
    .map((action: ACTIONS.CastleEpisodeMetricsLoadAction) => action.payload)
    .mergeMap((payload: ACTIONS.CastleEpisodeMetricsLoadPayload) => {
    const {seriesId, page, id, guid, metricsType, interval, beginDate, endDate } = payload;
      return this.castle.followList('prx:episode-downloads', {
        guid,
        from: beginDate.toISOString(),
        to: endDate.toISOString(),
        interval: interval.value
      }).map(
        metrics => {
          return new ACTIONS.CastleEpisodeMetricsSuccessAction({
            seriesId,
            page,
            id,
            guid,
            metricsPropertyName: getMetricsProperty(interval, metricsType),
            metrics: metrics[0]['downloads']
          });
        }
      ).catch(error => {
        return Observable.of(new ACTIONS.CastleEpisodeMetricsFailureAction({
          seriesId,
          page,
          id,
          guid,
          error
        }));
      });
    });

  @Effect()
  loadAllTimePodcastMetrics$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_ALL_TIME_METRICS_LOAD)
    .switchMap(() => {
      if (this.selectedPodcast) {
        return this.castle
          .followList('prx:podcast', {id: this.selectedPodcast.feederId})
          .map(metrics => {
            const allTimeDownloads = metrics[0]['downloads']['total'];
            return new ACTIONS.CastlePodcastAllTimeMetricsSuccessAction({podcast: this.selectedPodcast, allTimeDownloads});
          })
          .catch(error => {
            if (error.status === 404) {
              const allTimeDownloads = 0;
              return Observable.of(new ACTIONS.CastlePodcastAllTimeMetricsSuccessAction({podcast: this.selectedPodcast, allTimeDownloads}));
            } else {
              Observable.of(new ACTIONS.CastlePodcastAllTimeMetricsFailureAction({podcast: this.selectedPodcast, error}));
            }
          });
      } else {
        // gonna be difficult to capture this error without changing shape of podcast metrics state since it's just an array
        return Observable.of(new ACTIONS.CastlePodcastAllTimeMetricsFailureAction({podcast: undefined, error: 'No selected podcast yet'}));
      }
    });

  @Effect()
  loadAllTimeEpisodeMetrics$ = this.actions$
    .ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_ALL_TIME_METRICS_LOAD)
    .map((action: ACTIONS.CastleEpisodeAllTimeMetricsLoadAction) => action.payload)
    .flatMap((payload: ACTIONS.CastleEpisodeAllTimeMetricsLoadPayload) => {
      const { episode } = payload;
      return this.castle
        .followList('prx:episode', {guid: episode.guid})
        .map(metrics => {
          const allTimeDownloads = metrics[0]['downloads']['total'];
          return new ACTIONS.CastleEpisodeAllTimeMetricsSuccessAction({episode, allTimeDownloads});
        })
        .catch(error => {
          if (error.status === 404) {
            const allTimeDownloads = 0;
            return Observable.of(new ACTIONS.CastleEpisodeAllTimeMetricsSuccessAction({episode, allTimeDownloads}));
          } else {
            return Observable.of(new ACTIONS.CastleEpisodeAllTimeMetricsFailureAction({episode, error}));
          }
        });
    });

  constructor(private actions$: Actions,
              private castle: CastleService,
              private store: Store<any>) {
                this.store.select(selectSelectedPodcast).subscribe((podcast: PodcastModel) => {
                  this.selectedPodcast = podcast;
                });
              }
}
