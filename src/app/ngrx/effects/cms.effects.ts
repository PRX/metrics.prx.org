import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { selectPodcasts } from '../reducers';
import { PodcastModel, EpisodeModel } from '../model';
import { CmsPodcastsSuccessAction, CmsPodcastsFailureAction, ActionTypes } from '../actions';
import { CmsService, HalDoc } from '../../core';

@Injectable()
export class CmsEffects {
  podcasts: PodcastModel[] = [];

  @Effect()
  loadPodcasts$: Observable<Action> = this.actions$
    .ofType(ActionTypes.CMS_PODCASTS)
    .switchMap(() => {
      // would be great if this worked
      //  * would simplify app.component to just calling this.store.dispatch(new CmsPodcastsAction());
      //  * would provide state management for loading and errors
      // the followItems gets called, but it never returns, no errors on the console or caught exceptions, possibly swallowed error
      // reason this isnt working is that auth is an observable, need to follow
      return this.cms.auth.followItems('prx:series', {per: this.cms.auth.count('prx:series'), filters: 'v4', zoom: 'prx:distributions'})
        .flatMap((docs: HalDoc[]) => {
          const podcasts: PodcastModel[] = docs.map(doc => {
            return {
              doc,
              seriesId: doc['id'],
              title: doc['title']
            };
          });
          const dist$ = podcasts.map(p => this.getPodcastDistribution(p));
          return Observable.forkJoin(...dist$).map(() => new CmsPodcastsSuccessAction({podcasts}));
        })
        .catch(error => Observable.of(new CmsPodcastsFailureAction()));
  });

  constructor(private store: Store<any>,
              private actions$: Actions,
              private cms: CmsService) {
    this.store.select(selectPodcasts).subscribe((podcasts: PodcastModel[]) => {
      this.podcasts = podcasts;
    });
  }

  getPodcastDistribution(podcast: PodcastModel): Observable<{}> {
    return podcast.doc.followItems('prx:distributions')
      .map((docs: HalDoc[]) => {
        return docs.filter((distro: HalDoc) => {
          return distro['kind'] === 'podcast' && distro['url'];
        }).map((distro: HalDoc) => {
          podcast.feederUrl = distro['url'];

          const urlParts = podcast.feederUrl.split('/');
          if (urlParts.length > 1) {
            podcast.feederId = urlParts[urlParts.length - 1];
          }
        });
      });

  }
}
