import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Angulartics2 } from 'angulartics2';
import { ActionTypes, GoogleAnalyticsEventAction } from '../actions';
import { Podcast, RouterParams } from '../';
import { selectAllPodcasts, selectRouter } from '../reducers/selectors';

@Injectable()
export class GoogleAnalyticsEffects {
  podcasts: Podcast[];
  routerParams: RouterParams;

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
        if (this.routerParams && this.routerParams.interval) {
          event['category'] = 'Downloads/' + this.routerParams.interval.name;
        }
      }
      if (action.payload.label) {
        event['label'] = action.payload.label;
      } else {
        if (this.routerParams && this.routerParams.podcastId && this.podcasts) {
          const podcast = this.podcasts.find(p => p.id === this.routerParams.podcastId);
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
    this.store.pipe(select(selectAllPodcasts)).subscribe(podcasts => {
      this.podcasts = podcasts;
    });
    this.store.pipe(select(selectRouter)).subscribe(routerParams => {
      this.routerParams = routerParams;
    });
  }
}
