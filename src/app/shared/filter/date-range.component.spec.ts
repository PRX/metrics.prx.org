import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { DateRangeComponent } from './date-range.component';

import { FilterReducer } from '../../ngrx/reducers/filter.reducer';

import { FilterModel, INTERVAL_DAILY } from '../../ngrx/model';
import { castleFilter } from '../../ngrx/actions/castle.action.creator';

describe('DateRangeComponent', () => {
  let comp: DateRangeComponent;
  let fix: ComponentFixture<DateRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let filter: FilterModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateRangeComponent
      ],
      imports: [
        DatepickerModule,
        StoreModule.forRoot({
          filter: FilterReducer
        })
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should initialize date and time picker according to default filter', () => {
    const today = new Date();
    const utcEndDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
    const utcBeginDate = new Date(utcEndDate.valueOf() - (14 * 24 * 60 * 60 * 1000) + 1); // 14 days prior at 0:0:0
    filter = {
      beginDate: utcBeginDate,
      endDate: utcEndDate,
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(castleFilter(filter));
    expect(comp.filter.beginDate.valueOf()).toEqual(utcBeginDate.valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(utcEndDate.valueOf());
  });
});
