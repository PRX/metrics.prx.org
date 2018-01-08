import { Injectable } from '@angular/core';
import { Router, Params, RoutesRecognized } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { AuthService } from 'ngx-prx-styleguide';
import { CmsService, HalDoc } from '../../core';
import { getColor } from '../../shared/util/chart.util';

import { AccountModel, PodcastModel, EpisodeModel, EPISODE_PAGE_SIZE, EpisodeMetricsModel } from '../';
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
      return this.cms.individualAccount.map(doc => {
        if (doc) {
          const account: AccountModel = {doc, id: doc.id, name: doc['name']};
          return new ACTIONS.CmsAccountSuccessAction({account});
        } else {
          return new ACTIONS.CmsAccountFailureAction({error: 'You are not logged in'});
        }
      }).catch(error => Observable.of(new ACTIONS.CmsAccountFailureAction({error})));
    });

  @Effect()
  loadPodcasts$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CMS_PODCASTS)
    .switchMap(() => {
      return this.cms.auth.mergeMap(auth => {
        const count = auth.count('prx:series');
        if (count === 0) {
          const error = 'Looks like you don\'t have any podcasts.';
          return Observable.of(new ACTIONS.CmsPodcastsFailureAction({error}));
        } else {
          const params = {per: count, filters: 'v4', zoom: 'prx:distributions'};
          return auth.followItems('prx:series', params).mergeMap((docs: HalDoc[]) => {
            return Observable.forkJoin(docs.map(d => this.docToPodcast(d)))
              .map(podcasts => podcasts.filter(p => p && p.feederId))
              .map(podcasts => new ACTIONS.CmsPodcastsSuccessAction({podcasts}));
          });
        }
      }).catch(error => Observable.of(new ACTIONS.CmsPodcastsFailureAction({error})));
    });

  @Effect()
  loadEpisodes$: Observable<Action> = this.actions$
    .ofType(ACTIONS.ActionTypes.CMS_PODCAST_EPISODE_PAGE)
    .map((action: ACTIONS.CmsPodcastEpisodePageAction) => action.payload)
    .switchMap((payload: ACTIONS.CmsEpisodePagePayload) => {
      return this.cms.follow('prx:series', {id: payload.podcast.seriesId})
        .flatMap((series: HalDoc) => {
          return series.followItems('prx:stories', {
            page: payload.page,
            per: EPISODE_PAGE_SIZE,
            sorts: 'published_at: desc',
            filters: 'v4',
            zoom: 'prx:distributions'})
          .flatMap((docs: HalDoc[]) => {
            const chartedEpisodes = this.episodeMetrics.filter(e => e.charted).map(e => e.id);
            // if none of the incoming episodes are already on the route, we want to add the first 5
            const chartIncomingEpisodes = chartedEpisodes.filter(id => docs.map(doc => doc['id']).indexOf(id) !== -1).length === 0;
            const episodes: EpisodeModel[] = docs.map((doc, i) => {
              const episode = {
                doc,
                id: doc['id'],
                seriesId: payload.podcast.seriesId,
                title: doc['title'],
                publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null,
                color: getColor(EPISODE_PAGE_SIZE, i),
                page: payload.page
              };
              if (chartIncomingEpisodes && i < 5) {
                chartedEpisodes.push(episode.id);
              }
              return episode;
            });
            this.routeWithEpisodeCharted(chartedEpisodes);
            const dist$ = episodes.map(e => this.getEpisodePodcastDistribution(e));
            return Observable.forkJoin(...dist$).map(() => new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes}));
          })
          .catch(error => Observable.of(new ACTIONS.CmsPodcastEpisodePageFailureAction({error})));
      });
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

  getEpisodePodcastDistribution(episode: EpisodeModel): Observable<{}> {
    return episode.doc.followItems('prx:distributions').map((docs: HalDoc[]) => {
      return docs.filter((doc => doc['kind'] === 'episode' && doc['url']))
        .map((distro: HalDoc) => {
          episode.feederUrl = distro['url'];
          const urlParts = episode.feederUrl.split('/');
          if (urlParts.length > 1) {
            episode.guid = urlParts[urlParts.length - 1];
          }
        });
    });
  }

  routeWithEpisodeCharted(episodeIds: number[]) {
    const params = {};
    Object.keys(this.routeParams).forEach(key => {
      if (key !== 'seriesId' && key !== 'interval') {
        params[key] = this.routeParams[key];
      }
    });
    params['episodes'] = episodeIds.join(',');
    this.router.navigate([this.routeParams['seriesId'], 'downloads', this.routeParams['interval'], params]);
  }

  private docToPodcast(doc: HalDoc): Observable<PodcastModel> {
    const podcast: PodcastModel = {doc, seriesId: doc['id'], title: doc['title']};
    return doc.followItems('prx:distributions').map(distros => {
      const podcastDistro = distros.find(d => d['kind'] === 'podcast');
      if (podcastDistro && podcastDistro['url']) {
        podcast.feederUrl = podcastDistro['url'];
        const urlParts = podcast.feederUrl.split('/');
        if (urlParts.length > 1) {
          podcast.feederId = urlParts[urlParts.length - 1];
        }
      }
      return podcast;
    });
  }
}
