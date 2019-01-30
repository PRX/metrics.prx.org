import { Component, Input } from '@angular/core';
import { CHARTTYPE_HORIZBAR, RouterParams, GroupCharted } from '../ngrx';
import { largeNumberFormat } from '../shared/pipes/large-number.pipe';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as chartUtil from '../shared/util/chart.util';

@Component({
  selector: 'metrics-user-agents-chart',
  template: `
    <prx-category-chart *ngIf="chartData && chartData.length && isBarChart" [data]="chartData" dataLabel="Downloads"></prx-category-chart>
    <prx-timeseries-chart *ngIf="chartData && chartData.length && !isBarChart" [type]="chartType"
                          [stacked]="stacked" [datasets]="chartData"
                          [formatX]="dateFormat()" [formatY]="largeNumberFormat" [minY]="minY"
                          [showPoints]="showPoints" [strokeWidth]="strokeWidth"
                          [pointRadius]="pointRadius" [pointRadiusOnHover]="pointRadiusOnHover">
    </prx-timeseries-chart>
    <div class="placeholder" *ngIf="!chartData || chartData.length === 0">
      <span *ngIf="noDataSelected">You have no data selected.</span>
    </div>
  `,
  styleUrls: ['./user-agents-chart.component.css']
})
export class UserAgentsChartComponent {
  @Input() chartData: CategoryChartModel[] | TimeseriesChartModel[];
  @Input() routerParams: RouterParams;
  @Input() groupsCharted: GroupCharted[];
  largeNumberFormat = largeNumberFormat;

  get isBarChart() {
    return this.routerParams && this.routerParams.chartType === CHARTTYPE_HORIZBAR;
  }

  get chartType(): string {
    return this.routerParams && chartUtil.c3ChartType(this.routerParams.chartType);
  }

  get stacked(): boolean {
    return this.routerParams && chartUtil.isStacked(this.routerParams.chartType);
  }

  dateFormat(): Function {
    return this.routerParams && chartUtil.chartDateFormat(this.routerParams.interval);
  }

  get showPoints(): boolean {
    return this.routerParams && chartUtil.showPoints(this.routerParams.chartType);
  }

  get strokeWidth(): number {
    return this.routerParams && chartUtil.strokeWidth(this.routerParams.chartType);
  }

  get pointRadius(): number {
    return this.routerParams && this.chartData && this.chartData.length && this.chartData[0]['data'] &&
      chartUtil.pointRadius(this.routerParams.chartType, this.chartData[0]['data'].length);
  }

  get pointRadiusOnHover(): number {
    return this.routerParams && chartUtil.pointRadiusOnHover(this.routerParams.chartType);
  }

  get minY(): number {
    return this.routerParams && chartUtil.minY(this.routerParams.chartType);
  }

  get noDataSelected(): boolean {
    return this.groupsCharted && this.groupsCharted.filter(g => g.charted && g.groupName !== 'Other').length === 0;
  }
}
