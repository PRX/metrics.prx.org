import { Injectable } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { selectSelectedPodcast, selectRecentEpisode } from '../reducers';
import { CastleService } from '../../core';
import { PodcastModel, EpisodeModel, getMetricsProperty } from '../';

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
  loadPodcastPerformanceMetrics$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_LOAD)
    .map((action: ACTIONS.CastlePodcastPerformanceMetricsLoadAction) => action.payload)
    .switchMap((payload: ACTIONS.CastlePodcastPerformanceMetricsLoadPayload) => {
    const { seriesId, feederId } = payload;
      return this.castle
        .followList('prx:podcast', {id: feederId})
        .map(metrics => {
          const { total, previous7days, this7days, yesterday, today } = metrics[0]['downloads'];
          return new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({seriesId, feederId,
            total, previous7days, this7days, yesterday, today});
        })
        .catch(error => {
          if (error.status === 404) {
            return Observable.of(new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({seriesId, feederId,
              total: 0, previous7days: 0, this7days: 0, yesterday: 0, today: 0}));
          } else {
            Observable.of(new ACTIONS.CastlePodcastPerformanceMetricsFailureAction({seriesId, feederId, error}));
          }
        });
    });

  @Effect()
  loadEpisodePerformanceMetrics$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_LOAD)
    .map((action: ACTIONS.CastleEpisodePerformanceMetricsLoadAction) => action.payload)
    .flatMap((payload: ACTIONS.CastleEpisodePerformanceMetricsLoadPayload) => {
      const { id, seriesId, guid } = payload;
      return this.castle
        .followList('prx:episode', {guid})
        .map(metrics => {
          const { total, previous7days, this7days, yesterday, today } = metrics[0]['downloads'];
          return new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({id, seriesId, guid,
            total, previous7days, this7days, yesterday, today});
        })
        .catch(error => {
          if (error.status === 404) {
            return Observable.of(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({id, seriesId, guid,
              total: 0, previous7days: 0, this7days: 0, yesterday: 0, today: 0}));
          } else {
            return Observable.of(new ACTIONS.CastleEpisodePerformanceMetricsFailureAction({id, seriesId, guid, error}));
          }
        });
    });

  constructor(private actions$: Actions,
              private castle: CastleService,
              private store: Store<any>) {
    this.store.select(selectSelectedPodcast).subscribe((podcast: PodcastModel) => {
      this.selectedPodcast = podcast;
      if (this.selectedPodcast) {
        const {seriesId, feederId} = this.selectedPodcast;
        this.store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({seriesId, feederId}));
      }
    });
    this.store.select(selectRecentEpisode).subscribe((episode: EpisodeModel) => {
      if (episode) {
        const {id, seriesId, guid} = episode;
        this.store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({id, seriesId, guid}));
      }
    });
  }
}
