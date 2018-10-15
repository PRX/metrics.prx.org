import { Component, Input } from '@angular/core';
import { RouterParams } from '../ngrx';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { largeNumberFormat } from '../shared/pipes/large-number.pipe';
import * as chartUtil from '../shared/util/chart.util';

@Component({
  selector: 'metrics-geo-chart',
  template: `
    <prx-timeseries-chart *ngIf="chartData && chartData.length" [type]="chartType"
                          [stacked]="stacked" [datasets]="chartData"
                          [formatX]="dateFormat()" [formatY]="largeNumberFormat" [minY]="minY"
                          [showPoints]="showPoints" [strokeWidth]="strokeWidth"
                          [pointRadius]="pointRadius" [pointRadiusOnHover]="pointRadiusOnHover">
    </prx-timeseries-chart>
  `
})
export class GeoChartComponent {
  @Input() chartData: TimeseriesChartModel[];
  @Input() routerParams: RouterParams;
  largeNumberFormat = largeNumberFormat;

  dateFormat(): Function {
    return this.routerParams && chartUtil.chartDateFormat(this.routerParams.interval);
  }

  get chartType(): string {
    return this.routerParams && chartUtil.c3ChartType(this.routerParams.chartType);
  }

  get stacked(): boolean {
    return this.routerParams && chartUtil.isStacked(this.routerParams.chartType);
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
}
