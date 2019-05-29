import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';

import { reducers } from '../../ngrx/reducers';
import { RouteDaysAction } from '../../ngrx/actions';
import { METRICSTYPE_DROPDAY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx';

import { DaysDropdownComponent } from './days-dropdown.component';

describe('DaysDropdownComponent', () => {
  let comp: DaysDropdownComponent;
  let fix: ComponentFixture<DaysDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DaysDropdownComponent
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DaysDropdownComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      comp.routerParams = {
        metricsType: METRICSTYPE_DROPDAY,
        days: 28,
        interval: INTERVAL_DAILY
      };
      comp.ngOnChanges();
    });
  }));

  it('should limit days according to interval', () => {
    comp.routerParams = {...comp.routerParams, interval: INTERVAL_HOURLY};
    comp.ngOnChanges();
    expect(comp.daysOptions).toEqual([1, 2, 3, 5, 7]);
  });

  it('should dispatch routing action when days is changed', () => {
    jest.spyOn(store, 'dispatch').mockImplementation(() => {});
    comp.onDaysChange(7);
    expect(store.dispatch).toHaveBeenCalledWith(new RouteDaysAction({days: 7}));
  });

  it('should close the dropdown on window scroll', done => {
    comp.open = true;
    window.addEventListener('scroll', (e) => {
      expect(comp.open).toBeFalsy();
      done();
    });
    window.dispatchEvent(new Event('scroll'));
  });
});
