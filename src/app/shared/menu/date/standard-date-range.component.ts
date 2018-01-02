import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IntervalModel, INTERVAL_HOURLY, INTERVAL_MONTHLY } from '../../../ngrx';
import { THIS_WEEK, LAST_WEEK, LAST_7_DAYS, THIS_WEEK_PLUS_7_DAYS,
  THIS_MONTH, LAST_MONTH, LAST_28_DAYS, LAST_30_DAYS,
  THIS_MONTH_PLUS_2_MONTHS, LAST_90_DAYS, THIS_YEAR, LAST_365_DAYS, OTHER } from '../../util/date.util';

@Component({
  selector: 'metrics-standard-date-range',
  template: `
    <prx-select single="true" [options]="flattenedOptions" [selected]="standardRange" (onSelect)="onStandardRangeChange($event)">
    </prx-select>
  `
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

    this.rangeOptions.push([OTHER]);

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
}
