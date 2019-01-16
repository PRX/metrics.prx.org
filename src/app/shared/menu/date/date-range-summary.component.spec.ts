import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { THIS_WEEK } from '../../util/date';

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
      de = fix.debugElement;
      el = de.nativeElement;

      comp.routerParams = {
        beginDate: new Date(Date.UTC(2018, 0, 1)),
        endDate: new Date(Date.UTC(2018, 0, 7)),
        standardRange: THIS_WEEK
      };
      fix.detectChanges();
    });
  }));

  it('should show date range', () => {
    expect(comp.beginDate).toEqual('Jan 1, 2018');
    expect(comp.endDate).toEqual('Jan 7, 2018');
  });

  it('should show standard range', () => {
    expect(de.query(By.css('.desc')).nativeElement.textContent).toEqual(comp.routerParams.standardRange);
  });
});
