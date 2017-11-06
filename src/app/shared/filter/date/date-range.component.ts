import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { FilterModel, DateRangeModel } from '../../../ngrx/model';
import { getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate, getRange, getAmountOfIntervals } from '../../util/date.util';

@Component({
  selector: 'metrics-date-range',
  template: `
    <metrics-standard-date-range *ngIf="filter" [interval]="filter.interval" [standardRange]="filter.standardRange"
                                 (standardRangeChange)="onStandardRangeChange($event)"></metrics-standard-date-range>
    <metrics-custom-date-range *ngIf="filter" [interval]="filter.interval"
                               [beginDate]="filter.beginDate" [endDate]="filter.endDate"
                               [podcast]="filter.podcast"
                               (customRangeChange)="onCustomRangeChange($event)"></metrics-custom-date-range>
  `
})
export class DateRangeComponent {
  // TODO: still using filter.podcast in the template here and looking for title in custom-date-range
  @Input() filter: FilterModel;
  @Output() dateRangeChange = new EventEmitter<DateRangeModel>();

  constructor(public angulartics2: Angulartics2) {}

  onCustomRangeChange(dateRange: DateRangeModel) {
    const standardRange = getStandardRangeForBeginEndDate(dateRange);
    const range = getRange(standardRange);
    this.dateRangeChange.emit({...dateRange, standardRange, range});
    this.googleAnalyticsEvent('custom-date', dateRange);
  }

  onStandardRangeChange(standardRange: string) {
    const dateRange = getBeginEndDateFromStandardRange(standardRange);
    const range = getRange(standardRange);
    this.dateRangeChange.emit({standardRange, range, ...dateRange});
    this.googleAnalyticsEvent('standard-date', dateRange);
  }

  googleAnalyticsEvent(action: string, dateRange: DateRangeModel) {
    /* TODO: effect? (if there is time)
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
    }*/
  }
}
