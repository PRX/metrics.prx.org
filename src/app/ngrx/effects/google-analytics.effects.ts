import { Injectable } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Angulartics2 } from 'angulartics2';
import { ActionTypes, GoogleAnalyticsEventAction } from '../actions';
import { selectPodcasts, selectFilter } from '../reducers';
import { PodcastModel, FilterModel } from '../model';

@Injectable()
export class GoogleAnalyticsEffects {
  podcasts: PodcastModel[];
  filter: FilterModel;

  @Effect({dispatch: false})
  fromGAEvent$: Observable<Action> = this.actions$
    .ofType(ActionTypes.GOOGLE_ANALYTICS_EVENT)
    .map((action: GoogleAnalyticsEventAction) => {
      const event = {
        action: action.payload.gaAction
      };
      if (action.payload.category) {
        event['category'] = action.payload.category;
      } else {
        if (this.filter && this.filter.interval) {
          event['category'] = 'Downloads/' + this.filter.interval.name;
        }
      }
      if (action.payload.label) {
        event['label'] = action.payload.label;
      } else {
        if (this.filter && this.filter.podcastSeriesId && this.podcasts) {
          const podcast = this.podcasts.find(p => p.seriesId === this.filter.podcastSeriesId);
          if (podcast) {
            event['label'] = podcast.title;
          }
        }
      }
      if (action.payload.value) {
        event['value'] = action.payload.value;
      }
      this.angulartics2.eventTrack.next(event);

      // return action; hmmm, don't return the same action, infinite loop Effect if it gets dispatched (NOTE: {dispatch: false} above)
      return {type: ''}; // noop
    });

  constructor(private actions$: Actions,
              public angulartics2: Angulartics2,
              public store: Store<any>) {
    this.store.select(selectPodcasts).subscribe(podcasts => {
      this.podcasts = podcasts;
    });
    this.store.select(selectFilter).subscribe(filter => {
      this.filter = filter;
    });
  }
}
