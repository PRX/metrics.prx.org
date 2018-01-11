import { Component, Input } from '@angular/core';
import { FilterModel, INTERVAL_DAILY } from '../../../ngrx';
import * as dateUtil from '../../util/date';

@Component({
  selector: 'metrics-date-range-summary',
  template: `
    <div class="label">in this range</div>
    <div class="range">{{beginDate}} - {{endDate}} <span>({{numDays}})</span></div>
  `,
  styleUrls: ['./date-range-summary.component.css']
})

export class DateRangeSummaryComponent {
  @Input() filter: FilterModel;

  get beginDate(): string {
    return this.filter && this.filter.beginDate && dateUtil.monthDateYear(this.filter.beginDate);
  }

  get endDate(): string {
    return this.filter && this.filter.endDate && dateUtil.monthDateYear(this.filter.endDate);
  }

  get numDays(): string {
    if (this.filter && this.filter.beginDate && this.filter.endDate) {
      // the summary is always number of days regardless if the interval is hours, weeks, or months
      const days = this.filter && dateUtil.getAmountOfIntervals(this.filter.beginDate, this.filter.endDate, INTERVAL_DAILY);
      return days === 1 ? days + ' day' : days + ' days';
    }
  }
}
