import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterParams, INTERVAL_HOURLY } from '../ngrx';
import { largeNumberFormat } from '../shared/pipes/large-number.pipe';
import * as chartUtil from '../shared/util/chart.util';

@Component({
  selector: 'metrics-downloads-chart-presentation',
  template: `
    <prx-timeseries-chart *ngIf="chartData" [type]="chartType" [stacked]="stacked" [datasets]="chartData"
                          [formatX]="dateFormat()" [formatY]="largeNumberFormat" [minY]="minY"
                          [showPoints]="showPoints" [strokeWidth]="strokeWidth"
                          [pointRadius]="pointRadius" [pointRadiusOnHover]="pointRadiusOnHover"
                          [maxTicks]="maxTicks">
    </prx-timeseries-chart>
    <div class="placeholder" *ngIf="!chartData">
      You have no data selected. Would you like to view the <button class="btn-link" (click)="placeholder.emit()">Podcast chart</button>?
    </div>
  `,
  styleUrls: ['./downloads-chart-presentation.component.css']
})
export class DownloadsChartPresentationComponent {
  @Input() routerParams: RouterParams;
  @Input() chartData: TimeseriesChartModel[];
  @Output() placeholder = new EventEmitter();
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

  get maxTicks(): number {
    if (this.routerParams.interval === INTERVAL_HOURLY) {
      return 48;
    }
  }
}
