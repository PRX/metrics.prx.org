import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { first } from 'rxjs/operators/first';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AuthService } from 'ngx-prx-styleguide';
import { CmsService, HalDoc } from '../../core';
import { getColor } from '../../shared/util/chart.util';

import { AccountModel, PodcastModel, EpisodeModel, EPISODE_PAGE_SIZE, RouterParams } from '../';
import { selectPodcastRoute, selectChartedEpisodeIdsRoute } from '../reducers/selectors';
import * as ACTIONS from '../actions';
import * as localStorageUtil from '../../shared/util/local-storage.util';

@Injectable()
export class CmsEffects {
  routedPodcastSeriesId: number;
  routedEpisodeIds: number[];

  @Effect()
  loadAccount$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CMS_ACCOUNT),
    switchMap(() => {
      return this.auth.token.pipe(
        first(),
        mergeMap(token => {
          if (token) {
            if (!this.auth.parseToken(token)) {
              return Observable.of(new ACTIONS.CmsAccountFailureAction({error: 'Permission denied'}));
            } else {
              return this.cms.individualAccount.map(doc => {
                const account: AccountModel = {doc, id: doc.id, name: doc['name']};
                return new ACTIONS.CmsAccountSuccessAction({account});
              });
            }
          } else {
            return Observable.of(new ACTIONS.CmsAccountFailureAction({error: 'You are not logged in'}));
          }
        }),
        catchError(error => Observable.of(new ACTIONS.CmsAccountFailureAction({error})))
      );
    })
  );

  @Effect()
  loadPodcasts$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CMS_PODCASTS),
    switchMap(() => {
      return this.auth.token.first().pipe(
        mergeMap(token => {
          if (token && !this.auth.parseToken(token)) {
            return Observable.of(new ACTIONS.CmsPodcastsFailureAction({error: 'Permission denied'}));
          }
          if (token) {
            return this.cms.auth.mergeMap(auth => {
              const count = auth.count('prx:series');
              if (count === 0) {
                const error = 'Looks like you don\'t have any podcasts.';
                return Observable.of(new ACTIONS.CmsPodcastsFailureAction({error}));
              } else {
                const params = {per: count, filters: 'v4', zoom: 'prx:distributions'};
                return auth.followItems('prx:series', params).mergeMap(docs => {
                  if (docs.length === 0) {
                    const error = 'Looks like you don\'t have any podcasts.';
                    return Observable.of(new ACTIONS.CmsPodcastsFailureAction({error}));
                  } else {
                    return Observable.forkJoin(docs.map(d => this.docToPodcast(d)))
                      .map(podcasts => podcasts.filter(p => p && p.feederId))
                      .map(podcasts => new ACTIONS.CmsPodcastsSuccessAction({podcasts}));
                  }
                });
              }
            });
          } else {
            return Observable.of(new ACTIONS.CmsPodcastsFailureAction({error: 'You are not logged in'}));
          }
        }),
        catchError(error => Observable.of(new ACTIONS.CmsPodcastsFailureAction({error})))
      );
    })
  );

  @Effect({dispatch: false})
  loadPodcastsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CMS_PODCASTS_SUCCESS),
    map((action: ACTIONS.CmsPodcastsSuccessAction) => action.payload),
    switchMap((payload: ACTIONS.CmsPodcastsSuccessPayload) => {
    // only dispatches a routing action when there is not already a routed :seriesId
      if (!this.routedPodcastSeriesId) {
        const {podcasts} = payload;
        const localStorageRouterParams: RouterParams = localStorageUtil.getItem(localStorageUtil.KEY_ROUTER_PARAMS);
        const localStorageSeriesInList = localStorageRouterParams && localStorageRouterParams.podcastSeriesId &&
            podcasts.find(podcast => podcast.seriesId === localStorageRouterParams.podcastSeriesId);
        const localStoragePodcastInList = localStorageRouterParams && localStorageRouterParams.podcastId &&
          podcasts.find(podcast => podcast.feederId === localStorageRouterParams.podcastId);
        this.store.dispatch(new ACTIONS.RoutePodcastAction( {
          // navigate to either the podcastStorageId in localStorage or the first one in the result from CMS (which is the last one changed)
          podcastId: (localStoragePodcastInList && localStorageRouterParams.podcastId) || podcasts[0].feederId,
          podcastSeriesId: (localStorageSeriesInList && localStorageRouterParams.podcastSeriesId) || podcasts[0].seriesId
        }));
      }
      return Observable.of(null);
    })
  );

  @Effect()
  loadMostRecentEpisode$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CMS_RECENT_EPISODE),
    map((action: ACTIONS.CmsRecentEpisodeAction) => action.payload),
    switchMap((payload: ACTIONS.CmsRecentEpisodePayload) => {
      const seriesParams = {id: payload.seriesId, zoom: false};
      const storyParams = {
        per: 1,
        sorts: 'published_at: desc',
        filters: 'v4',
        zoom: 'prx:distributions'
      };
      return this.cms.follow('prx:series', seriesParams).followItems('prx:stories', storyParams).pipe(
        mergeMap(docs => {
        if (docs.length) {
          return this.docToEpisode(docs[0], payload.seriesId).map(episode => {
            return new ACTIONS.CmsRecentEpisodeSuccessAction({episode});
          });
        } else {
          const error = 'Looks like you don\'t have any published episodes';
          return Observable.of(new ACTIONS.CmsRecentEpisodeFailureAction({error}));
        }
        }),
        catchError(error => Observable.of(new ACTIONS.CmsRecentEpisodeFailureAction({error})))
      );
    })
  );

  @Effect()
  loadEpisodes$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CMS_PODCAST_EPISODE_PAGE),
    map((action: ACTIONS.CmsPodcastEpisodePageAction) => action.payload),
    switchMap((payload: ACTIONS.CmsEpisodePagePayload) => {
      const pageNum = payload.page;
      const seriesId = payload.seriesId;
      const seriesParams = {id: seriesId, zoom: false};
      const storyParams = {
        page: pageNum,
        per: EPISODE_PAGE_SIZE,
        sorts: 'published_at: desc',
        filters: 'v4',
        zoom: 'prx:distributions'
      };
      return this.cms.follow('prx:series', seriesParams).followItems('prx:stories', storyParams).pipe(
        mergeMap(docs => {
          if (docs.length) {
            return Observable.forkJoin(docs.map((doc, index) => this.docToEpisode(doc, seriesId, index, pageNum)))
              .map(episodes => episodes.filter(e => e && e.guid))
              .map(episodes => {
                this.chartIncomingEpisodes(episodes);
                return new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes});
              });
          } else {
            return Observable.of(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes: []}));
          }
        }),
        catchError(error => Observable.of(new ACTIONS.CmsPodcastEpisodePageFailureAction({error})))
      );
    })
  );

  constructor(public store: Store<any>,
              private actions$: Actions,
              private auth: AuthService,
              private cms: CmsService) {
    this.store.pipe(select(selectPodcastRoute)).subscribe(podcastSeriesId => {
      this.routedPodcastSeriesId = podcastSeriesId;
    });
    this.store.pipe(select(selectChartedEpisodeIdsRoute)).subscribe(episodes => this.routedEpisodeIds = episodes);
  }

  getEpisodeColor(episodeIndex: number): string {
    return getColor(EPISODE_PAGE_SIZE, episodeIndex);
  }

  // if there are episodes on this page to be charted, put those on the route
  // if there are not episodes on this page to be charted, chart the first 5 via route change
  // with recent changes to reset episode state, the episodes to be charted from the route are
  // chart a single episode or charting episode ids via the url/page refresh/ load from url
  chartIncomingEpisodes(episodes: EpisodeModel[]) {
    if (!this.routedEpisodeIds || this.routedEpisodeIds.length === 0) {
      const episodeIds = episodes.map(e => e.id);
      this.store.dispatch(new ACTIONS.RouteEpisodesChartedAction({episodeIds}));
    }
  }

  private docToPodcast(doc: HalDoc): Observable<PodcastModel> {
    const podcast: PodcastModel = {doc, seriesId: doc['id'], title: doc['title']};
    return this.getDistribution(doc, 'podcast').pipe(
      map(distro => {
        podcast.feederUrl = distro.url;
        podcast.feederId = distro.id;
        return podcast;
      })
    );
  }

  private docToEpisode(doc: HalDoc, seriesId: number, index?: number, pageNum?: number): Observable<EpisodeModel> {
    const episode: EpisodeModel = {
      doc,
      id: doc.id,
      seriesId: seriesId,
      title: doc['title'],
      publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null,
      color: this.getEpisodeColor(index || 0),
      page: pageNum || 1
    };
    return this.getDistribution(doc, 'episode').pipe(
      map(distro => {
        episode.feederUrl = distro.url;
        episode.guid = distro.id;
        return episode;
      })
    );
  }

  private getDistribution(doc: HalDoc, kind: string): Observable<{url: string, id: string}> {
    if (doc.has('prx:distributions') && doc.count('prx:distributions') > 0) {
      return doc.followItems('prx:distributions').pipe(
        map(distros => {
          const distro = distros.find(d => d['kind'] === kind);
          if (distro && distro['url']) {
            const urlParts = distro['url'].split('/');
            const lastPart = urlParts.length > 1 ? urlParts.pop() : null;
            return {url: distro['url'], id: lastPart};
          } else {
            return {url: null, id: null};
          }
        })
      );
    } else {
      return Observable.of({url: null, id: null});
    }
  }

}
