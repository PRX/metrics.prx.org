import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';
import { CannedRangeComponent, TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from './canned-range.component';

import { reducers } from '../../ngrx/reducers';

import { FilterModel, INTERVAL_DAILY } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

describe('CannedRangeComponent', () => {
  let comp: CannedRangeComponent;
  let fix: ComponentFixture<CannedRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let filter: FilterModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CannedRangeComponent
      ],
      imports: [
        RouterTestingModule,
        DatepickerModule,
        SelectModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(CannedRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should set selected if filter is one of the canned ranges', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().toDate(), // 'Today'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(TODAY);
  });

  it('should disable NEXT button if the end date would be past the end of the currently selected period', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().toDate(), // 'Today'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    // nope, you may not NEXT your way into Tomorrow
    expect(comp.nextDisabled).toEqual('disabled');
  });

  it('should disable PREV button if date filter has never matched a valid canned range option', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().add(1, 'hour').toDate(), // not a valid option
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.lastChosenRange).toBe(undefined);
    expect(comp.prevDisabled).toEqual('disabled');
  });

  it('should go to next range when NEXT button is clicked', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().subtract(1, 'days').toDate(), // 'Yesterday'
      endDate: comp.endOfTodayUTC().subtract(1, 'days').toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(YESTERDAY);
    comp.next();
    expect(comp.selected[0]).toEqual(TODAY);
    expect(comp.filter.beginDate.valueOf()).toEqual(comp.beginningOfTodayUTC().valueOf()); // 'Today'
    expect(comp.filter.endDate.valueOf()).toEqual(comp.endOfTodayUTC().valueOf());
  });

  xit('should go to prev range when PREV button is click', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().subtract(comp.beginningOfTodayUTC().day(), 'days').toDate(), // 'This week'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(THIS_WEEK);
    comp.prev();
    expect(comp.selected[0]).toEqual(LAST_WEEK);
    const daysIntoWeek = comp.beginningOfTodayUTC().day();
    expect(comp.filter.beginDate.valueOf()).toEqual(comp.beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days').valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(comp.endOfTodayUTC().subtract(daysIntoWeek + 1, 'days').valueOf());
  });

  it('TWO_WEEKS option should be two weeks starting on Sunday of last week not extending past today', () => {
    // component needs a default filter in order to initialize options
    filter = {
      beginDate: comp.beginningOfTodayUTC().toDate(), // 'Today'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    const option = comp.whenOptions.find(opt => opt[0] === TWO_WEEKS);
    const daysIntoWeek = comp.beginningOfTodayUTC().day();
    expect(option[1].beginDate.valueOf()).toEqual(comp.beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days').valueOf());
    expect(option[1].endDate.valueOf()).toBeLessThanOrEqual(comp.endOfTodayUTC().valueOf());
  });

  it('THIS_MONTH option should begin on the 1st of this month not extending past today', () => {
    // component needs a default filter in order to initialize options
    filter = {
      beginDate: comp.beginningOfTodayUTC().toDate(), // 'Today'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    const option = comp.whenOptions.find(opt => opt[0] === THIS_MONTH);
    expect(option[1].beginDate.valueOf()).toEqual(comp.beginningOfTodayUTC().date(1).valueOf());
    expect(option[1].endDate.valueOf()).toBeLessThanOrEqual(comp.endOfTodayUTC().valueOf());
  });

  it('THREE_MONTHS option should begin on the 1st of the month 3 months ago not extending past today', () => {
    // component needs a default filter in order to initialize options
    filter = {
      beginDate: comp.beginningOfTodayUTC().toDate(), // 'Today'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    const option = comp.whenOptions.find(opt => opt[0] === THREE_MONTHS);
    expect(option[1].beginDate.valueOf()).toEqual(comp.beginningOfTodayUTC().subtract(2, 'months').date(1).valueOf());
    expect(option[1].endDate.valueOf()).toBeLessThanOrEqual(comp.endOfTodayUTC().valueOf());
  });

  it('when NEXTing from LAST_YEAR, should go to THIS_YEAR and not extend past today', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().month(0).date(1).subtract(1, 'years').toDate(), // 'LAST_YEAR'
      endDate: comp.endOfTodayUTC().month(11).date(31).subtract(1, 'years').toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(LAST_YEAR);
    comp.next();
    expect(comp.selected[0]).toEqual(THIS_YEAR);
    expect(comp.filter.endDate.valueOf()).toBeLessThanOrEqual(comp.endOfTodayUTC().valueOf());
  });

  it('when NEXTing from PRIOR_TWO_WEEKS, should go to TWO_WEEKS and not extend past today', () => {
    const daysIntoWeek = comp.beginningOfTodayUTC().day();
    filter = {
      beginDate: comp.beginningOfTodayUTC().subtract(daysIntoWeek + 21, 'days').toDate(), // 'PRIOR_TWO_WEEKS'
      endDate: comp.endOfTodayUTC().subtract(daysIntoWeek + 8, 'days').toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(PRIOR_TWO_WEEKS);
    comp.next();
    expect(comp.selected[0]).toEqual(TWO_WEEKS);
    expect(comp.filter.endDate.valueOf()).toBeLessThanOrEqual(comp.endOfTodayUTC().valueOf());
  });

  it('when PREVing from THIS_MONTH, should go to LAST_MONTH', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().date(1).toDate(), // 'THIS_MONTH'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(THIS_MONTH);
    comp.prev();
    expect(comp.selected[0]).toEqual(LAST_MONTH);
    expect(comp.filter.beginDate.valueOf()).toEqual(comp.beginningOfTodayUTC().subtract(1, 'months').date(1).valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(comp.endOfTodayUTC().date(1).subtract(1, 'days').valueOf());
  });

  it('when PREVing from THREE_MONTHS, should go to PRIOR_THREE_MONTHS', () => {
    filter = {
      beginDate: comp.beginningOfTodayUTC().subtract(2, 'months').date(1).toDate(), // 'THREE_MONTHS'
      endDate: comp.endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(THREE_MONTHS);
    comp.prev();
    expect(comp.selected[0]).toEqual(PRIOR_THREE_MONTHS);
    expect(comp.filter.beginDate.valueOf()).toEqual(comp.beginningOfTodayUTC().subtract(5, 'months').date(1).valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(comp.endOfTodayUTC().date(1).subtract(2, 'months').subtract(1, 'days').valueOf());
  });
});
