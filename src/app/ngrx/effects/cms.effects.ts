import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { selectEpisodeMetrics, EpisodeModel, EPISODE_PAGE_SIZE } from '../reducers';
import { EpisodeMetricsModel } from '../model';
import { CmsPodcastEpisodePageAction, CmsEpisodePagePayload,
  CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction,
  CastleEpisodeChartToggleAction, ActionTypes } from '../actions';
import { CmsService, HalDoc } from '../../core';

@Injectable()
export class CmsEffects {
  episodeMetrics: EpisodeMetricsModel[] = [];

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
            const episodes: EpisodeModel[] = docs.map((doc, i) => {
              const episode = {
                doc,
                id: doc['id'],
                seriesId: payload.podcast.seriesId,
                title: doc['title'],
                publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null,
                page: payload.page
              };
              const epMetrics = this.episodeMetrics.find(e => e.id === doc['id']);
              const charted = (!epMetrics || epMetrics.charted === undefined) && i < 5;
              if (charted) {
                this.store.dispatch(new CastleEpisodeChartToggleAction({id: episode.id, seriesId: episode.seriesId, charted: true}));
              }
              return episode;
            });
            const dist$ = episodes.map(e => this.getEpisodePodcastDistribution(e));
            return Observable.forkJoin(...dist$).map(() => new CmsPodcastEpisodePageSuccessAction({episodes}));
          })
          .catch(error => Observable.of(new CmsPodcastEpisodePageFailureAction(error)));
      });
    });

  constructor(private store: Store<any>,
              private actions$: Actions,
              private cms: CmsService) {
    this.store.select(selectEpisodeMetrics).subscribe((episodeMetrics: EpisodeMetricsModel[]) => {
      this.episodeMetrics = episodeMetrics;
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
}
