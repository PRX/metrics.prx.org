import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { CustomDateRangeComponent } from './custom-date-range.component';

import { INTERVAL_HOURLY, INTERVAL_15MIN } from '../../../ngrx/model';
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
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(CustomDateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
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
});