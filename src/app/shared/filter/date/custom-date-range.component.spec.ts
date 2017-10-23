import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Angulartics2 } from 'angulartics2';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { CustomDateRangeComponent } from './custom-date-range.component';

import { INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../../ngrx/model';
import { beginningOfLastMonthUTC, endOfLastMonthUTC,
  beginningOfLastYearUTC, endOfLastYearUTC } from '../../../shared/util/date.util';

describe('CustomDateRangeComponent', () => {
  let comp: CustomDateRangeComponent;
  let fix: ComponentFixture<CustomDateRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomDateRangeComponent
      ],
      imports: [
        DatepickerModule
      ],
      providers: [
        {provide: Angulartics2, useValue: {
          eventTrack: new Subject<any>()
        }}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(CustomDateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      spyOn(comp, 'googleAnalyticsEvent').and.callThrough();
    });
  }));

  it('should not allow users to select dates more than 10 days apart when interval is 15 minutes', () => {
    comp.interval = INTERVAL_15MIN;
    comp.beginDate = beginningOfLastMonthUTC().toDate();
    comp.endDate = endOfLastMonthUTC().toDate();
    expect(comp.invalid).toContain('cannot be more than 10 days apart');
  });

  it('should not allow users to select dates more than 40 days apart when interval is hourly', () => {
    comp.interval = INTERVAL_HOURLY;
    comp.beginDate = beginningOfLastYearUTC().toDate();
    comp.endDate = endOfLastYearUTC().toDate();
    expect(comp.invalid).toContain('cannot be more than 40 days apart');
  });

  it('should send google analytics event when begin or end time changes', () => {
    comp.interval = INTERVAL_DAILY;
    comp.beginDate = beginningOfLastMonthUTC().toDate();
    comp.endDate = endOfLastMonthUTC().toDate();
    const now = new Date();
    comp.onBeginTimeChange(now);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith('begin-time', now.getUTCHours());
    comp.onEndTimeChange(now);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith('end-time', now.getUTCHours());
  });
});
