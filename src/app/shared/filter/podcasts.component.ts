import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectPodcastFilter, selectPodcasts } from '../../ngrx/reducers';
import { PodcastModel } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-podcasts',
  template: `
    <prx-select *ngIf="allPodcastOptions.length > 1"
                single="true" searchable="true"
                [options]="allPodcastOptions" [selected]="selectedPodcast" (onSelect)="onPodcastChange($event)">
    </prx-select>
    <span *ngIf="allPodcastOptions.length === 1 && selectedPodcast">{{ selectedPodcast.title }}</span>
  `
})
export class PodcastsComponent implements OnInit, OnDestroy {
  podcastFilterSubscription: Subscription;
  podcastsSubscription: Subscription;
  selectedPodcast: PodcastModel;
  allPodcastOptions = [];

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.podcastFilterSubscription = this.store.select(selectPodcastFilter).subscribe((filteredPodcast: PodcastModel) => {
      this.selectedPodcast = filteredPodcast;
    });
    this.podcastsSubscription = this.store.select(selectPodcasts).subscribe((allPodcasts: PodcastModel[]) => {
      this.allPodcastOptions = allPodcasts.map((podcast: PodcastModel) => [podcast.title, podcast]);
    });
  }

  ngOnDestroy() {
    if (this.podcastFilterSubscription) { this.podcastFilterSubscription.unsubscribe(); }
    if (this.podcastsSubscription) { this.podcastsSubscription.unsubscribe(); }
  }

  onPodcastChange(val) {
    if (val && val.seriesId !== this.selectedPodcast.seriesId) {
      this.store.dispatch(new CastleFilterAction({filter: {podcast: val, episodes: []}}));
    }
  }
}
