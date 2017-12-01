import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { FilterModel } from '../../../ngrx/model';
import { getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate, getRange, getAmountOfIntervals } from '../../util/date.util';
import { GoogleAnalyticsEventAction } from '../../../ngrx/actions';

@Component({
  selector: 'metrics-date-range',
  template: `
    <metrics-standard-date-range *ngIf="filter" [interval]="filter.interval" [standardRange]="filter.standardRange"
                                 (standardRangeChange)="onStandardRangeChange($event)"></metrics-standard-date-range>
    <metrics-custom-date-range *ngIf="filter" [interval]="filter.interval"
                               [beginDate]="filter.beginDate" [endDate]="filter.endDate"
                               (customRangeChange)="onCustomRangeChange($event)"></metrics-custom-date-range>
  `
})
export class DateRangeComponent {
  @Input() filter: FilterModel;
  @Output() dateRangeChange = new EventEmitter<FilterModel>();

  constructor(public store: Store<any>) {}

  onCustomRangeChange(dateRange: FilterModel) {
    const standardRange = getStandardRangeForBeginEndDate({...this.filter, ...dateRange});
    const range = getRange(standardRange);
    this.dateRangeChange.emit({...this.filter, ...dateRange, standardRange, range});
    this.googleAnalyticsEvent('custom-date', dateRange);
  }

  onStandardRangeChange(standardRange: string) {
    const dateRange = getBeginEndDateFromStandardRange(standardRange);
    const range = getRange(standardRange);
    this.dateRangeChange.emit({...this.filter, standardRange, range, ...dateRange});
    this.googleAnalyticsEvent('standard-date', dateRange);
  }

  googleAnalyticsEvent(action: string, dateRange: FilterModel) {
    const value = getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.filter.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'filter-' + action, value}));
  }
}
