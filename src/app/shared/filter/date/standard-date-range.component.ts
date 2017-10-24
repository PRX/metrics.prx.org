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
    <prx-select single="true" [options]="rangeOptions" [selected]="standardRange" (onSelect)="onStandardRangeChange($event)"></prx-select>
  `
})
export class StandardDateRangeComponent implements OnChanges {
  @Input() standardRange: string;
  @Input() interval: IntervalModel;
  @Output() standardRangeChange = new EventEmitter<string>();
  rangeOptions: string[] = [];

  ngOnChanges() {
    this.genRanges();
  }

  genRanges() {
    this.rangeOptions = [TODAY, THIS_WEEK];

    if (this.interval !== INTERVAL_15MIN ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfTwoWeeksUTC(), endOfTodayUTC()))) {
      this.rangeOptions.push(TWO_WEEKS);
    }

    if (this.interval !== INTERVAL_15MIN ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfThisMonthUTC(),  endOfTodayUTC()))) {
      this.rangeOptions.push(THIS_MONTH);
    }

    if (this.interval === INTERVAL_DAILY ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfThreeMonthsUTC(), endOfTodayUTC())) ||
      (this.interval === INTERVAL_HOURLY && !isMoreThanXDays(40, beginningOfThreeMonthsUTC(), endOfTodayUTC()))) {
      this.rangeOptions.push(THREE_MONTHS);
    }

    if (this.interval === INTERVAL_DAILY ||
      (this.interval === INTERVAL_15MIN && !isMoreThanXDays(10, beginningOfThisYearUTC(), endOfTodayUTC())) ||
      (this.interval === INTERVAL_HOURLY && !isMoreThanXDays(40, beginningOfThisYearUTC(), endOfTodayUTC()))) {
      this.rangeOptions.push(THIS_YEAR);
    }

    this.rangeOptions.push(YESTERDAY);
    this.rangeOptions.push(LAST_WEEK);

    if (this.interval !== INTERVAL_15MIN) {
      this.rangeOptions.push(PRIOR_TWO_WEEKS);
      this.rangeOptions.push(LAST_MONTH);
    }

    if (this.interval !== INTERVAL_15MIN && this.interval !== INTERVAL_HOURLY) {
      this.rangeOptions.push(PRIOR_THREE_MONTHS);
      this.rangeOptions.push(LAST_YEAR);
    }

    // We don't have back data yet, but users want an All time option,
    //  suppose that would just use the pub date of the very first episode as the begin date
    // this.rangeOptions.push('All time');
  }

  onStandardRangeChange(standardRange) {
    if (standardRange) {
      this.standardRangeChange.emit(standardRange);
    }
  }
}
