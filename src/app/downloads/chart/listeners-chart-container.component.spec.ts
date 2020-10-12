import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { reducers } from '@app/ngrx/reducers';
import { RouterParams, METRICSTYPE_LISTENERS, CHARTTYPE_LINE, INTERVAL_LASTWEEK } from '@app/ngrx';

import { SharedModule } from '@app/shared';
import { ListenersChartContainerComponent } from './listeners-chart-container.component';
import { ListenersChartPresentationComponent } from './listeners-chart-presentation.component';
import { routerParams } from '@testing/downloads.fixtures';
import * as dispatchHelper from '@testing/dispatch.helpers';

describe('ListenersChartContainerComponent', () => {
  let comp: ListenersChartContainerComponent;
  let fix: ComponentFixture<ListenersChartContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;
  const listenersRouterParams: RouterParams = {
    ...routerParams,
    metricsType: METRICSTYPE_LISTENERS,
    chartType: CHARTTYPE_LINE,
    interval: INTERVAL_LASTWEEK
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListenersChartContainerComponent, ListenersChartPresentationComponent],
      imports: [SharedModule, StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(ListenersChartContainerComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        dispatchHelper.dispatchRouterNavigation(store, listenersRouterParams);
        dispatchHelper.dispatchPodcastListeners(store);
        fix.detectChanges();
      });
  }));

  it('should have router params', done => {
    comp.routerParams$.pipe(first()).subscribe(result => {
      expect(result).toEqual(listenersRouterParams);
      done();
    });
  });

  it('should have chart data', done => {
    comp.chartData$.pipe(first()).subscribe(result => {
      expect(result.length).toEqual(1);
      done();
    });
  });
});
