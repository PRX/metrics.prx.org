import { Injectable } from '@angular/core';
import { Router, Params, RoutesRecognized } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { EpisodeModel, EPISODE_PAGE_SIZE, EpisodeMetricsModel } from '../';
import { selectEpisodeMetrics } from '../reducers';
import { CmsPodcastEpisodePageAction, CmsEpisodePagePayload,
  CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction, ActionTypes } from '../actions';
import { getColor, getShade } from '../../shared/util/chart.util';
import { CmsService, HalDoc } from '../../core';

@Injectable()
export class CmsEffects {
  episodeMetrics: EpisodeMetricsModel[] = [];
  routeParams: Params;

  @Effect()
  loadEpisodes$: Observable<Action> = this.actions$
    .ofType(ActionTypes.CMS_PODCAST_EPISODE_PAGE)
    .map((action: CmsPodcastEpisodePageAction) => action.payload)
    .switchMap((payload: CmsEpisodePagePayload) => {
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
            return Observable.forkJoin(...dist$).map(() => new CmsPodcastEpisodePageSuccessAction({episodes}));
          })
          .catch(error => Observable.of(new CmsPodcastEpisodePageFailureAction({error})));
      });
    });

  constructor(public store: Store<any>,
              private actions$: Actions,
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
}
