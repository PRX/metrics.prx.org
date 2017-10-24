import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Angulartics2 } from 'angulartics2';

import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';
import { DateRangeComponent } from './date-range.component';
import { CustomDateRangeComponent } from './custom-date-range.component';
import { StandardDateRangeComponent } from './standard-date-range.component';

import { LAST_YEAR, LAST_MONTH, LAST_WEEK, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../../ngrx/model';
import { beginningOfYesterdayUTC, endOfYesterdayUTC, beginningOfLastWeekUTC, endOfLastWeekUTC,
  beginningOfLastMonthUTC, endOfLastMonthUTC,
  beginningOfLastYearUTC, endOfLastYearUTC, getRange } from '../../../shared/util/date.util';

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
        SelectModule
      ],
      providers: [
        {provide: Angulartics2, useValue: {
          eventTrack: new Subject<any>()
        }}
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
    const range = {
      beginDate: beginningOfLastMonthUTC().toDate(),
      endDate: endOfLastMonthUTC().toDate()
    };
    comp.onCustomRangeChange(range);
    const inSync = {...range, standardRange: LAST_MONTH, range: getRange(LAST_MONTH)};
    expect(comp.dateRangeChange.emit).toHaveBeenCalledWith(inSync);
  });

  it('keeps custom range dates in sync with standard range and prev/next range', () => {
    comp.onStandardRangeChange(LAST_YEAR);
    const inSync = {
      beginDate: beginningOfLastYearUTC().toDate(),
      endDate:  endOfLastYearUTC().toDate(),
      standardRange: LAST_YEAR,
      range: getRange(LAST_YEAR)
    };
    expect(comp.dateRangeChange.emit).toHaveBeenCalledWith(inSync);
  });

  it('should send google analytics event when standard or custom date range changes', () => {
    comp.filter = {
      podcast: {
        doc: undefined,
        seriesId: 37800,
        title: 'Pet Talks Daily',
        feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
        feederId: '70'
      },
      beginDate: beginningOfLastYearUTC().toDate(),
      endDate:  endOfLastYearUTC().toDate(),
      when: LAST_YEAR,
      range: getRange(LAST_YEAR),
      interval: INTERVAL_DAILY
    };
    comp.onWhenChange(LAST_WEEK);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith('standard-date', {
      beginDate: beginningOfLastWeekUTC().toDate(),
      endDate: endOfLastWeekUTC().toDate()
    });
    comp.filter.interval = INTERVAL_HOURLY;
    const yesterday = {
      beginDate: beginningOfYesterdayUTC().toDate(),
      endDate: endOfYesterdayUTC().toDate()
    };
    comp.onDateRangeChange(yesterday);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith('custom-date', yesterday);
  });
});
