import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { DateRangeSummaryComponent } from './date-range-summary.component';

describe('DateRangeSummaryComponent', () => {
  let comp: DateRangeSummaryComponent;
  let fix: ComponentFixture<DateRangeSummaryComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateRangeSummaryComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DateRangeSummaryComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.filter = {
        beginDate: new Date(Date.UTC(2018, 0, 1)),
        endDate: new Date(Date.UTC(2018, 0, 7))
      }
    });
  }));

  it('should show date range', () => {
    expect(comp.beginDate).toEqual('Jan 1, 2018');
    expect(comp.endDate).toEqual('Jan 7, 2018');
  });

  it('should show number of days', () => {
    expect(comp.numDays).toEqual('7 days');
    comp.filter.endDate = new Date(Date.UTC(2018, 0, 1));
    fix.detectChanges();
    expect(comp.numDays).toEqual('1 day');
  });
});
