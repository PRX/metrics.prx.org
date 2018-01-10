import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { PodcastModel, IntervalModel, FilterModel, ChartType } from '../../ngrx';
import { selectFilter, selectPodcasts } from '../../ngrx/reducers';

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
  filterSub: Subscription;
  podcastsSub: Subscription;
  selectedPodcastSeriesId: number;
  selectedPodcast: PodcastModel;
  selectedInterval: IntervalModel;
  selectedChartType: ChartType;
  allPodcastOptions = [];

  constructor(public store: Store<any>,
              private router: Router) {}

  ngOnInit() {
    this.filterSub = this.store.select(selectFilter).subscribe((filter: FilterModel) => {
      this.selectedPodcastSeriesId = filter.podcastSeriesId;
      this.selectedPodcast = this.allPodcastOptions.map(o => o[1]).find(p => p.seriesId === this.selectedPodcastSeriesId);
      this.selectedInterval = filter.interval;
      this.selectedChartType = filter.chartType;
    });
    this.podcastsSub = this.store.select(selectPodcasts).subscribe((allPodcasts: PodcastModel[]) => {
      if (allPodcasts && allPodcasts.length) {
        this.allPodcastOptions = allPodcasts.map((podcast: PodcastModel) => [podcast.title, podcast]);
        this.selectedPodcast = allPodcasts.find(p => p.seriesId === this.selectedPodcastSeriesId);
      }
    });
  }

  ngOnDestroy() {
    if (this.filterSub) { this.filterSub.unsubscribe(); }
    if (this.podcastsSub) { this.podcastsSub.unsubscribe(); }
  }

  onPodcastChange(val) {
    if (val && val.seriesId !== this.selectedPodcast.seriesId) {
      this.router.navigate([val.seriesId, 'downloads', this.selectedChartType, this.selectedInterval.key]);
    }
  }
}
