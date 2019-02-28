import { Component, Input } from '@angular/core';
import { RouterParams } from '../../../ngrx';
import * as dateUtil from '../../util/date';

@Component({
  selector: 'metrics-date-range-summary',
  template: `
    <div class="dates">{{beginDate}} &#x2015; {{endDate}}</div>
    <div class="desc" *ngIf="matchingDesc">{{ routerParams?.standardRange }}</div>
  `,
  styleUrls: ['./date-range-summary.component.css']
})

export class DateRangeSummaryComponent {
  @Input() routerParams: RouterParams;

  get beginDate(): string {
    return this.routerParams && this.routerParams.beginDate && dateUtil.monthDateYear(this.routerParams.beginDate);
  }

  get endDate(): string {
    return this.routerParams && this.routerParams.endDate && dateUtil.monthDateYear(this.routerParams.endDate);
  }

  get matchingDesc(): boolean {
    return this.routerParams && this.routerParams.standardRange !== dateUtil.OTHER;
  }
}
