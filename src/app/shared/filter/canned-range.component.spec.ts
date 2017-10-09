import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';
import { CannedRangeComponent, TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from './canned-range.component';

import { reducers } from '../../ngrx/reducers';
import { FilterModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

import { beginningOfTodayUTC, endOfTodayUTC } from '../util/date.util';

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
      beginDate: beginningOfTodayUTC().toDate(), // 'Today'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(TODAY);
  });

  it('should disable NEXT button if the end date would be past the end of the currently selected period', () => {
    filter = {
      beginDate: beginningOfTodayUTC().toDate(), // 'Today'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    // nope, you may not NEXT your way into Tomorrow
    expect(comp.nextDisabled).toEqual('disabled');
  });

  it('should disable PREV button if date filter has never matched a valid canned range option', () => {
    filter = {
      beginDate: beginningOfTodayUTC().add(1, 'hour').toDate(), // not a valid option
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.lastChosenRange).toBe(undefined);
    expect(comp.prevDisabled).toEqual('disabled');
  });

  it('should go to next range when NEXT button is clicked', () => {
    filter = {
      beginDate: beginningOfTodayUTC().subtract(1, 'days').toDate(), // 'Yesterday'
      endDate: endOfTodayUTC().subtract(1, 'days').toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(YESTERDAY);
    comp.next();
    expect(comp.selected[0]).toEqual(TODAY);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfTodayUTC().valueOf()); // 'Today'
    expect(comp.filter.endDate.valueOf()).toEqual(endOfTodayUTC().valueOf());
  });

  it('should go to prev range when PREV button is click', () => {
    comp.lastChosenRange = [1, 'weeks']; // get it to believe something was selected from the drop down
    filter = {
      beginDate: beginningOfTodayUTC().subtract(beginningOfTodayUTC().day(), 'days').toDate(), // 'This week'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(THIS_WEEK);
    comp.prev();
    expect(comp.selected[0]).toEqual(LAST_WEEK);
    const daysIntoWeek = beginningOfTodayUTC().day();
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days').valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(endOfTodayUTC().subtract(daysIntoWeek + 1, 'days').valueOf());
  });

  it('TWO_WEEKS option should be two weeks starting on Sunday of last week not extending past today', () => {
    // component needs a default filter in order to initialize options
    filter = {
      beginDate: beginningOfTodayUTC().toDate(), // 'Today'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    const option = comp.whenOptions.find(opt => opt[0] === TWO_WEEKS);
    const daysIntoWeek = beginningOfTodayUTC().day();
    expect(option[1].beginDate.valueOf()).toEqual(beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days').valueOf());
    expect(option[1].endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('THIS_MONTH option should begin on the 1st of this month not extending past today', () => {
    // component needs a default filter in order to initialize options
    filter = {
      beginDate: beginningOfTodayUTC().toDate(), // 'Today'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    const option = comp.whenOptions.find(opt => opt[0] === THIS_MONTH);
    expect(option[1].beginDate.valueOf()).toEqual(beginningOfTodayUTC().date(1).valueOf());
    expect(option[1].endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('THREE_MONTHS option should begin on the 1st of the month 3 months ago not extending past today', () => {
    // component needs a default filter in order to initialize options
    filter = {
      beginDate: beginningOfTodayUTC().toDate(), // 'Today'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    const option = comp.whenOptions.find(opt => opt[0] === THREE_MONTHS);
    expect(option[1].beginDate.valueOf()).toEqual(beginningOfTodayUTC().subtract(2, 'months').date(1).valueOf());
    expect(option[1].endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('when NEXTing from LAST_YEAR, should go to THIS_YEAR and not extend past today', () => {
    filter = {
      beginDate: beginningOfTodayUTC().month(0).date(1).subtract(1, 'years').toDate(), // 'LAST_YEAR'
      endDate: endOfTodayUTC().month(11).date(31).subtract(1, 'years').toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(LAST_YEAR);
    comp.next();
    expect(comp.selected[0]).toEqual(THIS_YEAR);
    expect(comp.filter.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('when NEXTing from PRIOR_TWO_WEEKS, should go to TWO_WEEKS and not extend past today', () => {
    comp.lastChosenRange = [2, 'weeks']; // get it to believe something was selected from the drop down
    const daysIntoWeek = beginningOfTodayUTC().day();
    filter = {
      beginDate: beginningOfTodayUTC().subtract(daysIntoWeek + 21, 'days').toDate(), // 'PRIOR_TWO_WEEKS'
      endDate: endOfTodayUTC().subtract(daysIntoWeek + 8, 'days').toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(PRIOR_TWO_WEEKS);
    comp.next();
    expect(comp.selected[0]).toEqual(TWO_WEEKS);
    expect(comp.filter.endDate.valueOf()).toBeLessThanOrEqual(endOfTodayUTC().valueOf());
  });

  it('when PREVing from THIS_MONTH, should go to LAST_MONTH', () => {
    filter = {
      beginDate: beginningOfTodayUTC().date(1).toDate(), // 'THIS_MONTH'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(THIS_MONTH);
    comp.prev();
    expect(comp.selected[0]).toEqual(LAST_MONTH);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfTodayUTC().subtract(1, 'months').date(1).valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(endOfTodayUTC().date(1).subtract(1, 'days').valueOf());
  });

  it('when PREVing from THREE_MONTHS, should go to PRIOR_THREE_MONTHS', () => {
    filter = {
      beginDate: beginningOfTodayUTC().subtract(2, 'months').date(1).toDate(), // 'THREE_MONTHS'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_DAILY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected[0]).toEqual(THREE_MONTHS);
    comp.prev();
    expect(comp.selected[0]).toEqual(PRIOR_THREE_MONTHS);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfTodayUTC().subtract(5, 'months').date(1).valueOf());
    expect(comp.filter.endDate.valueOf()).toEqual(endOfTodayUTC().date(1).subtract(2, 'months').subtract(1, 'days').valueOf());
  });

  it('should not have options more than 10 days apart when interval is 15 minutes', () => {
    filter = {
      beginDate: beginningOfTodayUTC().toDate(), // 'TODAY'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_15MIN
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.whenOptions.find(opt => opt[0] === YESTERDAY)[0]).toEqual(YESTERDAY);
    expect(comp.whenOptions.find(opt => opt[0] === PRIOR_TWO_WEEKS)).toBeUndefined();
    expect(comp.whenOptions.find(opt => opt[0] === LAST_MONTH)).toBeUndefined();
    expect(comp.whenOptions.find(opt => opt[0] === PRIOR_THREE_MONTHS)).toBeUndefined();
    expect(comp.whenOptions.find(opt => opt[0] === LAST_YEAR)).toBeUndefined();
  });

  it('should not have options more than 40 days apart when interval is hourly', () => {
    filter = {
      beginDate: beginningOfTodayUTC().toDate(), // 'TODAY'
      endDate: endOfTodayUTC().toDate(),
      interval: INTERVAL_HOURLY
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.whenOptions.find(opt => opt[0] === THIS_MONTH)[0]).toEqual(THIS_MONTH);
    expect(comp.whenOptions.find(opt => opt[0] === PRIOR_THREE_MONTHS)).toBeUndefined();
    expect(comp.whenOptions.find(opt => opt[0] === LAST_YEAR)).toBeUndefined();
  });
});
