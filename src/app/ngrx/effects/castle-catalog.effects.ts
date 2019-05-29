import { Injectable } from '@angular/core';
import { catchError, concatMap, filter, map, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { selectRouter } from '../reducers/selectors';
import { HalDoc, CastleService } from '@app/core';
import {
  Episode, RouterParams,
  PODCAST_PAGE_SIZE
} from '..';
import * as localStorageUtil from '@app/shared/util/local-storage.util';

@Injectable()
export class CastleCatalogEffects {
  routerParams: RouterParams;

  @Effect()
  loadUserinfoSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.ID_USERINFO_SUCCESS),
    switchMap(() => {
      return of(new ACTIONS.CastlePodcastPageLoadAction({page: 1, all: true}));
    })
  );

  // basic - load > success/failure podcast page
  @Effect()
  loadPodcastPage$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PAGE_LOAD),
    map((action: ACTIONS.CastlePodcastPageLoadAction) => action.payload),
    concatMap((payload: ACTIONS.CastlePodcastPageLoadPayload) => {
      const { page, all } = payload;
      return this.castle.followItems('prx:podcasts', { page, per: PODCAST_PAGE_SIZE })
      .pipe(
        map((results: HalDoc[]) => {
          if (!results.length) {
            const error = 'Looks like you don\'t have any podcasts.';
            return new ACTIONS.CastlePodcastPageFailureAction({error});
          } else {
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
          }
        }),
        catchError(error => of(new ACTIONS.CastlePodcastPageFailureAction({error})))
      );
    })
  );

  // on podcast page success if not already routed to a podcast,
  // check for podcast id on local storage or use first podcast id in list and route to it
  @Effect()
  loadPodcastsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS),
    // only dispatches a routing action when there is not already a routed :podcastId
    filter(() => !this.routerParams.podcastId),
    map((action: ACTIONS.CastlePodcastPageSuccessAction) => action.payload),
    switchMap((payload: ACTIONS.CastlePodcastPageSuccessPayload) => {
      const { podcasts } = payload;
      const localStorageRouterParams: RouterParams = localStorageUtil.getItem(localStorageUtil.KEY_ROUTER_PARAMS);
      const localStoragePodcastInList = localStorageRouterParams && localStorageRouterParams.podcastId &&
        podcasts.find(podcast => podcast.id === localStorageRouterParams.podcastId);
      return of(new ACTIONS.RoutePodcastAction( {
        // navigate to either the podcastStorageId in localStorage or the first one in the result from CMS (which is the last one changed)
        podcastId: (localStoragePodcastInList && localStorageRouterParams.podcastId) || podcasts[0].id
      }));
    })
  );

  // on podcast page success if loading all podcast pages and not yet finished, load next page
  @Effect()
  loadNextPodcastPage$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS),
    filter((action: ACTIONS.CastlePodcastPageSuccessAction) => {
      const { page, all, total } = action.payload;
      return all && page * PODCAST_PAGE_SIZE < total;
    }),
    map((action: ACTIONS.CastlePodcastPageSuccessAction) => action.payload),
    concatMap((payload: ACTIONS.CastlePodcastPageSuccessPayload) => {
      const { page, all } = payload;
      return of(new ACTIONS.CastlePodcastPageLoadAction({page: page + 1, all}));
    })
  );

  // basic - load > success/failure episode page
  @Effect()
  loadEpisodePage$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_LOAD, ACTIONS.ActionTypes.CASTLE_EPISODE_SELECT_PAGE_LOAD),
    concatMap((action: ACTIONS.CastleEpisodePageLoadAction | ACTIONS.CastleEpisodeSelectPageLoadAction) => {
      const { podcastId, page, per, search } = action.payload;
      return this.castle.follow('prx:podcast', {id: podcastId}).followItems('prx:episodes', { page, per, ...(search && {search}) })
        .pipe(
          map((results: HalDoc[]) => {
            const successAction = action.type === ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_LOAD ?
            'CastleEpisodePageSuccessAction' : 'CastleEpisodeSelectPageSuccessAction';
            return new ACTIONS[successAction]({
              page,
              per,
              total: results && results.length ? results[0].total() : 0,
              ...(search && {search}), // conditionally adds search property if defined
              episodes: results.map((doc): Episode => {
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
          catchError(error => {
            const failAction = action.type === ACTIONS.ActionTypes.CASTLE_EPISODE_PAGE_LOAD ?
            'CastleEpisodePageFailureAction' : 'CastleEpisodeSelectPageFailureAction';
            return of(new ACTIONS[failAction]({error}));
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
