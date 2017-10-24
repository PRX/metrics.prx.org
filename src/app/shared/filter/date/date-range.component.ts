import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterModel, DateRangeModel } from '../../../ngrx/model';
import { getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate, getRange } from '../../util/date.util';

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
  @Output() dateRangeChange = new EventEmitter<DateRangeModel>();

  onCustomRangeChange(dateRange: DateRangeModel) {
    const standardRange = getStandardRangeForBeginEndDate(dateRange);
    const range = getRange(standardRange);
    this.dateRangeChange.emit({...dateRange, standardRange, range});
  }

  onStandardRangeChange(standardRange: string) {
    const dateRange = getBeginEndDateFromStandardRange(standardRange);
    const range = getRange(standardRange);
    this.dateRangeChange.emit({standardRange, range, ...dateRange});
  }
}
