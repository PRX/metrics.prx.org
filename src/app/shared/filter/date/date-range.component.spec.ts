import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';
import { DateRangeComponent } from './date-range.component';
import { CustomDateRangeComponent } from './custom-date-range.component';
import { StandardDateRangeComponent } from './standard-date-range.component';

import { reducers } from '../../../ngrx/reducers';
import { INTERVAL_DAILY, INTERVAL_HOURLY } from '../../../ngrx';
import { beginningOfYesterdayUTC, endOfYesterdayUTC, beginningOfLastWeekUTC, endOfLastWeekUTC,
  beginningOfLastMonthUTC, endOfLastMonthUTC,
  beginningOfLastYearUTC, endOfLastYearUTC, getRange, LAST_YEAR, LAST_MONTH, LAST_WEEK } from '../../../shared/util/date.util';

describe('DateRangeComponent', () => {
  let comp: DateRangeComponent;
  let fix: ComponentFixture<DateRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateRangeComponent,
        CustomDateRangeComponent,
        StandardDateRangeComponent
      ],
      imports: [
        DatepickerModule,
        SelectModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      spyOn(comp.dateRangeChange, 'emit').and.callThrough();
      spyOn(comp, 'googleAnalyticsEvent').and.callThrough();
    });
  }));

  it('keeps standard range and prev/next range in sync with custom range dates', () => {
    comp.filter = {interval: INTERVAL_DAILY};
    const range = {
      beginDate: beginningOfLastMonthUTC().toDate(),
      endDate: endOfLastMonthUTC().toDate()
    };
    comp.onCustomRangeChange(range);
    const inSync = {...comp.filter, ...range, standardRange: LAST_MONTH, range: getRange(LAST_MONTH)};
    expect(comp.dateRangeChange.emit).toHaveBeenCalledWith(inSync);
  });

  it('keeps custom range dates in sync with standard range and prev/next range', () => {
    comp.filter = {interval: INTERVAL_DAILY};
    comp.onStandardRangeChange(LAST_YEAR);
    const inSync = {
      ...comp.filter,
      beginDate: beginningOfLastYearUTC().toDate(),
      endDate:  endOfLastYearUTC().toDate(),
      standardRange: LAST_YEAR,
      range: getRange(LAST_YEAR)
    };
    expect(comp.dateRangeChange.emit).toHaveBeenCalledWith(inSync);
  });

  it('should send google analytics event when standard or custom date range changes', () => {
    comp.filter = {
      podcastSeriesId: 37800,
      beginDate: beginningOfLastYearUTC().toDate(),
      endDate:  endOfLastYearUTC().toDate(),
      standardRange: LAST_YEAR,
      range: getRange(LAST_YEAR),
      interval: INTERVAL_DAILY
    };
    comp.onStandardRangeChange(LAST_WEEK);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith('standard-date', {
      beginDate: beginningOfLastWeekUTC().toDate(),
      endDate: endOfLastWeekUTC().toDate()
    });
    comp.filter.interval = INTERVAL_HOURLY;
    const yesterday = {
      beginDate: beginningOfYesterdayUTC().toDate(),
      endDate: endOfYesterdayUTC().toDate()
    };
    comp.onCustomRangeChange(yesterday);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith('custom-date', yesterday);
  });
});
