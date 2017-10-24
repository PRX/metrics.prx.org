import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PrevDateRangeComponent } from './prev-date-range.component';

import { reducers } from '../../../ngrx/reducers';

import { CastleFilterAction } from '../../../ngrx/actions';
import { FilterModel, TODAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THREE_MONTHS, PRIOR_THREE_MONTHS } from '../../../ngrx/model';
import { getRange, beginningOfTodayUTC, endOfTodayUTC,
  beginningOfThisWeekUTC, beginningOfLastWeekUTC, endOfLastWeekUTC,
  beginningOfThisMonthUTC, beginningOfLastMonthUTC, endOfLastMonthUTC,
  beginningOfPriorThreeMonthsUTC, endOfPriorThreeMonthsUTC } from '../../../shared/util/date.util';

describe('PrevDateRangeComponent', () => {
  let comp: PrevDateRangeComponent;
  let fix: ComponentFixture<PrevDateRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrevDateRangeComponent
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(PrevDateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should disable PREV button if there is not been a standard range selected', () => {
    expect(comp.prevDisabled).toEqual('disabled');
    const newFilter: FilterModel = {
      beginDate: beginningOfTodayUTC().add(1, 'hour').toDate(), // not a valid option
      endDate: endOfTodayUTC().toDate(),
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.prevDisabled).toEqual('disabled');
    const newerFilter: FilterModel = {
      standardRange: TODAY,
      range: getRange(TODAY),
      beginDate: beginningOfTodayUTC().toDate(), // not a valid option
      endDate: endOfTodayUTC().toDate(),
    };
    comp.store.dispatch(new CastleFilterAction({filter: newerFilter}));
    expect(comp.prevDisabled).toBeNull();
  });

  it('should go to prev range when PREV button is click', () => {
    const newFilter: FilterModel = {
      standardRange: THIS_WEEK,
      range: getRange(THIS_WEEK),
      beginDate: beginningOfThisWeekUTC().toDate(),
      endDate: endOfTodayUTC().toDate(),
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.filter.standardRange).toEqual(THIS_WEEK);
    comp.prev();
    expect(comp.filter.standardRange).toEqual(LAST_WEEK);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfLastWeekUTC().valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(endOfLastWeekUTC().valueOf());
  });

  it('when PREVing from THIS_MONTH, should go to LAST_MONTH', () => {
    const newFilter: FilterModel = {
      standardRange: THIS_MONTH,
      range: getRange(THIS_MONTH),
      beginDate: beginningOfThisMonthUTC().toDate(),
      endDate: endOfTodayUTC().toDate(),
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.filter.standardRange).toEqual(THIS_MONTH);
    comp.prev();
    expect(comp.filter.standardRange).toEqual(LAST_MONTH);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfLastMonthUTC().valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(endOfLastMonthUTC().valueOf());
  });

  it('when PREVing from THREE_MONTHS, should go to PRIOR_THREE_MONTHS', () => {
    const newFilter: FilterModel = {
      standardRange: THREE_MONTHS,
      range: getRange(THREE_MONTHS),
      beginDate: beginningOfTodayUTC().subtract(2, 'months').date(1).toDate(),
      endDate: endOfTodayUTC().toDate(),
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.filter.standardRange).toEqual(THREE_MONTHS);
    comp.prev();
    expect(comp.filter.standardRange).toEqual(PRIOR_THREE_MONTHS);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfPriorThreeMonthsUTC().valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(endOfPriorThreeMonthsUTC().valueOf());
  });
});