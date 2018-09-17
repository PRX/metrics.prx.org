import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TotalsTableRow, RouterParams, getGroupName, CHARTTYPE_HORIZBAR } from '../../ngrx/';
import { neutralColor, standardColor } from '../util/chart.util';

@Component({
  selector: 'metrics-totals-table',
  template: `
    <div>
      <div class="header row">
        <div>{{getGroupName(routerParams.metricsType, routerParams.group)}}</div>
        <div class="number charted">Downloads</div>
        <div class="number growth"></div>
      </div>
      <div class="row" *ngFor="let data of tableData?.slice(0, numRowsWithToggle)">
        <div>
          <prx-checkbox small [checked]="data.charted" [color]="getDataLegendColor(data)"
                        (change)="toggleEntry.emit({podcastId: routerParams.podcastId, groupName: data.label, charted: $event})">
            {{data.label}}
          </prx-checkbox>
        </div>
        <div class="number charted">{{data.value | largeNumber}} <span class="percent">({{data.percent.toPrecision(2)}}%)</span></div>
        <div class="number growth"></div>
      </div>
    </div>

    <div>
      <div *ngIf="tableData?.length > numRowsWithToggle && numRowsWithToggle > 0" class="other header row">
        <div>
          <prx-checkbox small [checked]="otherCharted" [color]="getOtherLegendColor()"
                        (change)="toggleEntry.emit({podcastId: routerParams.podcastId, groupName: 'Other', charted: $event})">
            Others:
          </prx-checkbox>
        </div>
      </div>
      <div class="other row" *ngFor="let data of tableData?.slice(numRowsWithToggle)">
        <div>{{data.label}}</div>
        <div class="number charted">{{data.value | largeNumber}} <span class="percent">({{data.percent.toPrecision(2)}}%)</span></div>
        <div class="number growth"></div>
      </div>
    </div>
  `,
  styleUrls: ['totals-table.component.css']
})

export class TotalsTableComponent {
  @Input() chartData: any[];
  @Input() tableData: TotalsTableRow[];
  @Input() numRowsWithToggle = 10;
  @Input() routerParams: RouterParams;
  @Output() toggleEntry = new EventEmitter<{podcastId: string, groupName: string, charted: boolean}>();
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
}
