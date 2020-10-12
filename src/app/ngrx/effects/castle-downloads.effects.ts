import { Injectable } from '@angular/core';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { selectRouter } from '../reducers/selectors';
import { CastleService } from '@app/core';
import { Episode, RouterParams, METRICSTYPE_DOWNLOADS, METRICSTYPE_DROPDAY, INTERVAL_MONTHLY, INTERVAL_WEEKLY } from '../';
import * as dateUtil from '@app/shared/util/date';

@Injectable()
export class CastleDownloadsEffects {
  // DOWNLOADS: whenever an episode page is loaded that is the currently routed page,
  // call the load actions for podcast and episode downloads
  loadRoutedDownloads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastleEpisodePageSuccess),
      withLatestFrom(this.store.pipe(select(selectRouter))),
      filter(([action, routerParams]) => {
        const { page, episodes } = action;
        return (
          routerParams.metricsType === METRICSTYPE_DOWNLOADS &&
          episodes &&
          episodes.length &&
          routerParams &&
          routerParams.episodePage === page
        );
      }),
      mergeMap(([action, routerParams]) => {
        const { episodes } = action;
        this.store.dispatch(
          ACTIONS.CastlePodcastDownloadsLoad({
            id: episodes[0].podcastId,
            interval: routerParams.interval,
            beginDate: routerParams.beginDate,
            endDate: routerParams.endDate
          })
        );
        this.store.dispatch(ACTIONS.CastlePodcastAllTimeDownloadsLoad({ id: episodes[0].podcastId }));
        return episodes.map((episode: Episode) => {
          this.store.dispatch(
            ACTIONS.CastleEpisodeAllTimeDownloadsLoad({
              podcastId: episode.podcastId,
              guid: episode.guid
            })
          );
          return ACTIONS.CastleEpisodeDownloadsLoad({
            podcastId: episode.podcastId,
            page: episode.page,
            guid: episode.guid,
            interval: routerParams.interval,
            beginDate: routerParams.beginDate,
            endDate: routerParams.endDate
          });
        });
      })
    )
  );

  // DROPDAY: when a page 1 of episodes is loaded
  // call the load actions for episode dropday
  // and dispatch action to select the episodes
  // (pairs with routing.service loadEpisodes on route change)
  loadRoutedDropday$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastleEpisodePageSuccess),
      withLatestFrom(this.store.pipe(select(selectRouter))),
      filter(([action, routerParams]) => {
        const { page, episodes } = action;
        return routerParams.metricsType === METRICSTYPE_DROPDAY && episodes && episodes.length && page === 1;
      }),
      mergeMap(([action, routerParams]) => {
        const { episodes } = action;
        return [
          ACTIONS.EpisodeSelectEpisodes({
            podcastId: routerParams.podcastId,
            metricsType: routerParams.metricsType,
            episodeGuids: episodes.map(e => e.guid)
          }),
          ...episodes.map((episode: Episode) => {
            return ACTIONS.CastleEpisodeAllTimeDownloadsLoad({
              podcastId: episode.podcastId,
              guid: episode.guid
            });
          }),
          ...episodes.map((episode: Episode) => {
            return ACTIONS.CastleEpisodeDropdayLoad({
              podcastId: episode.podcastId,
              guid: episode.guid,
              title: episode.title,
              interval: routerParams.interval,
              publishedAt: episode.publishedAt,
              days: routerParams.days
            });
          })
        ];
      })
    )
  );

  // basic - load > success/failure podcasrt downloads
  // also dispatches google analytics action for loading downloads with how many datapoints
  loadPodcastDownloads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastlePodcastDownloadsLoad),
      switchMap(action => {
        const { id, interval, beginDate, endDate } = action;
        return this.castle
          .followList('prx:podcast-downloads', {
            id,
            from: beginDate.toISOString(),
            to: endDate.toISOString(),
            interval: interval.value
          })
          .pipe(
            map(results => {
              this.store.dispatch(ACTIONS.GoogleAnalyticsEvent({ gaAction: 'load', value: results[0]['downloads'].length }));
              return ACTIONS.CastlePodcastDownloadsSuccess({
                id,
                downloads: results[0]['downloads']
              });
            }),
            catchError(error => of(ACTIONS.CastlePodcastDownloadsFailure({ id, error })))
          );
      })
    )
  );

  // basic - load > success/failure episode downloads
  loadEpisodeDownloads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastleEpisodeDownloadsLoad),
      mergeMap(action => {
        const { podcastId, page, guid, interval, beginDate, endDate } = action;
        return this.castle
          .followList('prx:episode-downloads', {
            guid,
            from: beginDate.toISOString(),
            to: endDate.toISOString(),
            interval: interval.value
          })
          .pipe(
            map(results => {
              return ACTIONS.CastleEpisodeDownloadsSuccess({
                podcastId,
                page,
                guid,
                downloads: results[0]['downloads']
              });
            }),
            catchError(error => {
              return of(
                ACTIONS.CastleEpisodeDownloadsFailure({
                  podcastId,
                  page,
                  guid,
                  error
                })
              );
            })
          );
      })
    )
  );

  // basic - load > success/failure podcast performance
  loadPodcastAllTimeDownloads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastlePodcastAllTimeDownloadsLoad),
      switchMap(action => {
        const { id } = action;
        return this.castle.follow('prx:podcast', { id }).pipe(
          map(metrics => {
            const { total } = metrics['downloads'];
            return ACTIONS.CastlePodcastAllTimeDownloadsSuccess({ id, total });
          }),
          catchError(
            (error): Observable<Action> => {
              if (error.status === 404) {
                return of(ACTIONS.CastlePodcastAllTimeDownloadsSuccess({ id, total: 0 }));
              } else {
                return of(ACTIONS.CastlePodcastAllTimeDownloadsFailure({ id, error }));
              }
            }
          )
        );
      })
    )
  );

  // basic - load > success/failure episode performance
  loadEpisodeAllTimeDownloads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastleEpisodeAllTimeDownloadsLoad),
      mergeMap(action => {
        const { podcastId, guid } = action;
        return this.castle.followList('prx:episode', { guid }).pipe(
          map(metrics => {
            const { total } = metrics[0]['downloads'];
            return ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({ podcastId, guid, total });
          }),
          catchError(
            (error): Observable<Action> => {
              if (error.status === 404) {
                return of(ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({ podcastId, guid, total: 0 }));
              } else {
                return of(ACTIONS.CastleEpisodeAllTimeDownloadsFailure({ podcastId, guid, error }));
              }
            }
          )
        );
      })
    )
  );

  loadEpisodeDropday$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastleEpisodeDropdayLoad),
      mergeMap(action => {
        const { podcastId, guid, title, interval, publishedAt: from, days } = action;
        const daysPublished = Math.ceil((new Date().valueOf() - from.valueOf()) / (1000 * 60 * 60 * 24));
        const to = dateUtil.addDays(from, Math.min(days, daysPublished) - 1); // day0 + (days - 1) = days
        return this.castle
          .followList('prx:episode-downloads', {
            guid,
            from: dateUtil.ISODateBeginHour(from),
            to: dateUtil.ISODateEndDay(to),
            interval: interval.value
          })
          .pipe(
            map(results => {
              return ACTIONS.CastleEpisodeDropdaySuccess({
                podcastId,
                guid,
                title,
                interval,
                publishedAt: from,
                downloads: results[0]['downloads']
              });
            }),
            catchError(error => {
              return of(
                ACTIONS.CastleEpisodeDropdayFailure({
                  podcastId,
                  guid,
                  title,
                  interval,
                  publishedAt: from,
                  error
                })
              );
            })
          );
      })
    )
  );

  // basic - load > success/failure podcast listeners
  loadPodcastListeners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastlePodcastListenersLoad),
      switchMap(action => {
        const { id, interval, beginDate, endDate } = action;
        return this.castle.follow('prx:podcast', { id }).pipe(
          switchMap(podcast =>
            podcast
              .follow('prx:listeners', {
                id,
                from: beginDate.toISOString(),
                to: endDate.toISOString(),
                interval: interval.value
              })
              .pipe(
                map(result => ACTIONS.CastlePodcastListenersSuccess({ id, listeners: result['listeners'] })),
                catchError(error => of(ACTIONS.CastlePodcastListenersFailure({ id, error })))
              )
          )
        );
      })
    )
  );

  constructor(private actions$: Actions, private castle: CastleService, private store: Store<any>) {}
}
