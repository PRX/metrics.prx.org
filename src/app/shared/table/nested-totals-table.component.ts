import { Component, Input, Output, EventEmitter } from '@angular/core';
import {TotalsTableRow, RouterParams, getGroupName, CHARTTYPE_HORIZBAR, GROUPTYPE_GEOSUBDIV} from '../../ngrx/';
import * as ACTIONS from '../../ngrx/actions';
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
      <div *ngFor="let data of tableData">
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
          </div>
          <div class="nested-row" *ngIf="nestedDataLoading && !nestedData?.length">
            <div></div>
            <prx-spinner></prx-spinner>
          </div>
          <div class="nested-row" *ngIf="nestedDataLoaded && !nestedData?.length">
            <div>No results</div>
            <div class="charted"></div>
          </div>
          <div class="nested-row" *ngIf="nestedDataError">
            <metrics-error-retry [retryActions]="nestedDataRetryAction"></metrics-error-retry>
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
  @Input() nestedDataLoading: boolean;
  @Input() nestedDataLoaded: boolean;
  @Input() nestedDataError: any;
  @Input() numRowsWithToggle = 10;
  @Input() routerParams: RouterParams;
  @Output() toggleEntry = new EventEmitter<{podcastId: string, groupName: string, charted: boolean}>();
  @Output() discloseNestedData = new EventEmitter<string>();
  getGroupName = getGroupName;

  get nestedDataRetryAction() {
    return [new ACTIONS.CastlePodcastTotalsLoadAction({
      id: this.routerParams.podcastId,
      group: GROUPTYPE_GEOSUBDIV,
      filter: this.routerParams.filter,
      beginDate: this.routerParams.beginDate,
      endDate: this.routerParams.endDate
    })];
  }

  onAccordion(event: Event, data: TotalsTableRow) {
    this.discloseNestedData.emit(event.target['checked'] ? data.code : undefined);
  }
}