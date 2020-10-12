import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { reducers } from '../../ngrx/reducers';
import { RouteChartType } from '../../ngrx/actions';
import { CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED, METRICSTYPE_DOWNLOADS } from '../../ngrx';

import { ChartTypeComponent } from './chart-type.component';

describe('ChartTypeComponent', () => {
  let comp: ChartTypeComponent;
  let fix: ComponentFixture<ChartTypeComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartTypeComponent],
      imports: [StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(ChartTypeComponent);
        comp = fix.componentInstance;
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.get(Store);
        comp.metricsType = METRICSTYPE_DOWNLOADS;
        fix.detectChanges();

        jest.spyOn(store, 'dispatch');
      });
  }));

  it('should dispatch routing event on button click', () => {
    const buttons = de.queryAll(By.css('button'));
    buttons.forEach(b => b.nativeElement.click());
    expect(store.dispatch).toHaveBeenCalledTimes(buttons.length);
    expect(store.dispatch).toHaveBeenCalledWith(RouteChartType({ chartType: CHARTTYPE_PODCAST }));
    expect(store.dispatch).toHaveBeenCalledWith(RouteChartType({ chartType: CHARTTYPE_EPISODES }));
    expect(store.dispatch).toHaveBeenCalledWith(RouteChartType({ chartType: CHARTTYPE_STACKED }));
  });
});
