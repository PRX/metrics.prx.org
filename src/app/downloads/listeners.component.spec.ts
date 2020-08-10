import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule, Store } from '@ngrx/store';

import { FancyFormModule } from 'ngx-prx-styleguide';
import { SharedModule } from '@app/shared';
import { ListenersComponent } from './listeners.component';
import { ListenersChartContainerComponent } from './chart/listeners-chart-container.component';
import { ListenersChartPresentationComponent } from './chart/listeners-chart-presentation.component';

import { RouterParams, METRICSTYPE_LISTENERS, CHARTTYPE_LINE, INTERVAL_LASTWEEK } from '@app/ngrx';
import { reducers } from '@app/ngrx/reducers';

import { routerParams } from '@testing/downloads.fixtures';
import * as dispatchHelper from '@testing/dispatch.helpers';

describe('Listeners Component', () => {
  let comp: ListenersComponent;
  let fix: ComponentFixture<ListenersComponent>;
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
      declarations: [ListenersComponent, ListenersChartContainerComponent, ListenersChartPresentationComponent],
      imports: [SharedModule, FancyFormModule, StoreModule.forRoot(reducers)],
      providers: []
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(ListenersComponent);
        comp = fix.componentInstance;
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.get(Store);

        dispatchHelper.dispatchRouterNavigation(store, listenersRouterParams);
      });
  }));

  it('should show loading spinner when loading', () => {
    dispatchHelper.dispatchLoadPodcastListeners(store);
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).not.toBeNull();
  });

  it('should show a listeners chart', () => {
    dispatchHelper.dispatchPodcastListeners(store);
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).toBeNull();
    expect(de.query(By.css('metrics-listeners-chart'))).not.toBeNull();
  });
});
