import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { reducers } from '@app/ngrx/reducers';

import { METRICSTYPE_DROPDAY, CHARTTYPE_HORIZBAR, RouterParams } from '@app/ngrx';

import { SharedModule } from '@app/shared';
import { DropdayChartContainerComponent } from './dropday-chart-container.component';
import { DropdayChartPresentationComponent } from './dropday-chart-presentation.component';
import { routerParams, episodes } from '@testing/downloads.fixtures';
import * as dispatchHelper from '@testing/dispatch.helpers';

describe('DropdayChartContainerComponent', () => {
  let comp: DropdayChartContainerComponent;
  let fix: ComponentFixture<DropdayChartContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;
  const dropdayRouterParams: RouterParams = { ...routerParams, metricsType: METRICSTYPE_DROPDAY, chartType: CHARTTYPE_HORIZBAR };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdayChartContainerComponent, DropdayChartPresentationComponent],
      imports: [SharedModule, StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(DropdayChartContainerComponent);
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
      });
  }));

  it('should have router params', done => {
    comp.routerParams$.pipe(first()).subscribe(result => {
      expect(result).toEqual(dropdayRouterParams);
      done();
    });
  });

  it('should have chart data', done => {
    comp.chartData$.pipe(first()).subscribe(result => {
      expect(result.length).toEqual(episodes.length);
      done();
    });
  });
});
