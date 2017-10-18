import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/subscription';
import { selectFilter } from '../../ngrx/reducers';
import { DateRangeModel, EpisodeModel, FilterModel, IntervalModel } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-filter',
  template: `
    <metrics-date-range [filter]="filter" (dateRangeChange)="onDateRangeChange($event)"></metrics-date-range>
    <hr>
    <metrics-interval [filter]="filter" (intervalChange)="onIntervalChange($event)"></metrics-interval>
    <metrics-episodes [filter]="filter" (episodesChange)="onEpisodesChange($event)"></metrics-episodes>
    <div class="buttons">
      <metrics-prev-date-range></metrics-prev-date-range>
      <button (click)="onApply()">Apply</button>
      <metrics-next-date-range></metrics-next-date-range>
    </div>
  `,
  styleUrls: ['filter.component.css']
})

export class FilterComponent implements OnInit, OnDestroy {
  filter: FilterModel;
  filterSub: Subscription;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter) {
        this.filter = newFilter;
      }
    });
  }

  ngOnDestroy() {
    if (this.filterSub) { this.filterSub.unsubscribe(); }
  }

  onIntervalChange(interval: IntervalModel) {
    this.filter.interval = interval;
  }

  onDateRangeChange(dateRange: DateRangeModel) {
    this.filter.when = dateRange.when;
    this.filter.range = dateRange.range;
    this.filter.beginDate = dateRange.beginDate;
    this.filter.endDate = dateRange.endDate;
  }

  onEpisodesChange(episodes: EpisodeModel[]) {
    this.filter.episodes = episodes;
  }

  onApply() {
    this.store.dispatch(new CastleFilterAction({filter: this.filter}));
  }
}
