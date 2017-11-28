import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectFilter } from '../../ngrx/reducers';
import { DateRangeModel, EpisodeModel, FilterModel, IntervalModel } from '../../ngrx/model';
import { roundDateToBeginOfInterval, roundDateToEndOfInterval,
  getStandardRangeForBeginEndDate, getRange } from '../../shared/util/date.util';

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

  constructor(public store: Store<any>,
              private router: Router) {}

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
    // keep the dates in sync with interval changes
    const beginDate = roundDateToBeginOfInterval(this.filter.beginDate, interval);
    const endDate = roundDateToEndOfInterval(this.filter.endDate, interval);
    const standardRange = getStandardRangeForBeginEndDate({beginDate, endDate});
    const range = getRange(standardRange);
    this.filter = {...this.filter, interval, beginDate, endDate, standardRange, range};
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
      !this.filter.episodeIds ||
      !episodes.map(e => e.id).every(id => this.filter.episodeIds.indexOf(id) !== -1) ||
      !this.filter.episodeIds.every(id => episodes.map(e => e.id).indexOf(id) !== -1))) {
      this.hasChanges = true;
    }
    this.filter = {...this.filter, episodeIds: episodes.map(e => e.id)};
  }

  onApply() {
    if (this.hasChanges) {
      this.filter.beginDate = roundDateToBeginOfInterval(this.filter.beginDate, this.filter.interval);
      this.filter.endDate = roundDateToEndOfInterval(this.filter.endDate, this.filter.interval);
      this.filter.standardRange = getStandardRangeForBeginEndDate({beginDate: this.filter.beginDate, endDate: this.filter.endDate});
      this.filter.range = getRange(this.filter.standardRange);
      const routerParams = {
        beginDate: this.filter.beginDate.toISOString(),
        endDate: this.filter.endDate.toISOString()
      };
      if (this.filter.episodeIds) {
        routerParams['episodes'] = this.filter.episodeIds.join(',');
      }
      if (this.filter.standardRange) {
        routerParams['standardRange'] = this.filter.standardRange;
      }
      if (this.filter.range) {
        routerParams['range'] = this.filter.range.join(',');
      }
      this.router.navigate([this.filter.podcastSeriesId, 'downloads', this.filter.interval.key, routerParams]);
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
