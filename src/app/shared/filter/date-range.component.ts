import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';
import { isMoreThanXDays, endOfTodayUTC } from '../../shared/util/date.util';

@Component({
  selector: 'metrics-date-range',
  template: `
    <div>
      <span>From:</span>
      <span>
        <prx-datepicker [date]="selectedBeginDate" UTC="true" (dateChange)="onBeginDateChange($event)"></prx-datepicker>
        <prx-timepicker [date]="selectedBeginDate" UTC="true" (timeChange)="onBeginDateChange($event)"></prx-timepicker>
      </span>
    </div>
    <div>
      <span>Through:</span>
      <span>
        <prx-datepicker [date]="selectedEndDate" UTC="true" (dateChange)="onEndDateChange($event)"></prx-datepicker>
        <prx-timepicker [date]="selectedEndDate" UTC="true" (timeChange)="onEndDateChange($event)"></prx-timepicker>
      </span>
    </div>
    <div class="invalid" *ngIf="invalid">
      {{ invalid }}
    </div>
  `,
  styleUrls: ['date-range.component.css']
})
export class DateRangeComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  selectedBeginDate: Date;
  selectedEndDate: Date;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterStoreSub = this.store.select('filter').subscribe(state => {
      this.filter = state;
      this.selectedBeginDate = this.filter.beginDate;
      this.selectedEndDate = this.filter.endDate;
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
  }

  onBeginDateChange(date: Date) {
    this.selectedBeginDate = date;
    if (!this.invalid) {
      this.store.dispatch(new CastleFilterAction({filter: {beginDate: date}}));
    }
  }

  onEndDateChange(date: Date) {
    this.selectedEndDate = date;
    if (!this.invalid) {
      this.store.dispatch(new CastleFilterAction({filter: {endDate: date}}));
    }
  }

  get invalid(): string {
    if (this.selectedBeginDate && this.selectedEndDate) {
      if (this.selectedBeginDate.valueOf() > this.selectedEndDate.valueOf()) {
        return 'From date must come before Through date';
      } else if (this.filter.interval === INTERVAL_15MIN && isMoreThanXDays(10, this.selectedBeginDate, this.selectedEndDate)) {
        return 'From date and Through date cannot be more than 10 days apart for 15 minute interval';
      } else if (this.filter.interval === INTERVAL_HOURLY && isMoreThanXDays(40, this.selectedBeginDate, this.selectedEndDate)) {
        return 'From date and Through date cannot be more than 40 days apart for hourly interval';
      } else if (this.selectedEndDate.valueOf() > endOfTodayUTC().valueOf() + 1 + (60 * 1000) ||
        this.selectedBeginDate.valueOf() > endOfTodayUTC().valueOf() + 1) {
        // + 1 to roll milliseconds into the next day at midnight
        // + 60 * 1000 on endDate because seconds value is retained at :59
        // not sure what to do about the timepicker support but at least let the user select midnight tomorrow for thru end of current day
        return 'Please select dates in the past or present'; // alternate error message: 'We cannot see into the future'
      }
    }
  }
}
