import { Component, Input } from '@angular/core';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterParams, CHARTTYPE_HORIZBAR, CHARTTYPE_EPISODES } from '@app/ngrx';
import * as chartUtil from '@app/shared/util/chart.util';

@Component({
  selector: 'metrics-dropday-chart-presentation',
  template: `
    <prx-category-chart *ngIf="chartData && chartData.length && isBarChart"
      [data]="chartData" dataLabel="{{routerParams?.days + ' Day Downloads'}}">
    </prx-category-chart>
    <prx-indexed-chart *ngIf="chartData && chartData.length && isLineChart" type="line" [datasets]="chartData" [type]="chartType">
    </prx-indexed-chart>
    <p *ngIf="chartData && chartData.length && isLineChart">Days since drop</p>
  `,
  styleUrls: ['./dropday-chart-presentation.component.css']
})
export class DropdayChartPresentationComponent {
  @Input() routerParams: RouterParams;
  @Input() chartData: TimeseriesChartModel[];

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
}
