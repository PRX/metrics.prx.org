import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Angulartics2 } from 'angulartics2';
import { ActionTypes, GoogleAnalyticsEventAction } from '../actions';
import { PodcastModel, RouterModel } from '../';
import { selectPodcasts, selectRouter } from '../reducers/selectors';

@Injectable()
export class GoogleAnalyticsEffects {
  podcasts: PodcastModel[];
  routerState: RouterModel;

  @Effect({dispatch: false})
  fromGAEvent$: Observable<void> = this.actions$.pipe(
    ofType(ActionTypes.GOOGLE_ANALYTICS_EVENT),
    map((action: GoogleAnalyticsEventAction) => {
      const event = {
        action: action.payload.gaAction
      };
      if (action.payload.category) {
        event['category'] = action.payload.category;
      } else {
        if (this.routerState && this.routerState.interval) {
          event['category'] = 'Downloads/' + this.routerState.interval.name;
        }
      }
      if (action.payload.label) {
        event['label'] = action.payload.label;
      } else {
        if (this.routerState && this.routerState.podcastSeriesId && this.podcasts) {
          const podcast = this.podcasts.find(p => p.seriesId === this.routerState.podcastSeriesId);
          if (podcast) {
            event['label'] = podcast.title;
          }
        }
      }
      if (action.payload.value) {
        event['value'] = action.payload.value;
      }
      this.angulartics2.eventTrack.next(event);
    })
  );

  constructor(private actions$: Actions,
              public angulartics2: Angulartics2,
              public store: Store<any>) {
    this.store.pipe(select(selectPodcasts)).subscribe(podcasts => {
      this.podcasts = podcasts;
    });
    this.store.pipe(select(selectRouter)).subscribe(routerState => {
      this.routerState = routerState;
    });
  }
}
