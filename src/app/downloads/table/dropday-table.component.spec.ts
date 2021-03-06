import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { reducers } from '@app/ngrx/reducers';

import { METRICSTYPE_DROPDAY, CHARTTYPE_HORIZBAR, RouterParams } from '@app/ngrx';

import { SharedModule } from '@app/shared';
import { DropdayTableComponent } from './dropday-table.component';
import { SummaryTableComponent } from './summary-table.component';
import { routerParams, episodes } from '@testing/downloads.fixtures';
import * as dispatchHelper from '@testing/dispatch.helpers';

describe('DropdayTableComponent', () => {
  let comp: DropdayTableComponent;
  let fix: ComponentFixture<DropdayTableComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;
  const dropdayRouterParams: RouterParams = { ...routerParams, metricsType: METRICSTYPE_DROPDAY, chartType: CHARTTYPE_HORIZBAR };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdayTableComponent, SummaryTableComponent],
      imports: [FancyFormModule, SharedModule, StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(DropdayTableComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        dispatchHelper.dispatchRouterNavigation(store, dropdayRouterParams);
        dispatchHelper.dispatchEpisodePage(store);
        dispatchHelper.dispatchEpisodeSelectList(store);
        dispatchHelper.dispatchSelectEpisodes(store, routerParams.podcastId, METRICSTYPE_DROPDAY, [episodes[0].guid, episodes[1].guid]);
        dispatchHelper.dispatchEpisodeDropday(store);
        dispatchHelper.dispatchEpisodeAllTimeDownloads(store);
      });
  }));

  it('should have chart type', done => {
    comp.chartType$.pipe(first()).subscribe(result => {
      expect(result).toEqual(CHARTTYPE_HORIZBAR);
      done();
    });
  });

  it('should have table data', done => {
    comp.episodeTableData$.pipe(first()).subscribe(result => {
      expect(result.length).toEqual(episodes.length);
      done();
    });
  });
});
