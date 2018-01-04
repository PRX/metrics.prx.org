import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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
      <div class="dropdown-content">
        <div class="intervals">
          <button *ngFor="let interval of intervalList"
                  [class.btn-link]="dateRange?.interval !== interval"
                  (click)="onIntervalChange(interval)">{{ interval.name }}</button>
        </div>
        <hr>
        <div class="ranges">
          <div class="pickers">
            <prx-daterange [from]="dateRange.beginDate" [to]="dateRange.endDate" UTC="true"
                           (rangeChange)="onCustomRangeChange($event)"></prx-daterange>
            <div class="invalid" *ngIf="invalid">
              {{ invalid }}
            </div>
          </div>
          <div class="separator"></div>
          <metrics-standard-date-range [standardRange]="dateRange?.standardRange" [interval]="dateRange?.interval"
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

export class CustomDateRangeDropdownComponent implements OnChanges {
  @Input() filter: FilterModel;
  @Output() dateRangeChange = new EventEmitter<FilterModel>();
  dateRange: FilterModel;
  open = false;
  intervalList = IntervalList;

  constructor(public store: Store<any>) {}

  ngOnChanges() {
    this.dateRange = this.filter;
  }

  onIntervalChange(interval: IntervalModel) {
    this.dateRange.interval = interval;
    this.dateRange.beginDate = dateUtil.roundDateToBeginOfInterval(this.dateRange.beginDate, interval);
    this.dateRange.endDate = dateUtil.roundDateToEndOfInterval(this.dateRange.endDate, interval);
    this.dateRange.standardRange = dateUtil.getStandardRangeForBeginEndDate(this.dateRange);
  }

  onCustomRangeChange(dateRange: {from: Date, to: Date}) {
    this.dateRange.beginDate = dateRange.from;
    this.dateRange.endDate = dateRange.to;
    this.dateRange.standardRange = dateUtil.getStandardRangeForBeginEndDate(this.dateRange);
  }

  onStandardRangeChange(standardRange: string) {
    const { beginDate, endDate } = dateUtil.getBeginEndDateFromStandardRange(standardRange);
    this.dateRange.standardRange = standardRange;
    this.dateRange.beginDate = beginDate;
    this.dateRange.endDate = endDate;
  }

  googleAnalyticsEvent(action: string, dateRange: FilterModel) {
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.filter.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'filter-' + action, value}));
  }

  toggleOpen() {
    this.dateRange = {...this.filter};
    this.open = !this.open;
  }

  onApply() {
    if (!this.invalid) {
      this.googleAnalyticsEvent('custom-date', this.dateRange);
      this.dateRangeChange.emit({...this.dateRange});
      this.open = false;
    }
  }

  get invalid(): string {
    if (this.dateRange.beginDate && this.dateRange.endDate) {
      if (this.dateRange.beginDate.valueOf() > this.dateRange.endDate.valueOf()) {
        return 'From date must come before To date';
      } else if (this.dateRange.interval === INTERVAL_HOURLY &&
        dateUtil.isMoreThanXDays(40, this.dateRange.beginDate, this.dateRange.endDate)) {
        return 'From date and To date cannot be more than 40 days apart for hourly interval';
      } else if (this.dateRange.endDate.valueOf() > dateUtil.endOfTodayUTC().valueOf() + 1 + (60 * 1000)) {
        // + 1 to roll milliseconds into the next day at midnight
        // + 60 * 1000 on endDate because seconds value is retained at :59
        // not sure what to do about the timepicker support but at least let the user select midnight tomorrow for thru end of current day
        return 'Please select dates in the past or present'; // alternate error message: 'We cannot see into the future'
      }
    }
  }
}
