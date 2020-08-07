import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectRouter } from '../../ngrx/reducers/selectors';
import { RouterParams, METRICSTYPE_DOWNLOADS, METRICSTYPE_DROPDAY, METRICSTYPE_LISTENERS } from '../../ngrx';

@Component({
  selector: 'metrics-menu-bar',
  template: `
    <ng-container *ngIf="routerParams$ | async as routerParams">
      <div class="menu-bar">
        <metrics-type-heading [routerParams]="routerParams"></metrics-type-heading>
        <div class="menu-dropdowns">
          <metrics-export-dropdown></metrics-export-dropdown>
          <div class="separator"></div>
          <metrics-episode-select *ngIf="showEpisodeSelect$ | async"></metrics-episode-select>
          <div class="separator" *ngIf="showEpisodeSelect$ | async"></div>
          <metrics-interval-dropdown [routerParams]="routerParams"></metrics-interval-dropdown>
          <div class="separator"></div>
          <ng-container *ngIf="showDaterangeDropdown$ | async; else dropdayMenu">
            <metrics-standard-date-range-dropdown [interval]="routerParams.interval" [standardRange]="routerParams.standardRange">
            </metrics-standard-date-range-dropdown>
            <metrics-custom-date-range-dropdown [routerParams]="routerParams"></metrics-custom-date-range-dropdown>
          </ng-container>
          <ng-template #dropdayMenu>
            <metrics-days-dropdown [routerParams]="routerParams"></metrics-days-dropdown>
          </ng-template>
        </div>
      </div>
      <div class="summary">
        <metrics-downloads-summary *ngIf="showDownloadsSummary$ | async"></metrics-downloads-summary>
        <metrics-chart-type [selectedChartType]="routerParams.chartType" [metricsType]="routerParams.metricsType"></metrics-chart-type>
      </div>
    </ng-container>
  `,
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  routerParams$: Observable<RouterParams>;
  showEpisodeSelect$: Observable<boolean>;
  showDownloadsSummary$: Observable<boolean>;
  showDaterangeDropdown$: Observable<boolean>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
    this.showEpisodeSelect$ = this.routerParams$.pipe(
      map(({ metricsType }) => metricsType !== METRICSTYPE_DOWNLOADS && metricsType !== METRICSTYPE_LISTENERS)
    );
    this.showDownloadsSummary$ = this.routerParams$.pipe(
      map(({ metricsType }) => metricsType !== METRICSTYPE_DROPDAY && metricsType !== METRICSTYPE_LISTENERS)
    );
    this.showDaterangeDropdown$ = this.routerParams$.pipe(map(({ metricsType }) => metricsType !== METRICSTYPE_DROPDAY));
  }
}
