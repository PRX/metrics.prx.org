import { Injectable } from '@angular/core';
import { map, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Angulartics2 } from 'angulartics2';
import { GoogleAnalyticsEvent } from '../actions';
import { selectIntervalRoute, selectPodcastRoute, selectAllPodcasts } from '../reducers/selectors';

@Injectable()
export class GoogleAnalyticsEffects {
  fromGAEvent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GoogleAnalyticsEvent),
        withLatestFrom(
          this.store.pipe(select(selectIntervalRoute)),
          this.store.pipe(select(selectPodcastRoute)),
          this.store.pipe(select(selectAllPodcasts))
        ),
        map(([action, interval, podcastId, podcasts]) => {
          const { gaAction, value } = action;
          let { category, label } = action;
          if (!category && interval) {
            category = `Downloads/${interval.name}`;
          }
          if (!label && podcastId && podcasts) {
            const podcast = podcasts.find(p => p.id === podcastId);
            label = podcast.title;
          }
          const event = {
            action: gaAction,
            ...(category && { category }),
            ...(label && { label }),
            ...(value && { value })
          };
          this.angulartics2.eventTrack.next(event);
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, public angulartics2: Angulartics2, public store: Store<any>) {}
}
