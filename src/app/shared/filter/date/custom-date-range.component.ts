import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { FilterModel, IntervalModel, INTERVAL_HOURLY } from '../../../ngrx';
import { isMoreThanXDays, endOfTodayUTC } from '../../util/date.util';

@Component({
  selector: 'metrics-custom-date-range',
  template: `
    <div>
      <span>From:</span>
      <prx-datepicker [date]="beginDate" UTC="true" (dateChange)="onBeginDateChange($event)"></prx-datepicker>
      <span>To:</span>
      <prx-datepicker [date]="endDate" UTC="true" (dateChange)="onEndDateChange($event)"></prx-datepicker>
    </div>
    <div class="invalid" *ngIf="invalid">
      {{ invalid }}
    </div>
  `,
  styleUrls: ['custom-date-range.component.css']
})
export class CustomDateRangeComponent implements OnChanges {
  @Input() filter: FilterModel;
  @Output() customRangeChange = new EventEmitter<FilterModel>();
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;

  constructor(public store: Store<any>) {}

  ngOnChanges() {
    this.interval = this.filter.interval;
    this.beginDate = this.filter.beginDate;
    this.endDate = this.filter.endDate;
  }

  onBeginDateChange(date: Date) {
    // date picker is greedy about change events
    if (date.valueOf() !== this.beginDate.valueOf()) {
      this.beginDate = date;
      if (!this.invalid) {
        this.customRangeChange.emit({beginDate: date, endDate: this.endDate});
      }
    }
  }

  onEndDateChange(date: Date) {
    // date picker is greedy about change events
    if (date.valueOf() !== this.endDate.valueOf()) {
      this.endDate = date;
      if (!this.invalid) {
        this.customRangeChange.emit({beginDate: this.beginDate, endDate: date});
      }
    }
  }

  get invalid(): string {
    if (this.beginDate && this.endDate) {
      if (this.beginDate.valueOf() > this.endDate.valueOf()) {
        return 'From date must come before Through date';
      } else if (this.interval === INTERVAL_HOURLY && isMoreThanXDays(40, this.beginDate, this.endDate)) {
        return 'From date and Through date cannot be more than 40 days apart for hourly interval';
      } else if (this.endDate.valueOf() > endOfTodayUTC().valueOf() + 1 + (60 * 1000)) {
        // + 1 to roll milliseconds into the next day at midnight
        // + 60 * 1000 on endDate because seconds value is retained at :59
        // not sure what to do about the timepicker support but at least let the user select midnight tomorrow for thru end of current day
        return 'Please select dates in the past or present'; // alternate error message: 'We cannot see into the future'
      }
    }
  }
}
