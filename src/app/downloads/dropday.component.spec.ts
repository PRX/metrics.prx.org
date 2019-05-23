import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule, Store } from '@ngrx/store';

import { FancyFormModule } from 'ngx-prx-styleguide';
import { SharedModule } from '@app/shared';
import { DropdayComponent } from './dropday.component';
import { DropdayChartContainerComponent } from './chart/dropday-chart-container.component';
import { DropdayChartPresentationComponent } from './chart/dropday-chart-presentation.component';
import { DropdayTableComponent } from './table/dropday-table.component';
import { SummaryTableComponent } from './table/summary-table.component';
import { PlaceholderComponent } from './placeholder.component';

import { RouterParams, CHARTTYPE_EPISODES, METRICSTYPE_DROPDAY } from '@app/ngrx';
import { reducers } from '@app/ngrx/reducers';

import { routerParams, episodes } from '@testing/downloads.fixtures';
import * as dispatchHelper from '@testing/dispatch.helpers';

describe('DropdayComponent', () => {
  let comp: DropdayComponent;
  let fix: ComponentFixture<DropdayComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;
  const dropdayRouterParams: RouterParams = {...routerParams, metricsType: METRICSTYPE_DROPDAY, chartType: CHARTTYPE_EPISODES};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropdayComponent,
        DropdayChartContainerComponent,
        DropdayChartPresentationComponent,
        DropdayTableComponent,
        SummaryTableComponent,
        PlaceholderComponent
      ],
      imports: [
        SharedModule,
        FancyFormModule,
        StoreModule.forRoot(reducers)
      ],
      providers: []
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DropdayComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      dispatchHelper.dispatchRouterNavigation(store, dropdayRouterParams);
    });
  }));

  it('should show loading spinner when loading', () => {
    dispatchHelper.dispatchLoadEpisodeDropday(store);
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
  });

  it('should show a downloads table', () => {
    dispatchHelper.dispatchEpisodePage(store);
    dispatchHelper.dispatchEpisodeSelectList(store);
    dispatchHelper.dispatchSelectEpisodes(store, routerParams.podcastId, METRICSTYPE_DROPDAY, [episodes[0].guid, episodes[1].guid]);
    dispatchHelper.dispatchEpisodeDropday(store);
    dispatchHelper.dispatchEpisodeAllTimeDownloads(store);
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-dropday-table'))).not.toBeNull();
  });

});
