import { Injectable } from '@angular/core';
import { catchError, concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import * as ACTIONS from '../actions';
import * as catalogActions from '../actions/castle-catalog.action.creator';
import { selectPodcastRoute } from '../reducers/selectors';
import { HalDoc, CastleService } from '@app/core';
import { Episode, RouterParams, PODCAST_PAGE_SIZE } from '..';
import * as localStorageUtil from '@app/shared/util/local-storage.util';

@Injectable()
export class CastleCatalogEffects {
  loadUserinfoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.IdUserinfoSuccess),
      switchMap(() => {
        return of(catalogActions.CastlePodcastPageLoad({ page: 1, all: true }));
      })
    )
  );

  // basic - load > success/failure podcast page
  loadPodcastPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.CastlePodcastPageLoad),
      concatMap(action => {
        const { page, all } = action;
        return this.castle.followItems('prx:podcasts', { page, per: PODCAST_PAGE_SIZE }).pipe(
          map((results: HalDoc[]) => {
            if (!results.length) {
              const error = `Looks like you don't have any podcasts.`;
              return catalogActions.CastlePodcastPageFailure({ error });
            } else {
              return catalogActions.CastlePodcastPageSuccess({
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
            }
          }),
          catchError(error => of(catalogActions.CastlePodcastPageFailure({ error })))
        );
      })
    )
  );

  // on podcast page success if not already routed to a podcast,
  // check for podcast id on local storage or use first podcast id in list and route to it
  loadPodcastsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.CastlePodcastPageSuccess),
      withLatestFrom(this.store.pipe(select(selectPodcastRoute))),
      // only dispatches a routing action when there is not already a routed :podcastId
      filter(([action, podcastId]) => !podcastId),
      switchMap(([action]) => {
        const { podcasts } = action;
        const localStorageRouterParams: RouterParams = localStorageUtil.getItem(localStorageUtil.KEY_ROUTER_PARAMS);
        const localStoragePodcastInList =
          localStorageRouterParams &&
          localStorageRouterParams.podcastId &&
          podcasts.find(podcast => podcast.id === localStorageRouterParams.podcastId);
        return of(
          ACTIONS.RoutePodcast({
            // navigate to either the podcastStorageId in localStorage
            //  or the first one in the result from CMS (which is the last one changed)
            podcastId: (localStoragePodcastInList && localStorageRouterParams.podcastId) || podcasts[0].id
          })
        );
      })
    )
  );

  // on podcast page success if loading all podcast pages and not yet finished, load next page
  loadNextPodcastPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.CastlePodcastPageSuccess),
      filter(action => {
        const { page, all, total } = action;
        return all && page * PODCAST_PAGE_SIZE < total;
      }),
      concatMap(action => {
        const { page, all } = action;
        return of(ACTIONS.CastlePodcastPageLoad({ page: page + 1, all }));
      })
    )
  );

  // basic - load > success/failure episode page
  loadEpisodePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.CastleEpisodePageLoad, catalogActions.CastleEpisodeSelectPageLoad),
      concatMap(action => {
        const { podcastId, page, per, search } = action;
        return this.castle
          .follow('prx:podcast', { id: podcastId })
          .followItems('prx:episodes', { page, per, ...(search && { search }) })
          .pipe(
            map((results: HalDoc[]) => {
              const successAction =
                action.type === ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_LOAD
                  ? 'CastleEpisodePageSuccess'
                  : 'CastleEpisodeSelectPageSuccess';
              return ACTIONS[successAction]({
                page,
                per,
                total: results && results.length ? results[0].total() : 0,
                ...(search && { search }), // conditionally adds search property if defined
                episodes: results.map(
                  (doc): Episode => {
                    return {
                      guid: '' + doc['id'],
                      podcastId,
                      publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null,
                      title: doc['title'],
                      page
                    };
                  }
                )
              });
            }),
            catchError(error => {
              const failAction =
                action.type === ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_LOAD
                  ? 'CastleEpisodePageFailure'
                  : 'CastleEpisodeSelectPageFailure';
              return of(ACTIONS[failAction]({ error }));
            })
          );
      })
    )
  );

  constructor(private actions$: Actions, private castle: CastleService, private store: Store<any>) {}
}
