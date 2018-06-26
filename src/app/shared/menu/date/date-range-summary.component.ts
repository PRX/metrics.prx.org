import { Component, Input } from '@angular/core';
import { RouterModel, INTERVAL_DAILY } from '../../../ngrx';
import * as dateUtil from '../../util/date';

@Component({
  selector: 'metrics-date-range-summary',
  template: `
    <div class="dates">{{beginDate}} &#x2015; {{endDate}}</div>
    <div class="desc" *ngIf="matchingDesc">{{ routerState?.standardRange }}</div>
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

  get matchingDesc(): boolean {
    return this.routerState && this.routerState.standardRange !== dateUtil.OTHER;
  }
}
