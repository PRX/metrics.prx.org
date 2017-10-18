import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterModel, DateRangeModel } from '../../../ngrx/model';
import { getBeginEndDateFromWhen, getWhenForRange, getRange } from '../../util/date.util';

@Component({
  selector: 'metrics-date-range',
  template: `
    <metrics-standard-date-range *ngIf="filter" [interval]="filter.interval" [when]="filter.when"
                                 (whenChange)="onWhenChange($event)"></metrics-standard-date-range>
    <metrics-custom-date-range *ngIf="filter" [interval]="filter.interval"
                               [beginDate]="filter.beginDate" [endDate]="filter.endDate"
                               (dateRangeChange)="onDateRangeChange($event)"></metrics-custom-date-range>
  `
})
export class DateRangeComponent {
  @Input() filter: FilterModel;
  @Output() dateRangeChange = new EventEmitter<DateRangeModel>();

  onDateRangeChange(dateRange: DateRangeModel) {
    const when = getWhenForRange(dateRange);
    const range = getRange(when);
    this.dateRangeChange.emit({...dateRange, when, range});
  }

  onWhenChange(when: string) {
    const dateRange = getBeginEndDateFromWhen(when);
    const range = getRange(when);
    this.dateRangeChange.emit({when, range, ...dateRange});
  }
}
