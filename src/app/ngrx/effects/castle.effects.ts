import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators/catchError';
import { concatMap } from 'rxjs/operators/concatMap';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { startWith } from 'rxjs/operators/startWith';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { selectRouter } from '../reducers/selectors';
import { HalDoc } from '../../core';
import { CastleService } from '../../core';
import { Episode, Podcast, RouterParams, getMetricsProperty, PODCAST_PAGE_SIZE, EPISODE_PAGE_SIZE } from '../';
import * as localStorageUtil from '../../shared/util/local-storage.util';

@Injectable()
export class CastleEffects {
  routerParams: RouterParams;

  @Effect()
  loadPodcastPage$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PAGE_LOAD),
    startWith(new ACTIONS.CastlePodcastPageLoadAction({page: 1, all: true})),
    map((action: ACTIONS.CastlePodcastPageLoadAction) => action.payload),
    switchMap((payload: ACTIONS.CastleEpisodePageLoadPayload) => {
      const { page, all } = payload;
      return this.castle.followItems('prx:podcasts', { page, per: PODCAST_PAGE_SIZE })
      .pipe(
        map((results: HalDoc[]) => {
            return new ACTIONS.CastlePodcastPageSuccessAction({
              page,
              all,
              total: results[0].total(),
              podcasts: results.map(doc => {
                return {
                  id: '' + doc['id'],
                  title: doc['title']
                };
              })
            });
          }),
        catchError(error => Observable.of(new ACTIONS.CastlePodcastPageFailureAction({error})))
      );
    })
  );

  @Effect({dispatch: false})
  loadPodcastsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS),
    map((action: ACTIONS.CastlePodcastPageSuccessAction) => action.payload),
    switchMap((payload: ACTIONS.CastlePodcastPageSuccessPayload) => {
      // only dispatches a routing action when there is not already a routed :seriesId
      if (!this.routerParams.podcastId) {
        const {podcasts} = payload;
        const localStorageRouterParams: RouterParams = localStorageUtil.getItem(localStorageUtil.KEY_ROUTER_PARAMS);
        const localStoragePodcastInList = localStorageRouterParams && localStorageRouterParams.podcastId &&
          podcasts.find(podcast => podcast.id === localStorageRouterParams.podcastId);
        this.store.dispatch(new ACTIONS.RoutePodcastAction( {
          // navigate to either the podcastStorageId in localStorage or the first one in the result from CMS (which is the last one changed)
          podcastId: (localStoragePodcastInList && localStorageRouterParams.podcastId) || podcasts[0].id
        }));
      }
      return Observable.of(null);
    })
  );

  @Effect({dispatch: false})
  loadNextPodcastPage$: Observable<any> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS),
    map((action: ACTIONS.CastlePodcastPageSuccessAction) => action.payload),
    concatMap((payload: ACTIONS.CastlePodcastPageSuccessPayload) => {
      const { page, all, total } = payload;
      if (all && page * PODCAST_PAGE_SIZE < total) {
        this.store.dispatch(new ACTIONS.CastlePodcastPageLoadAction({page: page + 1, all}));
      }
      return Observable.of(null);
    })
  );

  /*@Effect()
  loadPodcastEpisodes$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS),
    filter((action: ACTIONS.CastlePodcastPageSuccessAction) => {
      const { all, page, podcasts } = action.payload;
      return all && page === 1 && podcasts && podcasts.length > 0;
    }),
    map((action: ACTIONS.CastlePodcastPageSuccessAction) => action.payload.podcasts),
    mergeMap((podcasts: Podcast[]) => {
      return podcasts.map(podcast => new ACTIONS.CastleEpisodePageLoadAction(
        {podcastId: podcast.id, page: 1, all: true}));
    })
  );*/

  @Effect()
  loadEpisodePage$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_LOAD),
    map((action: ACTIONS.CastleEpisodePageLoadAction) => action.payload),
    concatMap((payload: ACTIONS.CastleEpisodePageLoadPayload) => {
      const { podcastId, page, all } = payload;
      return this.castle.follow('prx:podcast', {id: podcastId}).followItems('prx:episodes', {page, per: EPISODE_PAGE_SIZE})
        .pipe(
          map((results: HalDoc[]) => {
            return new ACTIONS.CastleEpisodePageSuccessAction({
              page,
              all,
              total: results[0].total(),
              episodes: results.map(doc => {
                return {
                  guid: '' + doc['id'],
                  podcastId,
                  publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null,
                  title: doc['title'],
                  page
                };
              })
            });
          }),
          catchError(error => Observable.of(new ACTIONS.CastlePodcastPageFailureAction({error})))
        );
    })
  );

  @Effect()
  loadNextEpisodePage$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS),
    filter((action: ACTIONS.CastleEpisodePageSuccessAction) => {
      const { page, all, total, episodes} = action.payload;
      return all && page * EPISODE_PAGE_SIZE < total && episodes && episodes.length > 0;
    }),
    map((action: ACTIONS.CastleEpisodePageSuccessAction) => action.payload),
    concatMap((payload: ACTIONS.CastleEpisodePageSuccessPayload) => {
      const { page, all, episodes } = payload;
      return Observable.of(new ACTIONS.CastleEpisodePageLoadAction(
        {podcastId: episodes[0].podcastId, page: page + 1, all}));
    })
  );

  @Effect()
  loadPodcastMetrics$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_METRICS_LOAD),
    map((action: ACTIONS.CastlePodcastMetricsLoadAction) => action.payload),
    switchMap((payload: ACTIONS.CastlePodcastMetricsLoadPayload) => {
      const { id, metricsType, interval, beginDate, endDate } = payload;
      return this.castle.followList('prx:podcast-downloads', {
        id,
        from: beginDate.toISOString(),
        to: endDate.toISOString(),
        interval: interval.value
      }).pipe(
        map(metrics => {
          this.store.dispatch(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'load', value: metrics[0]['downloads'].length}));
          return new ACTIONS.CastlePodcastMetricsSuccessAction({
            id,
            metricsPropertyName: getMetricsProperty(interval, metricsType),
            metrics: metrics[0]['downloads']
          });
        }),
        catchError(error => Observable.of(new ACTIONS.CastlePodcastMetricsFailureAction({id, error})))
      );
    })
  );

  @Effect()
  loadRoutedMetrics$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS),
    filter((action: ACTIONS.CastleEpisodePageSuccessAction) => {
      const { page, episodes } = action.payload;
      return episodes && episodes.length && this.routerParams && this.routerParams.episodePage === page;
    }),
    map((action: ACTIONS.CastleEpisodePageSuccessAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodePageSuccessPayload) => {
      const { episodes } = payload;
      this.store.dispatch(new ACTIONS.CastlePodcastMetricsLoadAction({
        id: episodes[0].podcastId,
        metricsType: this.routerParams.metricsType,
        interval: this.routerParams.interval,
        beginDate: this.routerParams.beginDate,
        endDate: this.routerParams.endDate
      }));
      this.store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsLoadAction({id: episodes[0].podcastId}));
      return episodes.map((episode: Episode) => {
        this.store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsLoadAction({
          podcastId: episode.podcastId,
          guid: episode.guid
        }));
        return new ACTIONS.CastleEpisodeMetricsLoadAction({
          podcastId: episode.podcastId,
          page: episode.page,
          guid: episode.guid,
          metricsType: this.routerParams.metricsType,
          interval: this.routerParams.interval,
          beginDate: this.routerParams.beginDate,
          endDate: this.routerParams.endDate
        });
      });
    })
  );

  @Effect()
  loadEpisodeMetrics$ = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_METRICS_LOAD),
    map((action: ACTIONS.CastleEpisodeMetricsLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodeMetricsLoadPayload) => {
    const { podcastId, page, guid, metricsType, interval, beginDate, endDate } = payload;
      return this.castle.followList('prx:episode-downloads', {
        guid,
        from: beginDate.toISOString(),
        to: endDate.toISOString(),
        interval: interval.value
      }).pipe(
        map(metrics => {
          return new ACTIONS.CastleEpisodeMetricsSuccessAction({
            podcastId,
            page,
            guid,
            metricsPropertyName: getMetricsProperty(interval, metricsType),
            metrics: metrics[0]['downloads']
          });
        }),
        catchError(error => {
          return Observable.of(new ACTIONS.CastleEpisodeMetricsFailureAction({
            podcastId,
            page,
            guid,
            error
          }));
        })
      );
    })
  );

  @Effect()
  loadPodcastPerformanceMetrics$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PERFORMANCE_METRICS_LOAD),
    map((action: ACTIONS.CastlePodcastPerformanceMetricsLoadAction) => action.payload),
    switchMap((payload: ACTIONS.CastlePodcastPerformanceMetricsLoadPayload) => {
    const { id } = payload;
      return this.castle
        .followList('prx:podcast', {id})
        .pipe(
            map(metrics => {
            const { total, previous7days, this7days, yesterday, today } = metrics[0]['downloads'];
            return new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({id, total, previous7days, this7days, yesterday, today});
          }),
          catchError(error => {
            if (error.status === 404) {
              return Observable.of(new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({
                id, total: 0, previous7days: 0, this7days: 0, yesterday: 0, today: 0}));
            } else {
              Observable.of(new ACTIONS.CastlePodcastPerformanceMetricsFailureAction({id, error}));
            }
          })
        );
    })
  );

  @Effect()
  loadEpisodePerformanceMetrics$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PERFORMANCE_METRICS_LOAD),
    map((action: ACTIONS.CastleEpisodePerformanceMetricsLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodePerformanceMetricsLoadPayload) => {
      const { podcastId, guid } = payload;
      return this.castle
        .followList('prx:episode', {guid})
        .pipe(
          map(metrics => {
            const { total, previous7days, this7days, yesterday, today } = metrics[0]['downloads'];
            return new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({podcastId, guid,
              total, previous7days, this7days, yesterday, today});
          }),
          catchError(error => {
            if (error.status === 404) {
              return Observable.of(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({podcastId, guid,
                total: 0, previous7days: 0, this7days: 0, yesterday: 0, today: 0}));
            } else {
              return Observable.of(new ACTIONS.CastleEpisodePerformanceMetricsFailureAction({podcastId, guid, error}));
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
