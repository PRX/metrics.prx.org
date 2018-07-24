import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PodcastModel } from '../../ngrx';
import { selectPodcasts, selectSelectedPodcast } from '../../ngrx/reducers/selectors';
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
  selectedPodcast$: Observable<PodcastModel>;
  podcasts$: Observable<PodcastModel[]>;

  constructor(private store: Store<any>) {
    this.podcasts$ = this.store.pipe(select(selectPodcasts));
    this.selectedPodcast$ = this.store.pipe(select(selectSelectedPodcast));
  }

  onPodcastChange(val: PodcastModel) {
    this.store.dispatch(new RoutePodcastAction({
      podcastId: val.feederId,
      podcastSeriesId: val.seriesId
    }));
  }
}
