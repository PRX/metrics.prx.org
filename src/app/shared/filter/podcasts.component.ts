import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectPodcastFilter, selectPodcasts, selectIntervalFilter, PodcastModel } from '../../ngrx/reducers';
import { IntervalModel } from '../../ngrx/model';

@Component({
  selector: 'metrics-podcasts',
  template: `
    <prx-select *ngIf="allPodcastOptions?.length > 1"
                single="true" searchable="true"
                [options]="allPodcastOptions" [selected]="selectedPodcast" (onSelect)="onPodcastChange($event)">
    </prx-select>
    <span *ngIf="allPodcastOptions?.length === 1 && selectedPodcast">{{ selectedPodcast.title }}</span>
  `
})
export class PodcastsComponent implements OnInit, OnDestroy {
  podcastFilterSubscription: Subscription;
  intervalFilterSubscription: Subscription;
  podcastsSubscription: Subscription;
  selectedPodcastSeriesId: number;
  selectedPodcast: PodcastModel;
  selectedInterval: IntervalModel;
  allPodcastOptions = [];

  constructor(public store: Store<any>,
              private router: Router) {}

  ngOnInit() {
    this.podcastFilterSubscription = this.store.select(selectPodcastFilter).subscribe((selectedPodcastSeriesId: number) => {
      this.selectedPodcastSeriesId = selectedPodcastSeriesId;
      this.selectedPodcast = this.allPodcastOptions.map(o => o[1]).find(p => p.seriesId === this.selectedPodcastSeriesId);
    });
    this.intervalFilterSubscription = this.store.select(selectIntervalFilter).subscribe((interval: IntervalModel) => {
      this.selectedInterval = interval;
    });
    this.podcastsSubscription = this.store.select(selectPodcasts).subscribe((allPodcasts: PodcastModel[]) => {
      if (allPodcasts && allPodcasts.length) {
        this.allPodcastOptions = allPodcasts.map((podcast: PodcastModel) => [podcast.title, podcast]);
        this.selectedPodcast = allPodcasts.find(p => p.seriesId === this.selectedPodcastSeriesId);
      }
    });
  }

  ngOnDestroy() {
    if (this.podcastFilterSubscription) { this.podcastFilterSubscription.unsubscribe(); }
    if (this.intervalFilterSubscription) { this.intervalFilterSubscription.unsubscribe(); }
    if (this.podcastsSubscription) { this.podcastsSubscription.unsubscribe(); }
  }

  onPodcastChange(val) {
    if (val && val.seriesId !== this.selectedPodcast.seriesId) {
      this.router.navigate([val.seriesId, 'downloads', this.selectedInterval.key]);
    }
  }
}
