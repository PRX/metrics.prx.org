import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IntervalModel, INTERVAL_15MIN, INTERVAL_HOURLY, INTERVAL_DAILY,
  TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from '../../../ngrx/model';
import { isMoreThanXDays, endOfTodayUTC, beginningOfTwoWeeksUTC, beginningOfThisMonthUTC,
  beginningOfThreeMonthsUTC, beginningOfThisYearUTC } from '../../util/date.util';

@Component({
  selector: 'metrics-standard-date-range',
  template: `
    <div>When:</div>
    <prx-select single="true" [options]="whenOptions" [selected]="when" (onSelect)="onWhenChange($event)"></prx-select>
  `
})
export class StandardDateRangeComponent implements OnChanges {
  @Input() when: string;
  @Input() interval: IntervalModel;
  @Output() whenChange = new EventEmitter<string>();
  whenOptions: string[];

  ngOnChanges() {
    this.genWhen();
  }

  genWhen() {
    this.whenOptions = [TODAY, THIS_WEEK];

    if (this.interval !== INTERVAL_15MIN ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfTwoWeeksUTC(), endOfTodayUTC()))) {
      this.whenOptions.push(TWO_WEEKS);
    }

    if (this.interval !== INTERVAL_15MIN ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfThisMonthUTC(),  endOfTodayUTC()))) {
      this.whenOptions.push(THIS_MONTH);
    }

    if (this.interval === INTERVAL_DAILY ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfThreeMonthsUTC(), endOfTodayUTC())) ||
      (this.interval === INTERVAL_HOURLY && !isMoreThanXDays(40, beginningOfThreeMonthsUTC(), endOfTodayUTC()))) {
      this.whenOptions.push(THREE_MONTHS);
    }

    if (this.interval === INTERVAL_DAILY ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfThisYearUTC(), endOfTodayUTC())) ||
      (this.interval === INTERVAL_HOURLY && !isMoreThanXDays(40, beginningOfThisYearUTC(), endOfTodayUTC()))) {
      this.whenOptions.push(THIS_YEAR);
    }

    this.whenOptions.push(YESTERDAY);
    this.whenOptions.push(LAST_WEEK);

    if (this.interval !== INTERVAL_15MIN) {
      this.whenOptions.push(PRIOR_TWO_WEEKS);
      this.whenOptions.push(LAST_MONTH);
    }

    if (this.interval !== INTERVAL_15MIN && this.interval !== INTERVAL_HOURLY) {
      this.whenOptions.push(PRIOR_THREE_MONTHS);
      this.whenOptions.push(LAST_YEAR);
    }

    // We don't have back data yet, but users want an All time option,
    //  suppose that would just use the pub date of the very first episode as the begin date
    // this.whenOptions.push('All time');
  }

  onWhenChange(when) {
    if (when) {
      this.whenChange.emit(when);
    }
  }
}
