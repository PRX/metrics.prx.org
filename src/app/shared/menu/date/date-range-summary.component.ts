import { Component, Input } from '@angular/core';
import { RouterModel, INTERVAL_DAILY } from '../../../ngrx';
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
  @Input() routerState: RouterModel;

  get beginDate(): string {
    return this.routerState && this.routerState.beginDate && dateUtil.monthDateYear(this.routerState.beginDate);
  }

  get endDate(): string {
    return this.routerState && this.routerState.endDate && dateUtil.monthDateYear(this.routerState.endDate);
  }

  get numDays(): string {
    if (this.routerState && this.routerState.beginDate && this.routerState.endDate) {
      // the summary is always number of days regardless if the interval is hours, weeks, or months
      const days = this.routerState && dateUtil.getAmountOfIntervals(this.routerState.beginDate, this.routerState.endDate, INTERVAL_DAILY);
      return days === 1 ? days + ' day' : days + ' days';
    }
  }
}
