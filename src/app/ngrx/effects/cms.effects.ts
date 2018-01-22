import { Injectable } from '@angular/core';
import { Router, Params, RoutesRecognized } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { AuthService } from 'ngx-prx-styleguide';
import { CmsService, HalDoc } from '../../core';
import { getColor } from '../../shared/util/chart.util';

import { AccountModel, PodcastModel, EpisodeModel, EPISODE_PAGE_SIZE, EpisodeMetricsModel,
  CHARTTYPE_PODCAST, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../';
import { selectEpisodeMetrics } from '../reducers';
import * as ACTIONS from '../actions';

@Injectable()
export class CmsEffects {
  episodeMetrics: EpisodeMetricsModel[] = [];
  routeParams: Params;

  @Effect()
  loadAccount$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CMS_ACCOUNT)
    .switchMap(() => {
      return this.auth.token.first().mergeMap(token => {
        if (token) {
          return this.cms.individualAccount.map(doc => {
            const account: AccountModel = {doc, id: doc.id, name: doc['name']};
            return new ACTIONS.CmsAccountSuccessAction({account});
          });
        } else {
          return Observable.of(new ACTIONS.CmsAccountFailureAction({error: 'You are not logged in'}));
        }
      }).catch(error => Observable.of(new ACTIONS.CmsAccountFailureAction({error})));
    });

  @Effect()
  loadPodcasts$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CMS_PODCASTS)
    .switchMap(() => {
      return this.auth.token.first().mergeMap(token => {
        if (token) {
          return this.cms.auth.mergeMap(auth => {
            const count = auth.count('prx:series');
            if (count === 0) {
              const error = 'Looks like you don\'t have any podcasts.';
              return Observable.of(new ACTIONS.CmsPodcastsFailureAction({error}));
            } else {
              const params = {per: count, filters: 'v4', zoom: 'prx:distributions'};
              return auth.followItems('prx:series', params).mergeMap(docs => {
                if (!this.routeParams || !this.routeParams['seriesId']) {
                  // Default select the first podcast by navigating to it. (It'll be the last one that was updated)
                  this.router.navigate([docs[0]['id'], METRICSTYPE_DOWNLOADS, CHARTTYPE_PODCAST, INTERVAL_DAILY.key]);
                }

                return Observable.forkJoin(docs.map(d => this.docToPodcast(d)))
                  .map(podcasts => podcasts.filter(p => p && p.feederId))
                  .map(podcasts => new ACTIONS.CmsPodcastsSuccessAction({podcasts}));
              });
            }
          });
        } else {
          return Observable.of(new ACTIONS.CmsPodcastsFailureAction({error: 'You are not logged in'}));
        }
      }).catch(error => Observable.of(new ACTIONS.CmsPodcastsFailureAction({error})));
    });

  @Effect()
  loadEpisodes$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CMS_PODCAST_EPISODE_PAGE)
    .map((action: ACTIONS.CmsPodcastEpisodePageAction) => action.payload)
    .switchMap((payload: ACTIONS.CmsEpisodePagePayload) => {
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
      return this.cms.follow('prx:series', seriesParams).followItems('prx:stories', storyParams).mergeMap(docs => {
        return Observable.forkJoin(docs.map((doc, index) => this.docToEpisode(doc, seriesId, index, pageNum)))
          .map(episodes => episodes.filter(e => e && e.guid))
          .map(episodes => {
            this.chartIncomingEpisodes(episodes);
            return new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes});
          });
      }).catch(error => Observable.of(new ACTIONS.CmsPodcastEpisodePageFailureAction({error})));
    });

  constructor(public store: Store<any>,
              private actions$: Actions,
              private auth: AuthService,
              private cms: CmsService,
              private router: Router) {
    this.store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      this.episodeMetrics = episodeMetrics;
    });
    // subscribing to ActivateRoute doesn't seem to work here, so I'm looking for the router events to get params
    router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        this.routeParams = data.state.root.firstChild.params; // ActivatedRoute params equiv
      }
    });
  }

  getEpisodeColor(episodeIndex: number): string {
    return getColor(EPISODE_PAGE_SIZE, episodeIndex);
  }

  // if none of the incoming episodes are already on the route, we want to add the first 5
  chartIncomingEpisodes(episodes: EpisodeModel[]) {
    const incomingIds = episodes.map(e => e.id);
    const chartedIds = this.episodeMetrics.filter(e => e.charted).map(e => e.id);
    if (incomingIds.every(id => chartedIds.indexOf(id) === -1)) {
      this.routeWithEpisodeCharted(chartedIds.concat(incomingIds.slice(0, 5)));
    }
  }

  routeWithEpisodeCharted(episodeIds: number[]) {
    const params = {};
    Object.keys(this.routeParams).forEach(key => {
      if (key !== 'seriesId' && key !== 'interval' && key !== 'chartType') {
        params[key] = this.routeParams[key];
      }
    });
    params['episodes'] = episodeIds.join(',');
    this.router.navigate([this.routeParams['seriesId'], 'downloads', this.routeParams['chartType'], this.routeParams['interval'], params]);
  }

  private docToPodcast(doc: HalDoc): Observable<PodcastModel> {
    const podcast: PodcastModel = {doc, seriesId: doc['id'], title: doc['title']};
    return this.getDistribution(doc, 'podcast').map(distro => {
      podcast.feederUrl = distro.url;
      podcast.feederId = distro.id;
      return podcast;
    });
  }

  private docToEpisode(doc: HalDoc, seriesId: number, index, pageNum: number): Observable<EpisodeModel> {
    const episode: EpisodeModel = {
      doc,
      id: doc.id,
      seriesId: seriesId,
      title: doc['title'],
      publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null,
      color: this.getEpisodeColor(index),
      page: pageNum
    };
    return this.getDistribution(doc, 'episode').map(distro => {
      episode.feederUrl = distro.url;
      episode.guid = distro.id;
      return episode;
    });
  }

  private getDistribution(doc: HalDoc, kind: string): Observable<{url: string, id: string}> {
    if (doc.has('prx:distributions') && doc.count('prx:distributions') > 0) {
      return doc.followItems('prx:distributions').map(distros => {
        const distro = distros.find(d => d['kind'] === kind);
        if (distro && distro['url']) {
          const urlParts = distro['url'].split('/');
          const lastPart = urlParts.length > 1 ? urlParts.pop() : null;
          return {url: distro['url'], id: lastPart};
        } else {
          return {url: null, id: null};
        }
      });
    } else {
      return Observable.of({url: null, id: null});
    }
  }

}
