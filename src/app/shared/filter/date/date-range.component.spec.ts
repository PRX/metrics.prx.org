import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';
import { DateRangeComponent } from './date-range.component';
import { CustomDateRangeComponent } from './custom-date-range.component';
import { StandardDateRangeComponent } from './standard-date-range.component';

import { LAST_YEAR, LAST_MONTH } from '../../../ngrx/model';
import { beginningOfLastMonthUTC, endOfLastMonthUTC,
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
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      spyOn(comp.dateRangeChange, 'emit').and.callThrough();
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
});
