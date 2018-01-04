import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FilterModel, IntervalModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx';
import * as dateUtil from '../util/date';

@Component({
  selector: 'metrics-interval',
  template: `
    <prx-select single="true" [options]="intervalOptions" [selected]="selectedInterval" (onSelect)="onIntervalChange($event)">
    </prx-select>
  `
})
export class IntervalComponent implements OnChanges {
  @Input() filter: FilterModel;
  @Output() intervalChange = new EventEmitter<IntervalModel>();
  intervalOptions: any[] = [];
  selectedInterval: any;

  ngOnChanges() {
    if (this.filter && this.filter.interval && this.filter.beginDate && this.filter.endDate) {
      this.selectedInterval = this.filter.interval;
      /* API requests limited as follows:
       10 days at 15m
       40 days at 1h
       2.7 years at 1d
       */
      if (dateUtil.isMoreThanXDays(40, this.filter.beginDate, this.filter.endDate)) {
        this.intervalOptions = [
          [INTERVAL_DAILY.name, INTERVAL_DAILY],
          [INTERVAL_WEEKLY.name, INTERVAL_WEEKLY],
          [INTERVAL_MONTHLY.name, INTERVAL_MONTHLY]
        ];
      } else if (dateUtil.isMoreThanXDays(10, this.filter.beginDate, this.filter.endDate)) {
        this.intervalOptions = [
          [INTERVAL_HOURLY.name, INTERVAL_HOURLY],
          [INTERVAL_DAILY.name, INTERVAL_DAILY],
          [INTERVAL_WEEKLY.name, INTERVAL_WEEKLY],
          [INTERVAL_MONTHLY.name, INTERVAL_MONTHLY]
        ];
      } else {
        this.intervalOptions = [
          [INTERVAL_HOURLY.name, INTERVAL_HOURLY],
          [INTERVAL_DAILY.name, INTERVAL_DAILY],
          [INTERVAL_WEEKLY.name, INTERVAL_WEEKLY],
          [INTERVAL_MONTHLY.name, INTERVAL_MONTHLY]
        ];
      }
    }
  }

  onIntervalChange(value: IntervalModel) {
    if (value) {
      this.intervalChange.emit(value);
    }
  }
}
