import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';

import { reducers } from '@app/ngrx/reducers';
import { RouteInterval } from '@app/ngrx/actions';
import { INTERVAL_DAILY, INTERVAL_WEEKLY, METRICSTYPE_DOWNLOADS } from '@app/ngrx';
import * as dateUtil from '../util/date';

import { IntervalDropdownComponent } from './interval-dropdown.component';

describe('IntervalDropdownComponent', () => {
  let comp: IntervalDropdownComponent;
  let fix: ComponentFixture<IntervalDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntervalDropdownComponent],
      imports: [StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(IntervalDropdownComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        comp.routerParams = {
          metricsType: METRICSTYPE_DOWNLOADS,
          beginDate: dateUtil.beginningOfLastMonthUTC().toDate(),
          endDate: dateUtil.endOfLastMonthUTC().toDate(),
          interval: INTERVAL_DAILY
        };
        comp.ngOnChanges();
      });
  }));

  it('should set interval according to default routerParams', () => {
    expect(comp.selectedInterval).toEqual(INTERVAL_DAILY);
  });

  it('should limit interval according to begin and end dates', () => {
    expect(comp.intervalOptions.length).toEqual(4); // MONTHLY, WEEKLY, DAILY, and HOURLY
  });

  it('should dispatch routing action when interval is changed', () => {
    jest.spyOn(store, 'dispatch').mockImplementation(() => {});
    comp.onIntervalChange(INTERVAL_WEEKLY);
    expect(store.dispatch).toHaveBeenCalledWith(RouteInterval({ interval: INTERVAL_WEEKLY }));
  });

  it('should close the dropdown on window scroll', done => {
    comp.open = true;
    window.addEventListener('scroll', e => {
      expect(comp.open).toBeFalsy();
      done();
    });
    window.dispatchEvent(new Event('scroll'));
  });
});
