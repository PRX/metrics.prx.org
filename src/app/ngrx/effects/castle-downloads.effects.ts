import { Injectable, OnDestroy } from '@angular/core';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { selectRouter } from '../reducers/selectors';
import { CastleService } from '@app/core';
import { Episode, RouterParams, METRICSTYPE_DOWNLOADS, METRICSTYPE_DROPDAY, INTERVAL_MONTHLY, INTERVAL_WEEKLY } from '../';
import * as dateUtil from '@app/shared/util/date';
import { INTERVAL_DAILY } from '../reducers/models';

@Injectable()
export class CastleDownloadsEffects implements OnDestroy {
  routerParams: RouterParams;
  routerParamsSub: Subscription;

  // DOWNLOADS: whenever an episode page is loaded that is the currently routed page,
  // call the load actions for podcast and episode downloads
  @Effect()
  loadRoutedDownloads$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS),
    filter((action: ACTIONS.CastleEpisodePageSuccessAction) => {
      const { page, episodes } = action.payload;
      return (
        this.routerParams.metricsType === METRICSTYPE_DOWNLOADS &&
        episodes &&
        episodes.length &&
        this.routerParams &&
        this.routerParams.episodePage === page
      );
    }),
    map((action: ACTIONS.CastleEpisodePageSuccessAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodePageSuccessPayload) => {
      const { episodes } = payload;
      this.store.dispatch(
        new ACTIONS.CastlePodcastDownloadsLoadAction({
          id: episodes[0].podcastId,
          interval: this.routerParams.interval,
          beginDate: this.routerParams.beginDate,
          endDate: this.routerParams.endDate
        })
      );
      this.store.dispatch(new ACTIONS.CastlePodcastAllTimeDownloadsLoadAction({ id: episodes[0].podcastId }));
      return episodes.map((episode: Episode) => {
        this.store.dispatch(
          new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
            podcastId: episode.podcastId,
            guid: episode.guid
          })
        );
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

  // DROPDAY: when a page 1 of episodes is loaded
  // call the load actions for episode dropday
  // and dispatch action to select the episodes
  // (pairs with routing.service loadEpisodes on route change)
  @Effect()
  loadRoutedDropday$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS),
    filter((action: ACTIONS.CastleEpisodePageSuccessAction) => {
      const { page, episodes } = action.payload;
      return this.routerParams.metricsType === METRICSTYPE_DROPDAY && episodes && episodes.length && page === 1;
    }),
    map((action: ACTIONS.CastleEpisodePageSuccessAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodePageSuccessPayload) => {
      const { episodes } = payload;
      return [
        new ACTIONS.EpisodeSelectEpisodesAction({
          podcastId: this.routerParams.podcastId,
          metricsType: this.routerParams.metricsType,
          episodeGuids: episodes.map(e => e.guid)
        }),
        ...episodes.map((episode: Episode) => {
          return new ACTIONS.CastleEpisodeAllTimeDownloadsLoadAction({
            podcastId: episode.podcastId,
            guid: episode.guid
          });
        }),
        ...episodes.map((episode: Episode) => {
          return new ACTIONS.CastleEpisodeDropdayLoadAction({
            podcastId: episode.podcastId,
            guid: episode.guid,
            title: episode.title,
            interval: this.routerParams.interval,
            publishedAt: episode.publishedAt,
            days: this.routerParams.days
          });
        })
      ];
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
      return this.castle
        .followList('prx:podcast-downloads', {
          id,
          from: beginDate.toISOString(),
          to: endDate.toISOString(),
          interval: interval.value
        })
        .pipe(
          map(results => {
            this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({ gaAction: 'load', value: results[0]['downloads'].length }));
            return new ACTIONS.CastlePodcastDownloadsSuccessAction({
              id,
              downloads: results[0]['downloads']
            });
          }),
          catchError(error => of(new ACTIONS.CastlePodcastDownloadsFailureAction({ id, error })))
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
      return this.castle
        .followList('prx:episode-downloads', {
          guid,
          from: beginDate.toISOString(),
          to: endDate.toISOString(),
          interval: interval.value
        })
        .pipe(
          map(results => {
            return new ACTIONS.CastleEpisodeDownloadsSuccessAction({
              podcastId,
              page,
              guid,
              downloads: results[0]['downloads']
            });
          }),
          catchError(error => {
            return of(
              new ACTIONS.CastleEpisodeDownloadsFailureAction({
                podcastId,
                page,
                guid,
                error
              })
            );
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
      return this.castle.follow('prx:podcast', { id }).pipe(
        map(metrics => {
          const { total } = metrics['downloads'];
          return new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({ id, total });
        }),
        catchError(
          (error): Observable<Action> => {
            if (error.status === 404) {
              return of(new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({ id, total: 0 }));
            } else {
              return of(new ACTIONS.CastlePodcastAllTimeDownloadsFailureAction({ id, error }));
            }
          }
        )
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
      return this.castle.followList('prx:episode', { guid }).pipe(
        map(metrics => {
          const { total } = metrics[0]['downloads'];
          return new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({ podcastId, guid, total });
        }),
        catchError(
          (error): Observable<Action> => {
            if (error.status === 404) {
              return of(new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({ podcastId, guid, total: 0 }));
            } else {
              return of(new ACTIONS.CastleEpisodeAllTimeDownloadsFailureAction({ podcastId, guid, error }));
            }
          }
        )
      );
    })
  );

  @Effect()
  loadEpisodeDropday$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_DROPDAY_LOAD),
    map((action: ACTIONS.CastleEpisodeDropdayLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodeDropdayLoadPayload) => {
      const { podcastId, guid, title, interval, publishedAt: from, days } = payload;
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
            return new ACTIONS.CastleEpisodeDropdaySuccessAction({
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
              new ACTIONS.CastleEpisodeDropdayFailureAction({
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
  );

  // basic - load > success/failure podcast listeners
  @Effect()
  loadPodcastListeners$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_LISTENERS_LOAD),
    map((action: ACTIONS.CastlePodcastListenersLoadAction) => action.payload),
    switchMap((payload: ACTIONS.CastlePodcastListenersLoadPayload) => {
      const { id, interval: intervalType, beginDate, endDate } = payload;
      let interval = intervalType.value;
      if (intervalType === INTERVAL_WEEKLY) {
        // 1w -> WEEK for listeners API
        interval = 'WEEK';
      } else if (intervalType === INTERVAL_MONTHLY) {
        // 1M -> MONTH for listeners API
        interval = 'MONTH';
      }
      return this.castle.follow('prx:podcast', { id }).pipe(
        switchMap(podcast =>
          podcast
            .follow('prx:listeners', {
              id,
              from: beginDate.toISOString(),
              to: endDate.toISOString(),
              interval
            })
            .pipe(
              map(result => new ACTIONS.CastlePodcastListenersSuccessAction({ id, listeners: result['listeners'] })),
              catchError(error => of(new ACTIONS.CastlePodcastListenersFailureAction({ id, error })))
            )
        )
      );
    })
  );

  constructor(private actions$: Actions, private castle: CastleService, private store: Store<any>) {
    this.routerParamsSub = this.store.pipe(select(selectRouter)).subscribe((routerParams: RouterParams) => {
      this.routerParams = routerParams;
    });
  }

  ngOnDestroy() {
    if (this.routerParamsSub) {
      this.routerParamsSub.unsubscribe();
    }
  }
}
