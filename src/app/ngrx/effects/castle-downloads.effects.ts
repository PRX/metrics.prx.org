import { Injectable } from '@angular/core';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { selectRouter } from '../reducers/selectors';
import { CastleService } from '../../core';
import {
  Episode, RouterParams, METRICSTYPE_DOWNLOADS
} from '../';

@Injectable()
export class CastleDownloadsEffects {
  routerParams: RouterParams;

  // whenever an episode page is loaded that is the currently routed page,
  // call the load actions for podcast and episode metrics
  @Effect()
  loadRoutedMetrics$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS),
    filter((action: ACTIONS.CastleEpisodePageSuccessAction) => {
      const { page, episodes } = action.payload;
      return this.routerParams.metricsType === METRICSTYPE_DOWNLOADS &&
        episodes && episodes.length && this.routerParams && this.routerParams.episodePage === page;
    }),
    map((action: ACTIONS.CastleEpisodePageSuccessAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodePageSuccessPayload) => {
      const { episodes } = payload;
      this.store.dispatch(new ACTIONS.CastlePodcastDownloadsLoadAction({
        id: episodes[0].podcastId,
        interval: this.routerParams.interval,
        beginDate: this.routerParams.beginDate,
        endDate: this.routerParams.endDate
      }));
      this.store.dispatch(new ACTIONS.CastlePodcastAllTimeDownloadsLoadAction({id: episodes[0].podcastId}));
      return episodes.map((episode: Episode) => {
        this.store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
          podcastId: episode.podcastId,
          guid: episode.guid
        }));
        return new ACTIONS.CastleEpisodeDownloadsLoadAction({
          podcastId: episode.podcastId,
          page: episode.page,
          guid: episode.guid,
          interval: this.routerParams.interval,
          beginDate: this.routerParams.beginDate,
          endDate: this.routerParams.endDate
        });
      });
    })
  );

  // basic - load > success/failure podcasrt downloads
  // also dispatches google analytics action for loading downloads with how many datapoints
  @Effect()
  loadPodcastDownloads$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_DOWNLOADS_LOAD),
    map((action: ACTIONS.CastlePodcastDownloadsLoadAction) => action.payload),
    switchMap((payload: ACTIONS.CastlePodcastDownloadsLoadPayload) => {
      const { id, interval, beginDate, endDate } = payload;
      return this.castle.followList('prx:podcast-downloads', {
        id,
        from: beginDate.toISOString(),
        to: endDate.toISOString(),
        interval: interval.value
      }).pipe(
        map(results => {
          this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'load', value: results[0]['downloads'].length}));
          return new ACTIONS.CastlePodcastDownloadsSuccessAction({
            id,
            downloads: results[0]['downloads']
          });
        }),
        catchError(error => of(new ACTIONS.CastlePodcastDownloadsFailureAction({id, error})))
      );
    })
  );

  // basic - load > success/failure episode downloads
  @Effect()
  loadEpisodeDownloads$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_DOWNLOADS_LOAD),
    map((action: ACTIONS.CastleEpisodeDownloadsLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodeDownloadsLoadPayload) => {
      const { podcastId, page, guid, interval, beginDate, endDate } = payload;
      return this.castle.followList('prx:episode-downloads', {
        guid,
        from: beginDate.toISOString(),
        to: endDate.toISOString(),
        interval: interval.value
      }).pipe(
        map(results => {
          return new ACTIONS.CastleEpisodeDownloadsSuccessAction({
            podcastId,
            page,
            guid,
            downloads: results[0]['downloads']
          });
        }),
        catchError(error => {
          return of(new ACTIONS.CastleEpisodeDownloadsFailureAction({
            podcastId,
            page,
            guid,
            error
          }));
        })
      );
    })
  );

  // basic - load > success/failure podcast performance
  @Effect()
  loadPodcastAllTimeDownloads$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_LOAD),
    map((action: ACTIONS.CastlePodcastAllTimeDownloadsLoadAction) => action.payload),
    switchMap((payload: ACTIONS.CastlePodcastAllTimeDownloadsLoadPayload) => {
      const { id } = payload;
      return this.castle
        .followList('prx:podcast', {id})
        .pipe(
            map(metrics => {
            const { total } = metrics[0]['downloads'];
            return new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({id, total});
          }),
          catchError((error): Observable<Action> => {
            if (error.status === 404) {
              return of(new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({id, total: 0}));
            } else {
              return of(new ACTIONS.CastlePodcastAllTimeDownloadsFailureAction({id, error}));
            }
          })
        );
    })
  );

  // basic - load > success/failure episode performance
  @Effect()
  loadEpisodeAllTimeDownloads$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD),
    map((action: ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodeAllTimeDownloadsLoadPayload) => {
      const { podcastId, guid } = payload;
      return this.castle
        .followList('prx:episode', {guid})
        .pipe(
          map(metrics => {
            const { total } = metrics[0]['downloads'];
            return new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({podcastId, guid, total});
          }),
          catchError((error): Observable<Action> => {
            if (error.status === 404) {
              return of(new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({podcastId, guid, total: 0}));
            } else {
              return of(new ACTIONS.CastleEpisodeAllTimeDownloadsFailureAction({podcastId, guid, error}));
            }
          })
        );
    })
  );

  constructor(private actions$: Actions,
              private castle: CastleService,
              private store: Store<any>) {
    this.store.pipe(select(selectRouter)).subscribe((routerParams: RouterParams) => {
      this.routerParams = routerParams;
    });
  }
}
