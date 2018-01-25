import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartType, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED } from '../../ngrx';
import { RouteChartTypeAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-chart-type',
  template: `
    <button class="btn-link" *ngFor="let chartType of chartTypes"
            [class.active]="chartType === selectedChartType" [title]="getChartName(chartType)"
            (click)="onChartType(chartType)"><img [src]="getChartImg(chartType)"></button>
  `,
  styleUrls: ['./chart-type.component.css']
})
export class ChartTypeComponent {
  @Input() selectedChartType: ChartType;
  chartTypes: ChartType[] = ['podcast', 'episodes', 'stacked'];

  constructor(private store: Store<any>) {}

  onChartType(chartType: ChartType) {
    this.store.dispatch(new RouteChartTypeAction({chartType}));
  }

  getChartImg(chartType: ChartType): string {
    switch (chartType) {
      case CHARTTYPE_PODCAST:
        return '/assets/images/bt_single-line-chart.svg';
      case CHARTTYPE_EPISODES:
        return '/assets/images/bt_multi-line-chart.svg';
      case CHARTTYPE_STACKED:
        return '/assets/images/bt_stacked-chart.svg';
    }
  }

  getChartName(chartType: ChartType): string {
    return chartType.charAt(0).toUpperCase() + chartType.slice(1);
  }
}
