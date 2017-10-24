import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { NextDateRangeComponent } from './next-date-range.component';

import { reducers } from '../../../ngrx/reducers';

import { CastleFilterAction } from '../../../ngrx/actions';
import { FilterModel, YESTERDAY, TWO_WEEKS, PRIOR_TWO_WEEKS, THIS_YEAR, LAST_YEAR, INTERVAL_DAILY } from '../../../ngrx/model';
import { beginningOfTodayUTC, endOfTodayUTC, beginningOfYesterdayUTC, endOfYesterdayUTC,
  beginningOfTwoWeeksUTC, beginningOfPriorTwoWeeksUTC, endOfPriorTwoWeeksUTC,
  beginningOfThisYearUTC, beginningOfLastYearUTC, endOfLastYearUTC, getRange } from '../../../shared/util/date.util';

describe('NextDateRangeComponent', () => {
  let comp: NextDateRangeComponent;
  let fix: ComponentFixture<NextDateRangeComponent>;
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
        NextDateRangeComponent
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(NextDateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.store.dispatch(new CastleFilterAction({filter}));
    });
  }));

  it('should disable NEXT button if the end date would be past the end of the current range', () => {
    expect(comp.nextDisabled).toEqual('disabled');
    const newFilter: FilterModel = {
      standardRange: PRIOR_TWO_WEEKS,
      range: getRange(PRIOR_TWO_WEEKS),
      beginDate: beginningOfPriorTwoWeeksUTC().toDate(),
      endDate: endOfPriorTwoWeeksUTC().toDate(),
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.nextDisabled).toBeNull();
  });

  it('should go to next range when NEXT button is clicked', () => {
    const newFilter: FilterModel = {
      standardRange: YESTERDAY,
      range: getRange(YESTERDAY),
      beginDate: beginningOfYesterdayUTC().toDate(),
      endDate: endOfYesterdayUTC().toDate(),
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    comp.next();
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfTodayUTC().valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('when NEXTing from LAST_YEAR, should go to THIS_YEAR and not extend past today', () => {
    const newFilter: FilterModel = {
      standardRange: LAST_YEAR,
      range: getRange(LAST_YEAR),
      beginDate: beginningOfLastYearUTC().toDate(),
      endDate: endOfLastYearUTC().toDate()
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.filter.standardRange).toEqual(LAST_YEAR);
    comp.next();
    expect(comp.filter.standardRange).toEqual(THIS_YEAR);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfThisYearUTC().valueOf());
    expect(comp.filter.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('when NEXTing from PRIOR_TWO_WEEKS, should go to TWO_WEEKS and not extend past today', () => {
    const newFilter: FilterModel = {
      standardRange: PRIOR_TWO_WEEKS,
      range: getRange(PRIOR_TWO_WEEKS),
      beginDate: beginningOfPriorTwoWeeksUTC().toDate(),
      endDate: endOfPriorTwoWeeksUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.filter.standardRange).toEqual(PRIOR_TWO_WEEKS);
    comp.next();
    expect(comp.filter.standardRange).toEqual(TWO_WEEKS);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfTwoWeeksUTC().valueOf());
    expect(comp.filter.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });
});
