import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IntervalModel, INTERVAL_HOURLY, INTERVAL_MONTHLY } from '../../../ngrx';
import { dayOfWeekDateFormat, dayMonthDateFormat, monthDateYearFormat,
  beginningOfThisWeekUTC, beginningOfLastWeekUTC, endOfLastWeekUTC, beginningOfLast7DaysUTC, beginningOfThisWeekPlus7DaysUTC,
  beginningOfThisMonthUTC, beginningOfLastMonthUTC, endOfLastMonthUTC, beginningOfLast28DaysUTC, beginningOfLast30DaysUTC,
  beginningOfThisMonthPlusTwoMonthsUTC, beginningOfLast90DaysUTC, beginningOfThisYearUTC, beginningOfLast365DaysUTC,
  THIS_WEEK, LAST_WEEK, LAST_7_DAYS, THIS_WEEK_PLUS_7_DAYS,
  THIS_MONTH, LAST_MONTH, LAST_28_DAYS, LAST_30_DAYS,
  THIS_MONTH_PLUS_2_MONTHS, LAST_90_DAYS, THIS_YEAR, LAST_365_DAYS, OTHER } from '../../util/date.util';

@Component({
  selector: 'metrics-standard-date-range',
  template: `
    <ul *ngFor="let group of rangeOptions" class="group">
      <li *ngFor="let range of group">
        <button class="btn-link" (click)="onStandardRangeChange(range)">
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
    this.genRanges();
  }

  genRanges() {
    if (this.interval !== INTERVAL_MONTHLY) {
      this.rangeOptions = [[THIS_WEEK, LAST_WEEK, LAST_7_DAYS], [THIS_WEEK_PLUS_7_DAYS],
        [THIS_MONTH, LAST_MONTH, LAST_28_DAYS, LAST_30_DAYS]];
    } else {
      this.rangeOptions = [[THIS_MONTH, LAST_MONTH]];
    }

    if (this.interval !== INTERVAL_HOURLY) {
      if (this.interval !== INTERVAL_MONTHLY) {
        this.rangeOptions.push([THIS_MONTH_PLUS_2_MONTHS, LAST_90_DAYS]);
        this.rangeOptions.push([THIS_YEAR, LAST_365_DAYS]);
      } else {
        this.rangeOptions.push([THIS_MONTH_PLUS_2_MONTHS]);
        this.rangeOptions.push([THIS_YEAR]);
      }
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

  get flattenedOptions(): string[] {
    const options = [];
    this.rangeOptions.forEach(group => group.forEach(option => {
      options.push(option);
    }));
    return options;
  }

  getRangeDesc(range: string): string {
    switch (range) {
      case THIS_WEEK:
        return dayOfWeekDateFormat(beginningOfThisWeekUTC()) + ' - TODAY';
      case LAST_WEEK:
        return dayOfWeekDateFormat(beginningOfLastWeekUTC()) + ' - ' + dayMonthDateFormat(endOfLastWeekUTC());
      case LAST_7_DAYS:
        return dayMonthDateFormat(beginningOfLast7DaysUTC()) + ' - TODAY';
      case THIS_WEEK_PLUS_7_DAYS:
        return dayOfWeekDateFormat(beginningOfThisWeekPlus7DaysUTC()) + ' - TODAY';
      case THIS_MONTH:
        return dayMonthDateFormat(beginningOfThisMonthUTC()) + ' - TODAY';
      case LAST_MONTH:
        return dayMonthDateFormat(beginningOfLastMonthUTC()) + ' - ' + dayMonthDateFormat(endOfLastMonthUTC());
      case LAST_28_DAYS:
        return dayMonthDateFormat(beginningOfLast28DaysUTC()) + ' - TODAY';
      case LAST_30_DAYS:
        return dayMonthDateFormat(beginningOfLast30DaysUTC()) + ' - TODAY';
      case THIS_MONTH_PLUS_2_MONTHS:
        return dayMonthDateFormat(beginningOfThisMonthPlusTwoMonthsUTC()) + ' - TODAY';
      case LAST_90_DAYS:
        return dayMonthDateFormat(beginningOfLast90DaysUTC()) + ' - TODAY';
      case THIS_YEAR:
        return dayMonthDateFormat(beginningOfThisYearUTC()) + ' - TODAY';
      case LAST_365_DAYS:
        return monthDateYearFormat(beginningOfLast365DaysUTC()) + ' - TODAY';
      default:
        break;
    }
  }
}
