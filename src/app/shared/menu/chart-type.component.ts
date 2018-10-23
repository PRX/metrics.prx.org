import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ChartType, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED,
  CHARTTYPE_GEOCHART, CHARTTYPE_HORIZBAR, CHARTTYPE_LINE,
  MetricsType, METRICSTYPE_DOWNLOADS, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES
} from '../../ngrx';
import { RouteChartTypeAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-chart-type',
  template: `
    <button class="btn-link" *ngFor="let chartType of chartTypes"
            [class.active]="chartType === selectedChartType"
            [disabled]="chartType === selectedChartType"
            [title]="getTooltip(chartType)"
            (click)="onChartType(chartType)"><img [src]="getChartImg(chartType)"></button>
  `,
  styleUrls: ['./chart-type.component.css']
})
export class ChartTypeComponent {
  @Input() metricsType: MetricsType;
  @Input() selectedChartType: ChartType;

  constructor(private store: Store<any>) {}

  get chartTypes(): ChartType[] {
    switch (this.metricsType) {
      case METRICSTYPE_DOWNLOADS:
        return [CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED];
      case METRICSTYPE_DEMOGRAPHICS:
        return [CHARTTYPE_GEOCHART, CHARTTYPE_LINE, CHARTTYPE_STACKED];
      case METRICSTYPE_TRAFFICSOURCES:
        return [CHARTTYPE_HORIZBAR, CHARTTYPE_LINE, CHARTTYPE_STACKED];
    }
  }

  onChartType(chartType: ChartType) {
    this.store.dispatch(new RouteChartTypeAction({chartType}));
  }

  getChartImg(chartType: ChartType): string {
    switch (chartType) {
      case CHARTTYPE_GEOCHART:
        return '/assets/images/ic_globe_blue.svg';
      case CHARTTYPE_HORIZBAR:
        return './assets/images/bt_horizbar-chart.svg';
      case CHARTTYPE_PODCAST:
        return '/assets/images/bt_bar-chart.svg';
      case CHARTTYPE_LINE:
      case CHARTTYPE_EPISODES:
        return '/assets/images/bt_multi-line-chart.svg';
      case CHARTTYPE_STACKED:
        return '/assets/images/bt_stacked-chart.svg';
    }
  }

  getTooltip(chartType: ChartType): string {
    switch (chartType) {
      case CHARTTYPE_GEOCHART:
        return 'GEOGRAPHIC';
      case CHARTTYPE_HORIZBAR:
        return 'HORIZONTAL BAR';
      case CHARTTYPE_PODCAST:
        return 'BAR';
      case CHARTTYPE_LINE:
      case CHARTTYPE_EPISODES:
        return 'MULTI-LINE';
      case CHARTTYPE_STACKED:
        return 'STACKED';
    }
  }
}
