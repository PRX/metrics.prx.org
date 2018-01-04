import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectFilter } from '../../ngrx/reducers';
import { FilterModel, IntervalModel } from '../../ngrx';
import { GoogleAnalyticsEventAction } from '../../ngrx/actions';
import * as dateUtil from '../util/date';

@Component({
  selector: 'metrics-menu-bar',
  template: `
    <metrics-chart-type></metrics-chart-type>
    <metrics-interval [filter]="filter" (intervalChange)="onIntervalChange($event)"></metrics-interval>
    <div class="empty"></div>
    <metrics-standard-date-range-dropdown [interval]="filter?.interval" [standardRange]="filter?.standardRange"
                                          (standardRangeChange)="onStandardRangeChange($event)"
                                          (custom)="custom.toggleOpen()"></metrics-standard-date-range-dropdown>
    <metrics-custom-date-range-dropdown [filter]="filter" #custom
                               (dateRangeChange)="onDateRangeChange($event)"></metrics-custom-date-range-dropdown>
  `,
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit, OnDestroy {
  @Output() routeFromFilter = new EventEmitter();
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
    if (this.filter.interval !== interval) {
      this.filter.interval = interval;
      this.adjustAndRouteFromFilter();
    }
  }

  onStandardRangeChange(standardRange: string) {
    const dateRange = dateUtil.getBeginEndDateFromStandardRange(standardRange);
    this.googleAnalyticsEvent('standard-date', dateRange);
    this.onDateRangeChange({...this.filter, standardRange, ...dateRange});
  }

  onDateRangeChange(dateRange: FilterModel) {
    if (dateRange.beginDate.valueOf() !== this.filter.beginDate.valueOf() ||
      dateRange.endDate.valueOf() !== this.filter.endDate.valueOf()) {
      this.filter = {...this.filter, ...dateRange};
      this.adjustAndRouteFromFilter();
    }
  }

  adjustAndRouteFromFilter() {
    this.filter.beginDate = dateUtil.roundDateToBeginOfInterval(this.filter.beginDate, this.filter.interval);
    this.filter.endDate = dateUtil.roundDateToEndOfInterval(this.filter.endDate, this.filter.interval);
    this.filter.standardRange = dateUtil.getStandardRangeForBeginEndDate(this.filter);
    this.routeFromFilter.emit(this.filter);
  }

  googleAnalyticsEvent(action: string, dateRange: FilterModel) {
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.filter.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'filter-' + action, value}));
  }
}
