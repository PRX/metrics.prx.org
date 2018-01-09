import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChartType } from '../../ngrx';

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
  @Output() chartTypeChange = new EventEmitter<ChartType>();
  chartTypes: ChartType[] = ['podcast', 'episodes', 'stacked'];

  onChartType(chartType: ChartType) {
    this.chartTypeChange.emit(chartType);
  }

  getChartImg(chartType: ChartType): string {
    switch (chartType) {
      case 'podcast':
        return '/assets/images/bt_single-line-chart.svg';
      case 'episodes':
        return '/assets/images/bt_multi-line-chart.svg';
      case 'stacked':
        return '/assets/images/bt_stacked-chart.svg';
    }
  }

  getChartName(chartType: ChartType): string {
    return chartType.charAt(0).toUpperCase() + chartType.slice(1);
  }
}
