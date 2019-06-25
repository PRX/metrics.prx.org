import { Component, Input } from '@angular/core';
import { IndexedChartModel, CategoryChartModel } from 'ngx-prx-styleguide';
import { RouterParams, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY } from '@app/ngrx';
import { largeNumberFormat } from '@app/shared/pipes/large-number.pipe';

@Component({
  selector: 'metrics-dropday-chart-presentation',
  template: `
    <ng-container *ngIf="chartData && chartData.length">
      <prx-indexed-chart type="spline" [datasets]="chartData" [formatY]="formatY"></prx-indexed-chart>
      <p>{{intervalLabel}} since drop</p>
    </ng-container>
  `,
  styleUrls: ['./dropday-chart-presentation.component.css']
})
export class DropdayChartPresentationComponent {
  @Input() routerParams: RouterParams;
  @Input() chartData: IndexedChartModel[] | CategoryChartModel[];

  formatX(s: string) {
    // TODO: format day0 as "Drop" but chart displays _all_ ticks when formatted ugh
    return parseInt(s, 10) === 0 ? 'Drop' : s;
  }
  formatY(y: number) {
    return largeNumberFormat(y);
  }

  get intervalLabel(): string {
    switch (this.routerParams.interval) {
      case INTERVAL_HOURLY:
        return 'Hours';
      case INTERVAL_DAILY:
        return 'Days';
      case INTERVAL_WEEKLY:
        return 'Weeks';
      case INTERVAL_MONTHLY:
        return 'Months';
    }
  }
}
