import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TotalsTableRow, RouterParams, getGroupName, CHARTTYPE_HORIZBAR } from '../../ngrx/';
import { neutralColor, standardColor } from '../util/chart.util';

@Component({
  selector: 'metrics-nested-totals-table',
  template: `
    <div>
      <div class="header primary-row">
        <div>{{getGroupName(routerParams.metricsType, routerParams.group)}}</div>
        <div class="number charted">Downloads</div>
        <div class="number percent">%</div>
        <div class="number growth"></div>
      </div>
      <div *ngFor="let data of tableData?.slice(numRowsWithToggle)">
        <div class="primary-row">
          <div>
            <input type="checkbox"
                   [id]="data.code" class="accordion"
                   [checked]="routerParams?.filter === data.code"
                   (change)="onAccordion($event, data)">
            <label [for]="data.code"><span class="triangle"></span>{{data.label}}</label>
          </div>
          <div class="number charted">{{data.value | largeNumber}} <span class="percent">({{data.percent.toPrecision(2)}}%)</span></div>
          <div class="number percent">({{data.percent.toPrecision(2)}}%)</div>
          <div class="number growth"></div>
        </div>
        <div *ngIf="data.code === routerParams?.filter">
          <div class="nested-row" *ngFor="let nested of nestedData">
            <div>{{nested.label}}</div>
            <div class="number charted">{{nested.value | largeNumber}}</div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['nested-totals-table.component.css']
})

export class NestedTotalsTableComponent {
  @Input() chartData: any[];
  @Input() tableData: TotalsTableRow[];
  @Input() nestedData: TotalsTableRow[];
  @Input() numRowsWithToggle = 10;
  @Input() routerParams: RouterParams;
  @Output() toggleEntry = new EventEmitter<{podcastId: string, groupName: string, charted: boolean}>();
  @Output() discloseNestedData = new EventEmitter<string>();
  getGroupName = getGroupName;

  get otherCharted() {
    return this.chartData && !!this.chartData.find(entry => entry['label'] === 'Other');
  }

  getDataLegendColor(data: TotalsTableRow) {
    return this.routerParams.chartType === CHARTTYPE_HORIZBAR ? standardColor : data.color;
  }

  getOtherLegendColor() {
    return this.routerParams.chartType === CHARTTYPE_HORIZBAR ? standardColor : neutralColor;
  }

  onAccordion(event: Event, data: TotalsTableRow) {
    this.discloseNestedData.emit(event.target['checked'] ? data.code : undefined);
  }
}
