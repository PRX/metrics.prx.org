import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { DateRangeComponent } from './custom-date-range.component';

import { reducers } from '../../../ngrx/reducers';

import { FilterModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../../ngrx/model';
import { CastleFilterAction } from '../../../ngrx/actions';

describe('CustomDateRangeComponent', () => {
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
        StoreModule.forRoot(reducers)
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
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.filter.beginDate.valueOf()).toEqual(utcBeginDate.valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(utcEndDate.valueOf());
  });

  it('should not allow users to select dates more than 10 days apart when interval is 15 minutes', () => {
    const today = new Date();
    const utcEndDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
    const utcBeginDate = new Date(utcEndDate.valueOf() - (14 * 24 * 60 * 60 * 1000) + 1); // 14 days prior at 0:0:0
    filter = {
      beginDate: utcBeginDate,
      endDate: utcEndDate,
      interval: INTERVAL_15MIN
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.invalid).toContain('cannot be more than 10 days apart');
  });

  it('should not allow users to select dates more than 40 days apart when interval is hourly', () => {
    const today = new Date();
    const utcEndDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
    const utcBeginDate = new Date(utcEndDate.valueOf() - (41 * 24 * 60 * 60 * 1000) + 1); // 41 days prior at 0:0:0
    filter = {
      beginDate: utcBeginDate,
      endDate: utcEndDate,
      interval: INTERVAL_HOURLY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.invalid).toContain('cannot be more than 40 days apart');
  });
});
