import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Action } from '@ngrx/store';
import { TotalsTableRow, RouterParams, getGroupName } from '../../ngrx/';

@Component({
  selector: 'metrics-nested-totals-table',
  template: `
    <div>
      <div class="header primary-row" *ngIf="tableData?.length">
        <div>{{ getGroupName(routerParams.metricsType, routerParams.group) }}</div>
        <div class="number charted">Downloads</div>
        <div class="number percent">%</div>
        <div class="number growth"></div>
      </div>
      <div *ngFor="let data of tableData">
        <div class="primary-row">
          <div>
            <input
              type="checkbox"
              [id]="data.code"
              class="accordion"
              [checked]="routerParams?.filter === data.code"
              (change)="onAccordion($event, data)"
            />
            <label [for]="data.code" [title]="data.label">
              <span class="triangle"></span><span class="label">{{ data.label }}</span>
            </label>
          </div>
          <div class="number charted">
            {{ data.value | largeNumber }} <span class="percent">({{ data.percent.toPrecision(2) }}%)</span>
          </div>
          <div class="number percent">({{ data.percent.toPrecision(2) }}%)</div>
          <div class="number growth"></div>
        </div>
        <div *ngIf="data.code === routerParams?.filter">
          <div class="nested-row" *ngFor="let nested of nestedData">
            <div>{{ nested.label }}</div>
            <div class="number charted">{{ nested.value | largeNumber }}</div>
          </div>
          <div class="nested-row" *ngIf="nestedDataLoading && !nestedData?.length">
            <div></div>
            <prx-spinner></prx-spinner>
            <prx-spinner inverse="true" class="mobile-spinner"></prx-spinner>
          </div>
          <div class="nested-row" *ngIf="nestedDataLoaded && !nestedData?.length">
            <div>No results</div>
            <div class="charted"></div>
          </div>
          <div class="nested-row" *ngIf="nestedDataErrorActions?.length">
            <metrics-error-retry [retryActions]="nestedDataErrorActions"></metrics-error-retry>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['nested-totals-table.component.css']
})
export class NestedTotalsTableComponent {
  @Input() tableData: TotalsTableRow[];
  @Input() nestedData: TotalsTableRow[];
  @Input() nestedDataLoading: boolean;
  @Input() nestedDataLoaded: boolean;
  @Input() nestedDataErrorActions: Action[];
  @Input() routerParams: RouterParams;
  @Output() discloseNestedData = new EventEmitter<string>();
  getGroupName = getGroupName;

  onAccordion(event: Event, data: TotalsTableRow) {
    this.discloseNestedData.emit(event.target['checked'] ? data.code : undefined);
  }
}
