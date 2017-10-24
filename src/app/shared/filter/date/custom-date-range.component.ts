import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DateRangeModel, IntervalModel, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../../ngrx/model';
import { isMoreThanXDays, endOfTodayUTC } from '../../util/date.util';

@Component({
  selector: 'metrics-custom-date-range',
  template: `
    <div>From:</div>
    <div>
      <prx-datepicker [date]="beginDate" UTC="true" (dateChange)="onBeginDateChange($event)"></prx-datepicker>
      <prx-timepicker [date]="beginDate" UTC="true" (timeChange)="onBeginDateChange($event)"></prx-timepicker>
    </div>
    <div>Through:</div>
    <div>
      <prx-datepicker [date]="endDate" UTC="true" (dateChange)="onEndDateChange($event)"></prx-datepicker>
      <prx-timepicker [date]="endDate" UTC="true" (timeChange)="onEndDateChange($event)"></prx-timepicker>
    </div>
    <div class="invalid" *ngIf="invalid">
      {{ invalid }}
    </div>
  `,
  styleUrls: ['custom-date-range.component.css']
})
export class CustomDateRangeComponent {
  @Input() interval: IntervalModel;
  @Input() beginDate: Date;
  @Input() endDate: Date;
  @Output() customRangeChange = new EventEmitter<DateRangeModel>();

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
      } else if (this.interval === INTERVAL_15MIN && isMoreThanXDays(10, this.beginDate, this.endDate)) {
        return 'From date and Through date cannot be more than 10 days apart for 15 minute interval';
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
