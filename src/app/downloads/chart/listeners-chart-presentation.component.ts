import { Component, Input } from '@angular/core';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterParams } from '@app/ngrx';
import { largeNumberFormat } from '@app/shared/pipes/large-number.pipe';
import * as chartUtil from '@app/shared/util/chart.util';

@Component({
  selector: 'metrics-listeners-chart-presentation',
  template: `
    <prx-timeseries-chart
      *ngIf="chartData"
      type="line"
      [datasets]="chartData"
      [formatX]="dateFormat()"
      [formatY]="largeNumberFormat"
      [minY]="minY"
      [showPoints]="showPoints"
      [strokeWidth]="strokeWidth"
      [pointRadius]="pointRadius"
      [pointRadiusOnHover]="pointRadiusOnHover"
    >
    </prx-timeseries-chart>
  `
})
export class ListenersChartPresentationComponent {
  @Input() routerParams: RouterParams;
  @Input() chartData: TimeseriesChartModel[];
  largeNumberFormat = largeNumberFormat;

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
    return (
      this.routerParams &&
      this.chartData &&
      this.chartData.length &&
      this.chartData[0]['data'] &&
      chartUtil.pointRadius(this.routerParams.chartType, this.chartData[0]['data'].length)
    );
  }

  get pointRadiusOnHover(): number {
    return this.routerParams && chartUtil.pointRadiusOnHover(this.routerParams.chartType);
  }

  get minY(): number {
    return this.routerParams && chartUtil.minY(this.routerParams.chartType);
  }
}
