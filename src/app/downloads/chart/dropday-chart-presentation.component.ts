import { Component, Input } from '@angular/core';
import { IndexedChartModel, CategoryChartModel } from 'ngx-prx-styleguide';
import { RouterParams, CHARTTYPE_HORIZBAR, CHARTTYPE_EPISODES,
  INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '@app/ngrx';
import * as chartUtil from '@app/shared/util/chart.util';

@Component({
  selector: 'metrics-dropday-chart-presentation',
  template: `
    <prx-category-chart *ngIf="chartData && chartData.length && isBarChart"
      [data]="chartData" dataLabel="{{routerParams?.days + ' Day Downloads'}}">
    </prx-category-chart>
    <prx-indexed-chart *ngIf="chartData && chartData.length && isLineChart" type="line" [datasets]="chartData" [type]="chartType">
    </prx-indexed-chart>
    <p *ngIf="chartData && chartData.length && isLineChart">{{intervalLabel}} since drop</p>
  `,
  styleUrls: ['./dropday-chart-presentation.component.css']
})
export class DropdayChartPresentationComponent {
  @Input() routerParams: RouterParams;
  @Input() chartData: IndexedChartModel[] | CategoryChartModel[];

  formatX(s: string) {
    // TODO: format day0 as "Drop" but chart displays _all_ ticks when formatted ugh
    return parseInt(s, 10) === 0 ? 'Drop' : s;
  }
  get chartType(): string {
    return this.routerParams && chartUtil.c3ChartType(this.routerParams.chartType);
  }
  get isBarChart() {
    return this.routerParams && this.routerParams.chartType === CHARTTYPE_HORIZBAR;
  }
  get isLineChart() {
    return this.routerParams && this.routerParams.chartType === CHARTTYPE_EPISODES;
  }

  get intervalLabel(): string {
    switch (this.routerParams.interval) {
      case INTERVAL_HOURLY:
        return 'Hours';
      case INTERVAL_DAILY:
        return 'Days';
      case INTERVAL_WEEKLY:
        return 'Weeks';
      case INTERVAL_MONTHLY:
        return 'Months';
    }
  }
}