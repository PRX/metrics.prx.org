import { Component, Input } from '@angular/core';
import {
  CHARTTYPE_HORIZBAR,
  CHARTTYPE_LINE,
  CHARTTYPE_STACKED,
  INTERVAL_DAILY,
  INTERVAL_MONTHLY,
  INTERVAL_WEEKLY
} from '../ngrx';
import * as dateFormat from '../shared/util/date/';
import { largeNumberFormat } from '../shared/pipes/large-number.pipe';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';

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
      You have no data selected.
    </div>
  `,
  styleUrls: ['./user-agents-chart.component.css']
})
export class UserAgentsChartComponent {
  @Input() chartData: CategoryChartModel[] | TimeseriesChartModel[];
  @Input() routerParams;
  largeNumberFormat = largeNumberFormat;

  get isBarChart() {
    return this.routerParams.chartType === CHARTTYPE_HORIZBAR;
  }

  get chartType(): string {
    switch (this.routerParams.chartType) {
      case CHARTTYPE_HORIZBAR:
        return 'bar';
      case CHARTTYPE_LINE:
        return 'line';
      case CHARTTYPE_STACKED:
        return 'area';
    }
  }

  get stacked(): boolean {
    return this.routerParams.chartType === CHARTTYPE_STACKED;
  }

  dateFormat(): Function {
    switch (this.routerParams.interval) {
      case INTERVAL_MONTHLY:
        return dateFormat.monthDateYear;
      case INTERVAL_WEEKLY:
      case INTERVAL_DAILY:
      default:
        return dateFormat.monthDate;
    }
  }

  get showPoints(): boolean {
    switch (this.routerParams.chartType) {
      case CHARTTYPE_HORIZBAR:
      case CHARTTYPE_LINE:
        return true;
      case CHARTTYPE_STACKED:
        return false;
    }
  }

  get strokeWidth(): number {
    switch (this.routerParams.chartType) {
      case CHARTTYPE_HORIZBAR:
        return 3;
      case CHARTTYPE_LINE:
        return 2.5;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get pointRadius(): number {
    switch (this.routerParams.chartType) {
      case CHARTTYPE_HORIZBAR:
        return this.chartData && this.chartData.length &&
        this.chartData[0]['data'] && this.chartData[0]['data'].length <= 20 ? 3.75 : 0;
      case CHARTTYPE_LINE:
        return this.chartData && this.chartData.length &&
            this.chartData[0]['data'] && this.chartData[0]['data'].length <= 20 ? 3.25 : 0;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get pointRadiusOnHover(): number {
    switch (this.routerParams.chartType) {
      case CHARTTYPE_HORIZBAR:
        return 3.75;
      case CHARTTYPE_LINE:
        return 3.25;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get minY(): number {
    if (this.routerParams.chartType === CHARTTYPE_LINE) {
      return 0;
    }
  }
}
