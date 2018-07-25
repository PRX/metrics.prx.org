import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Podcast } from '../../ngrx';
import { selectAllPodcasts, selectRoutedPodcast } from '../../ngrx/reducers/selectors';
import { RoutePodcastAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-podcast-nav',
  template: `
    <metrics-podcast-dropdown
      [selectedPodcast]="selectedPodcast$ | async"
      [podcasts]="podcasts$ | async"
      (podcastChange)="onPodcastChange($event)"></metrics-podcast-dropdown>
  `
})
export class PodcastNavComponent {
  selectedPodcast$: Observable<Podcast>;
  podcasts$: Observable<Podcast[]>;

  constructor(private store: Store<any>) {
    this.podcasts$ = this.store.pipe(select(selectAllPodcasts));
    this.selectedPodcast$ = this.store.pipe(select(selectRoutedPodcast));
  }

  onPodcastChange(val: Podcast) {
    this.store.dispatch(new RoutePodcastAction({
      podcastId: val.id,
      podcastSeriesId: 0 // TODO
    }));
  }
}
