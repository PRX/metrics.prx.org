import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { FilterModel, INTERVAL_HOURLY, IntervalModel, IntervalList } from '../../../ngrx';
import * as dateUtil from '../../util/date';
import { GoogleAnalyticsEventAction } from '../../../ngrx/actions';

@Component({
  selector: 'metrics-custom-date-range-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button class="btn-icon icon-calendar grey-dove" (click)="toggleOpen()" aria-label="Custom Date Range"></button>
      </div>
      <div class="dropdown-content" *ngIf="tempFilter">
        <div class="intervals">
          <button *ngFor="let interval of intervalList"
                  [class.btn-link]="tempFilter.interval !== interval"
                  (click)="onIntervalChange(interval)">{{ interval.name }}
          </button>
        </div>
        <hr>
        <div class="ranges">
          <div class="pickers">
            <prx-daterange [from]="tempFilter.beginDate" [to]="tempFilter.endDate" UTC="true"
                           (rangeChange)="onCustomRangeChange($event)"></prx-daterange>
            <div class="invalid" *ngIf="invalid">
              {{ invalid }}
            </div>
          </div>
          <div class="separator"></div>
          <metrics-standard-date-range [standardRange]="tempFilter.standardRange" [interval]="tempFilter.interval"
                                       (standardRangeChange)="onStandardRangeChange($event)">
          </metrics-standard-date-range>
        </div>
        <p class="buttons">
          <button (click)="toggleOpen()" class="btn-link">Cancel</button>
          <button (click)="onApply()" [disabled]="invalid">Apply</button>
        </p>
      </div>
    </div>
  `,
  styleUrls: ['../dropdown.css', './custom-date-range-dropdown.component.css']
})

export class CustomDateRangeDropdownComponent {
  @Input() filter: FilterModel;
  @Output() dateRangeChange = new EventEmitter<FilterModel>();
  tempFilter: FilterModel;
  open = false;
  intervalList = IntervalList;
  userChoseRange: string;
  CUSTOM_DATE = 'custom-date';
  STANDARD_DATE = 'standard-date';

  constructor(public store: Store<any>) {}

  onIntervalChange(interval: IntervalModel) {
    this.tempFilter.interval = interval;
    this.tempFilter.beginDate = dateUtil.roundDateToBeginOfInterval(this.tempFilter.beginDate, interval);
    this.tempFilter.endDate = dateUtil.roundDateToEndOfInterval(this.tempFilter.endDate, interval);
    this.tempFilter.standardRange = dateUtil.getStandardRangeForBeginEndDate(this.tempFilter);
  }

  onCustomRangeChange(dateRange: {from: Date, to: Date}) {
    if (dateRange.from.valueOf() !== this.tempFilter.beginDate.valueOf() ||
      dateRange.to.valueOf() !== this.tempFilter.endDate.valueOf()) {
      this.tempFilter.beginDate = dateRange.from;
      this.tempFilter.endDate = dateRange.to;
      this.tempFilter.standardRange = dateUtil.getStandardRangeForBeginEndDate(this.tempFilter);
      this.userChoseRange = this.CUSTOM_DATE;
    }
  }

  onStandardRangeChange(standardRange: string) {
    const { beginDate, endDate } = dateUtil.getBeginEndDateFromStandardRange(standardRange);
    this.tempFilter.standardRange = standardRange;
    this.tempFilter.beginDate = beginDate;
    this.tempFilter.endDate = endDate;
    this.userChoseRange = this.STANDARD_DATE;
  }

  googleAnalyticsEvent(action: string, dateRange: FilterModel) {
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.filter.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'filter-' + action, value}));
  }

  toggleOpen() {
    this.tempFilter = {...this.filter};
    this.open = !this.open;
  }

  onApply() {
    if (!this.invalid) {
      this.googleAnalyticsEvent(this.userChoseRange || this.CUSTOM_DATE, this.tempFilter);
      this.dateRangeChange.emit({...this.tempFilter});
      this.open = false;
    }
  }

  get invalid(): string {
    if (this.tempFilter.beginDate && this.tempFilter.endDate) {
      if (this.tempFilter.beginDate.valueOf() > this.tempFilter.endDate.valueOf()) {
        return 'From date must come before To date';
      } else if (this.tempFilter.interval === INTERVAL_HOURLY &&
        dateUtil.isMoreThanXDays(40, this.tempFilter.beginDate, this.tempFilter.endDate)) {
        return 'From date and To date cannot be more than 40 days apart for hourly interval';
      } else if (this.tempFilter.endDate.valueOf() > dateUtil.endOfTodayUTC().valueOf() + 1 + (60 * 1000)) {
        // + 1 to roll milliseconds into the next day at midnight
        // + 60 * 1000 on endDate because seconds value is retained at :59
        // not sure what to do about the timepicker support but at least let the user select midnight tomorrow for thru end of current day
        return 'Please select dates in the past or present'; // alternate error message: 'We cannot see into the future'
      }
    }
  }
}
