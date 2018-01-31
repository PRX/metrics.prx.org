import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IntervalModel, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '../../../ngrx';
import * as dateUtil from '../../util/date';

@Component({
  selector: 'metrics-standard-date-range',
  template: `
    <ul *ngFor="let group of rangeOptions" class="group">
      <li *ngFor="let range of group">
        <button class="btn-link" [class.active]="standardRange === range" (click)="onStandardRangeChange(range)">
          {{range}} <span>{{ getRangeDesc(range) }}</span>
        </button>
      </li>
    </ul>
  `,
  styleUrls: ['./standard-date-range.component.css']
})
export class StandardDateRangeComponent implements OnChanges {
  @Input() standardRange: string;
  @Input() interval: IntervalModel;
  @Output() standardRangeChange = new EventEmitter<string>();
  rangeOptions: string[][] = [];

  ngOnChanges() {
    this.rangeOptions = this.getRanges();
  }

  getRanges() {
    switch (this.interval) {
      case INTERVAL_HOURLY:
        return [
          [dateUtil.THIS_WEEK, dateUtil.LAST_WEEK, dateUtil.LAST_7_DAYS],
          [dateUtil.THIS_WEEK_PLUS_7_DAYS],
          [dateUtil.THIS_MONTH, dateUtil.LAST_MONTH, dateUtil.LAST_28_DAYS, dateUtil.LAST_30_DAYS]
        ];
      case INTERVAL_DAILY:
      case INTERVAL_WEEKLY:
      case INTERVAL_MONTHLY:
        return [
          [dateUtil.THIS_WEEK, dateUtil.LAST_WEEK, dateUtil.LAST_7_DAYS],
          [dateUtil.THIS_WEEK_PLUS_7_DAYS],
          [dateUtil.THIS_MONTH, dateUtil.LAST_MONTH, dateUtil.LAST_28_DAYS, dateUtil.LAST_30_DAYS],
          [dateUtil.THIS_MONTH_PLUS_2_MONTHS, dateUtil.LAST_90_DAYS],
          [dateUtil.THIS_YEAR, dateUtil.LAST_365_DAYS]
        ];
    }
  }

  onStandardRangeChange(standardRange) {
    if (standardRange) {
      this.standardRangeChange.emit(standardRange);
    }
  }

  getRangeDesc(range: string): string {
    switch (range) {
      case dateUtil.THIS_WEEK:
        return dateUtil.dayOfWeek(dateUtil.beginningOfThisWeekUTC()) + ' - TODAY';
      case dateUtil.LAST_WEEK:
        return dateUtil.dayOfWeek(dateUtil.beginningOfLastWeekUTC()) + ' - ' + dateUtil.monthDate(dateUtil.endOfLastWeekUTC());
      case dateUtil.LAST_7_DAYS:
        return dateUtil.monthDate(dateUtil.endOfLastWeekUTC()) + ' - TODAY';
      case dateUtil.THIS_WEEK_PLUS_7_DAYS:
        return dateUtil.dayOfWeek(dateUtil.beginningOfThisWeekPlus7DaysUTC()) + ' - TODAY';
      case dateUtil.THIS_MONTH:
        return dateUtil.monthDate(dateUtil.beginningOfThisMonthUTC()) + ' - TODAY';
      case dateUtil.LAST_MONTH:
        return dateUtil.monthDate(dateUtil.beginningOfLastMonthUTC()) + ' - ' + dateUtil.monthDate(dateUtil.endOfLastMonthUTC());
      case dateUtil.LAST_28_DAYS:
        return dateUtil.monthDate(dateUtil.beginningOfLast28DaysUTC()) + ' - TODAY';
      case dateUtil.LAST_30_DAYS:
        return dateUtil.monthDate(dateUtil.beginningOfLast30DaysUTC()) + ' - TODAY';
      case dateUtil.THIS_MONTH_PLUS_2_MONTHS:
        return dateUtil.monthDate(dateUtil.beginningOfThisMonthPlusTwoMonthsUTC()) + ' - TODAY';
      case dateUtil.LAST_90_DAYS:
        return dateUtil.monthDate(dateUtil.beginningOfLast90DaysUTC()) + ' - TODAY';
      case dateUtil.THIS_YEAR:
        return dateUtil.monthDate(dateUtil.beginningOfThisYearUTC()) + ' - TODAY';
      case dateUtil.LAST_365_DAYS:
        return dateUtil.monthDateYear(dateUtil.beginningOfLast365DaysUTC()) + ' - TODAY';
      default:
        break;
    }
  }
}
