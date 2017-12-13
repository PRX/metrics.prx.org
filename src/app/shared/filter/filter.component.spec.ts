import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterStub } from '../../../testing/stub.router';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';

import { FilterComponent } from './filter.component';
import { CustomDateRangeComponent } from './date/custom-date-range.component';
import { DateRangeComponent } from './date/date-range.component';
import { IntervalComponent } from './interval.component';
import { NextDateRangeComponent } from './date/next-date-range.component';
import { PrevDateRangeComponent } from './date/prev-date-range.component';
import { StandardDateRangeComponent } from './date/standard-date-range.component';

import { reducers } from '../../ngrx/reducers';
import { CastleFilterAction } from '../../ngrx/actions';
import { FilterModel, TODAY, YESTERDAY, TWO_WEEKS,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx/model';
import { beginningOfTodayUTC, endOfTodayUTC, beginningOfYesterdayUTC, endOfYesterdayUTC, beginningOfThisWeekUTC,
  beginningOfTwoWeeksUTC, beginningOfThisMonthUTC, getRange } from '../util/date.util';

const router = new RouterStub();

describe('FilterComponent', () => {
  let comp: FilterComponent;
  let fix: ComponentFixture<FilterComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const filter: FilterModel = {
    standardRange: TWO_WEEKS,
    range: getRange(TWO_WEEKS),
    beginDate: beginningOfTwoWeeksUTC().toDate(),
    endDate: endOfTodayUTC().toDate(),
    interval: INTERVAL_DAILY
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterComponent,
        CustomDateRangeComponent,
        DateRangeComponent,
        IntervalComponent,
        NextDateRangeComponent,
        PrevDateRangeComponent,
        StandardDateRangeComponent
      ],
      imports: [
        StoreModule.forRoot(reducers),
        DatepickerModule,
        SelectModule
      ],
      providers: [
        {provide: Router, useValue: router}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(FilterComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.store.dispatch(new CastleFilterAction({filter}));
    });
  }));

  it('should disable Apply button if the user has not made any changes', () => {
    expect(comp.applyDisabled).toEqual('disabled');
    comp.onIntervalChange(INTERVAL_HOURLY);
    expect(comp.applyDisabled).toBeNull();
  });

  it('should navigate to route on Apply', () => {
    spyOn(router, 'navigate').and.callThrough();
    comp.onDateRangeChange({
      standardRange: YESTERDAY,
      range: getRange(YESTERDAY),
      beginDate: beginningOfYesterdayUTC().toDate(),
      endDate: endOfYesterdayUTC().toDate()
    });
    comp.onApply();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should normalize dates to interval when interval is selected', () => {
    comp.filter.beginDate = beginningOfThisMonthUTC().hour(3).toDate();
    comp.onIntervalChange(INTERVAL_MONTHLY);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfThisMonthUTC().valueOf());
  });

  it('should normalize dates to interval on apply', () => {
    comp.filter.interval = INTERVAL_WEEKLY;
    comp.onDateRangeChange({
      standardRange: TODAY,
      range: getRange(TODAY),
      beginDate: beginningOfTodayUTC().toDate(),
      endDate: endOfTodayUTC().toDate()
    });
    comp.onApply();
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfThisWeekUTC().valueOf());
  });
});
