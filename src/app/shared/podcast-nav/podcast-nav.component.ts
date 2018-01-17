import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PodcastModel, IntervalModel, FilterModel, ChartType } from '../../ngrx';
import { selectFilter, selectPodcasts, selectSelectedPodcast } from '../../ngrx/reducers';

@Component({
  selector: 'metrics-podcast-nav',
  template: `
    <metrics-podcast-dropdown
      [selectedPodcast]="selectedPodcast$ | async"
      [podcasts]="podcasts$ | async"
      (podcastChange)="onPodcastChange($event)"></metrics-podcast-dropdown>
  `,
  styleUrls: ['../menu/dropdown.css', './podcast-nav-dropdown.component.css']
})
export class PodcastNavComponent implements OnInit, OnDestroy {
  filterSub: Subscription;
  selectedInterval: IntervalModel;
  selectedChartType: ChartType;
  selectedPodcast$: Observable<PodcastModel>;
  podcasts$: Observable<PodcastModel[]>;

  constructor(private store: Store<any>,
              private router: Router) {}

  ngOnInit() {
    this.filterSub = this.store.select(selectFilter).subscribe((filter: FilterModel) => {
      this.selectedInterval = filter.interval;
      this.selectedChartType = filter.chartType;
    });
    this.podcasts$ = this.store.select(selectPodcasts);
    this.selectedPodcast$ = this.store.select(selectSelectedPodcast);
  }

  ngOnDestroy() {
    if (this.filterSub) { this.filterSub.unsubscribe(); }
  }

  onPodcastChange(val) {
    this.router.navigate([val.seriesId, 'downloads', this.selectedChartType, this.selectedInterval.key]);
  }
}
