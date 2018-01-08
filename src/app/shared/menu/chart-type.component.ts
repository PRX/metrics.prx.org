import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartType } from '../../ngrx';
import { CastleFilterAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-chart-type',
  template: `
    <button class="btn-link" *ngFor="let chartType of chartTypes"
            [class.active]="chartType === selectedChartType"
            (click)="onChartType(chartType)"><img [src]="getChartImg(chartType)" [alt]="getChartName(chartType)"></button>
  `,
  styleUrls: ['./chart-type.component.css']
})
export class ChartTypeComponent {
  @Input() selectedChartType: ChartType;
  chartTypes: ChartType[] = ['single-line', 'multi-line', 'stacked'];

  constructor(public store: Store<any>) {}

  onChartType(chartType: ChartType) {
    this.store.dispatch(new CastleFilterAction({filter: {chartType}}));
  }

  getChartImg(chartType: ChartType): string {
    switch (chartType) {
      case 'single-line':
        return '/assets/images/bt_stacked-chart.svg';
      case 'multi-line':
        return '/assets/images/bt_stacked-chart.svg';
      case 'stacked':
        return '/assets/images/bt_stacked-chart.svg';
    }
  }

  getChartName(chartType: ChartType): string {
    switch (chartType) {
      case 'single-line':
        return 'Podcast';
      case 'multi-line':
        return 'Episodes';
      case 'stacked':
        return 'Stacked';
    }
  }
}
