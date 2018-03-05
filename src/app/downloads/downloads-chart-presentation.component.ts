import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { RouterModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY,
  CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED } from '../ngrx';
import * as dateFormat from '../shared/util/date/date.format';
import { largeNumberFormat } from '../shared/pipes/large-number.pipe';

@Component({
  selector: 'metrics-downloads-chart-presentation',
  template: `
    <prx-timeseries-chart *ngIf="chartData" [type]="chartType" [stacked]="stacked" [datasets]="chartData"
                          [formatX]="dateFormat()" [formatY]="largeNumberFormat" [minY]="minY"
                          [showPoints]="showPoints" [strokeWidth]="strokeWidth"
                          [pointRadius]="pointRadius" [pointRadiusOnHover]="pointRadiusOnHover">
    </prx-timeseries-chart>
    <div class="placeholder" *ngIf="!chartData">
      You have no data selected. Would you like to view the <button class="btn-link" (click)="placeholder.emit()">Podcast chart</button>?
    </div>
  `,
  styleUrls: ['./downloads-chart-presentation.component.css']
})
export class DownloadsChartPresentationComponent {
  @Input() routerState: RouterModel;
  @Input() chartData: TimeseriesChartModel[];
  @Output() placeholder = new EventEmitter();
  largeNumberFormat = largeNumberFormat;

  dateFormat(): Function {
    if (this.routerState) {
      switch (this.routerState.interval) {
        case INTERVAL_MONTHLY:
          return dateFormat.monthDateYear;
        case INTERVAL_WEEKLY:
        case INTERVAL_DAILY:
          return dateFormat.monthDate;
        case INTERVAL_HOURLY:
          return dateFormat.hourly;
        default:
          return dateFormat.UTCString;
      }
    } else {
      return dateFormat.UTCString;
    }
  }

  get chartType(): string {
    if (this.chartData && this.chartData.length &&
      this.chartData[0].data && this.chartData[0].data.length <= 2) {
      return 'bar';
    } else {
      switch (this.routerState.chartType) {
        case CHARTTYPE_PODCAST:
        case CHARTTYPE_EPISODES:
          return 'line';
        case CHARTTYPE_STACKED:
          return 'area';
      }
    }
  }

  get stacked(): boolean {
    return this.routerState.chartType === CHARTTYPE_STACKED;
  }

  get showPoints(): boolean {
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
      case CHARTTYPE_EPISODES:
        return true;
      case CHARTTYPE_STACKED:
        return false;
    }
  }

  get strokeWidth(): number {
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
        return 3;
      case CHARTTYPE_EPISODES:
        return 2.5;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get pointRadius(): number {
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
        return this.chartData && this.chartData.length &&
        this.chartData[0].data && this.chartData[0].data.length <= 40 ? 3.75 : 0;
      case CHARTTYPE_EPISODES:
        return this.chartData && this.chartData.length &&
        this.chartData[0].data && this.chartData[0].data.length <= 20 ? 3.25 : 0;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get pointRadiusOnHover(): number {
    switch (this.routerState.chartType) {
      case CHARTTYPE_PODCAST:
        return 3.75;
      case CHARTTYPE_EPISODES:
        return 3.25;
      case CHARTTYPE_STACKED:
        return 1;
    }
  }

  get minY(): number {
    if (this.routerState.chartType === CHARTTYPE_EPISODES) {
      return 0;
    }
  }
}
