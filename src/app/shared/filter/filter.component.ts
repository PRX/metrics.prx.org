import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
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
      <button (click)="onApply()" [disabled]="applyDisabled">Apply</button>
      <metrics-next-date-range></metrics-next-date-range>
    </div>
  `,
  styleUrls: ['filter.component.css']
})

export class FilterComponent implements OnInit, OnDestroy {
  filter: FilterModel;
  filterSub: Subscription;
  hasChanges = false;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter) {
        this.hasChanges = false;
        this.filter = newFilter;
      }
    });
  }

  ngOnDestroy() {
    if (this.filterSub) { this.filterSub.unsubscribe(); }
  }

  onIntervalChange(interval: IntervalModel) {
    if (this.filter.interval !== interval) {
      this.hasChanges = true;
    }
    this.filter = {...this.filter, interval};
  }

  onDateRangeChange(dateRange: DateRangeModel) {
    if (dateRange.beginDate.valueOf() !== this.filter.beginDate.valueOf() ||
      dateRange.endDate.valueOf() !== this.filter.endDate.valueOf()) {
      this.hasChanges = true;
    }
    this.filter = {...this.filter, ...dateRange};
  }

  onEpisodesChange(episodes: EpisodeModel[]) {
    if (episodes &&
      (!this.filter ||
      !this.filter.episodes ||
      !episodes.map(e => e.id).every(id => this.filter.episodes.map(e => e.id).indexOf(id) !== -1) ||
      !this.filter.episodes.map(e => e.id).every(id => episodes.map(e => e.id).indexOf(id) !== -1))) {
      this.hasChanges = true;
    }
    this.filter = {...this.filter, episodes};
  }

  onApply() {
    if (this.hasChanges) {
      this.store.dispatch(new CastleFilterAction({filter: this.filter}));
    }
  }

  get applyDisabled(): string {
    if (this.hasChanges) {
      return null;
    } else {
      return 'disabled';
    }
  }
}
