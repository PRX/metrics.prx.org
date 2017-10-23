import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { FilterModel, DateRangeModel } from '../../../ngrx/model';
import { getBeginEndDateFromWhen, getWhenForRange, getRange, getAmountOfIntervals } from '../../util/date.util';

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

  constructor(public angulartics2: Angulartics2) {}

  onDateRangeChange(dateRange: DateRangeModel) {
    const when = getWhenForRange(dateRange);
    const range = getRange(when);
    this.dateRangeChange.emit({...dateRange, when, range});
    this.googleAnalyticsEvent('custom-date', dateRange);
  }

  onWhenChange(when: string) {
    const dateRange = getBeginEndDateFromWhen(when);
    const range = getRange(when);
    this.dateRangeChange.emit({when, range, ...dateRange});
    this.googleAnalyticsEvent('standard-date', dateRange);
  }

  googleAnalyticsEvent(action: string, dateRange: DateRangeModel) {
    if (this.filter && this.filter.podcast && this.filter.interval) {
      const value = getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.filter.interval);
      this.angulartics2.eventTrack.next({
        action: 'filter-' + action,
        properties: {
          category: 'Downloads/' + this.filter.interval.name,
          label: this.filter.podcast.title,
          value
        }
      });
    }
  }
}
