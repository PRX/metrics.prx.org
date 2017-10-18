import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FilterModel, IntervalModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../ngrx/model';
import { isMoreThanXDays } from '../util/date.util';

@Component({
  selector: 'metrics-interval',
  template: `
    <span>Interval:</span>
    <span>
      <prx-select single="true" [options]="intervalOptions" [selected]="selectedInterval" (onSelect)="onIntervalChange($event)">
      </prx-select>
    </span>
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
      if (isMoreThanXDays(40, this.filter.beginDate, this.filter.endDate)) {
        this.intervalOptions = [
          [INTERVAL_DAILY.name, INTERVAL_DAILY]
        ];
      } else if (isMoreThanXDays(10, this.filter.beginDate, this.filter.endDate)) {
        this.intervalOptions = [
          [INTERVAL_DAILY.name, INTERVAL_DAILY],
          [INTERVAL_HOURLY.name, INTERVAL_HOURLY],
        ];
      } else {
        this.intervalOptions = [
          [INTERVAL_DAILY.name, INTERVAL_DAILY],
          [INTERVAL_HOURLY.name, INTERVAL_HOURLY],
          [INTERVAL_15MIN.name, INTERVAL_15MIN]
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
