import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { NextDateRangeComponent } from './next-date-range.component';

import { reducers } from '../../../ngrx/reducers';

import { CastleFilterAction } from '../../../ngrx/actions';
import { FilterModel, INTERVAL_DAILY } from '../../../ngrx';
import { beginningOfTodayUTC, endOfTodayUTC, beginningOfYesterdayUTC, endOfYesterdayUTC,
  beginningOfTwoWeeksUTC, beginningOfPriorTwoWeeksUTC, endOfPriorTwoWeeksUTC,
  beginningOfThisYearUTC, beginningOfLastYearUTC, endOfLastYearUTC, getRange,
  YESTERDAY, TWO_WEEKS, PRIOR_TWO_WEEKS, THIS_YEAR, LAST_YEAR } from '../../../shared/util/date.util';

describe('NextDateRangeComponent', () => {
  let comp: NextDateRangeComponent;
  let fix: ComponentFixture<NextDateRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const filter: FilterModel = {
    podcastSeriesId: 37800,
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
      ],
      providers: [
        {provide: Router, useValue: {
          navigate: (route) => {
            const routeParams = {range: route[route.length - 1].range};
            if (route[route.length - 1]['beginDate']) {
              routeParams['beginDate'] = new Date(route[route.length - 1]['beginDate']);
            }
            if (route[route.length - 1]['endDate']) {
              routeParams['endDate'] = new Date(route[route.length - 1]['endDate']);
            }
            if (route[route.length - 1]['standardRange']) {
              routeParams['standardRange'] = route[route.length - 1]['standardRange'];
            }
            comp.store.dispatch(new CastleFilterAction({filter: routeParams}));
          }
        }}
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
