import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { selectFilter } from '../../ngrx/reducers';
import { FilterModel, IntervalModel, ChartType } from '../../ngrx';
import { GoogleAnalyticsEventAction } from '../../ngrx/actions';
import * as dateUtil from '../util/date';

@Component({
  selector: 'metrics-menu-bar',
  template: `
    <div class="menu-bar">
      <metrics-chart-type [selectedChartType]="filter?.chartType" (chartTypeChange)="onChartTypeChange($event)"></metrics-chart-type>
      <metrics-interval-dropdown [filter]="filter" (intervalChange)="onIntervalChange($event)"></metrics-interval-dropdown>
      <div class="empty"></div>
      <metrics-standard-date-range-dropdown [interval]="filter?.interval" [standardRange]="filter?.standardRange"
                                            (standardRangeChange)="onStandardRangeChange($event)"
                                            (custom)="custom.toggleOpen()"></metrics-standard-date-range-dropdown>
      <metrics-custom-date-range-dropdown [filter]="filter" #custom
                                 (dateRangeChange)="onFilterChange($event)"></metrics-custom-date-range-dropdown>
    </div>
    <div class="summary">
      <metrics-date-range-summary [filter]="filter"></metrics-date-range-summary>
      <metrics-downloads-summary></metrics-downloads-summary>
    </div>
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
    this.onFilterChange({...this.filter, standardRange, ...dateRange});
  }

  onFilterChange(newFilter: FilterModel) {
    if (newFilter.beginDate.valueOf() !== this.filter.beginDate.valueOf() ||
      newFilter.endDate.valueOf() !== this.filter.endDate.valueOf() ||
      newFilter.interval !== this.filter.interval) {
      this.filter = {...this.filter, ...newFilter};
      this.adjustAndRouteFromFilter();
    }
  }

  adjustAndRouteFromFilter() {
    this.filter.beginDate = dateUtil.roundDateToBeginOfInterval(this.filter.beginDate, this.filter.interval);
    this.filter.endDate = dateUtil.roundDateToEndOfInterval(this.filter.endDate, this.filter.interval);
    this.filter.standardRange = dateUtil.getStandardRangeForBeginEndDate(this.filter.beginDate, this.filter.endDate, this.filter.interval);
    this.routeFromFilter.emit(this.filter);
  }

  onChartTypeChange(chartType: ChartType) {
    this.routeFromFilter.emit({...this.filter, chartType});
  }

  googleAnalyticsEvent(action: string, dateRange: FilterModel) {
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.filter.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'filter-' + action, value}));
  }
}
