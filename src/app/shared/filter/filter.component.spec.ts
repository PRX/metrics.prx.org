import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';

import { FilterComponent } from './filter.component';
import { CustomDateRangeComponent } from './date/custom-date-range.component';
import { DateRangeComponent } from './date/date-range.component';
import { EpisodesComponent } from './episodes.component';
import { IntervalComponent } from './interval.component';
import { NextDateRangeComponent } from './date/next-date-range.component';
import { PrevDateRangeComponent } from './date/prev-date-range.component';
import { StandardDateRangeComponent } from './date/standard-date-range.component';

import { reducers } from '../../ngrx/reducers';
import { CastleFilterAction } from '../../ngrx/actions';
import { FilterModel, YESTERDAY, TWO_WEEKS, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx/model';
import { endOfTodayUTC, beginningOfYesterdayUTC, endOfYesterdayUTC,
  beginningOfTwoWeeksUTC, getRange } from '../util/date.util';

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
        EpisodesComponent,
        IntervalComponent,
        NextDateRangeComponent,
        PrevDateRangeComponent,
        StandardDateRangeComponent
      ],
      imports: [
        StoreModule.forRoot(reducers),
        DatepickerModule,
        SelectModule
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

  it('should dispatch filter action on Apply', () => {
    spyOn(comp.store, 'dispatch').and.callThrough();
    comp.onDateRangeChange({
      standardRange: YESTERDAY,
      range: getRange(YESTERDAY),
      beginDate: beginningOfYesterdayUTC().toDate(),
      endDate: endOfYesterdayUTC().toDate()
    });
    comp.onApply();
    expect(comp.store.dispatch).toHaveBeenCalled();
  });
});