import { Component, Input, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterModel, INTERVAL_HOURLY, IntervalModel, IntervalList } from '../../../ngrx';
import * as dateUtil from '../../util/date';
import { GoogleAnalyticsEventAction, RouteAdvancedRangeAction } from '../../../ngrx/actions';

@Component({
  selector: 'metrics-custom-date-range-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button class="btn-icon icon-calendar grey-dove" (click)="toggleOpen()" aria-label="Custom Date Range"></button>
      </div>
      <div class="dropdown-content" *ngIf="tempRange && open">
        <div class="intervals">
          <button *ngFor="let interval of intervalList"
                  [class.btn-link]="tempRange.interval !== interval"
                  (click)="onIntervalChange(interval)">{{ interval.name }}
          </button>
        </div>
        <hr>
        <div class="ranges">
          <div class="pickers">
            <prx-daterange [from]="tempRange.beginDate" [to]="tempRange.endDate" UTC="true"
                           (rangeChange)="onCustomRangeChange($event)"></prx-daterange>
            <div class="invalid" *ngIf="invalid">
              {{ invalid }}
            </div>
          </div>
          <div class="separator"></div>
          <metrics-standard-date-range [standardRange]="tempRange.standardRange" [interval]="tempRange.interval"
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
  @Input() routerState: RouterModel;
  tempRange: RouterModel;
  intervalList = IntervalList;
  userChoseRange: string;
  CUSTOM_DATE = 'custom-date';
  STANDARD_DATE = 'standard-date';
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  constructor(public store: Store<any>) {}

  onIntervalChange(interval: IntervalModel) {
    this.tempRange.interval = interval;
  }

  onCustomRangeChange(dateRange: {from: Date, to: Date}) {
    if (dateRange.from.valueOf() !== this.tempRange.beginDate.valueOf() ||
      dateRange.to.valueOf() !== this.tempRange.endDate.valueOf()) {
      this.tempRange.beginDate = dateRange.from;
      this.tempRange.endDate = dateRange.to;
      this.tempRange.standardRange = dateUtil.getStandardRangeForBeginEndDate(
        this.tempRange.beginDate, this.tempRange.endDate);
      this.userChoseRange = this.CUSTOM_DATE;
    }
  }

  onStandardRangeChange(standardRange: string) {
    const { beginDate, endDate } = dateUtil.getBeginEndDateFromStandardRange(standardRange);
    this.tempRange.standardRange = standardRange;
    this.tempRange.beginDate = beginDate;
    this.tempRange.endDate = endDate;
    this.userChoseRange = this.STANDARD_DATE;
  }

  googleAnalyticsEvent(action: string, dateRange: RouterModel) {
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, dateRange.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'routerState-' + action, value}));
  }

  toggleOpen() {
    this.tempRange = {...this.routerState};
    this.open = !this.open;
  }

  onApply() {
    if (!this.invalid) {
      this.googleAnalyticsEvent(this.userChoseRange || this.CUSTOM_DATE, this.tempRange);
      const { standardRange, interval, beginDate, endDate } = this.tempRange;
      this.store.dispatch(new RouteAdvancedRangeAction({standardRange, interval, beginDate, endDate}));
      this.open = false;
    }
  }

  get invalid(): string {
    if (this.tempRange.beginDate && this.tempRange.endDate) {
      if (this.tempRange.beginDate.valueOf() > this.tempRange.endDate.valueOf()) {
        return 'From date must come before To date';
      } else if (this.tempRange.interval === INTERVAL_HOURLY &&
        dateUtil.isMoreThanXDays(40, this.tempRange.beginDate, this.tempRange.endDate)) {
        return 'From date and To date cannot be more than 40 days apart for hourly interval';
      } else if (this.tempRange.endDate.valueOf() > dateUtil.endOfTodayUTC().valueOf() + 1 + (60 * 1000)) {
        // + 1 to roll milliseconds into the next day at midnight
        // + 60 * 1000 on endDate because seconds value is retained at :59
        // not sure what to do about the timepicker support but at least let the user select midnight tomorrow for thru end of current day
        return 'Please select dates in the past or present'; // alternate error message: 'We cannot see into the future'
      }
    }
  }
}
