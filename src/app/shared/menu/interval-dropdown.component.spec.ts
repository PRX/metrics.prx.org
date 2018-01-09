import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { IntervalDropdownComponent } from './interval-dropdown.component';

import { INTERVAL_DAILY } from '../../ngrx';
import * as dateUtil from '../util/date';

describe('IntervalDropdownComponent', () => {
  let comp: IntervalDropdownComponent;
  let fix: ComponentFixture<IntervalDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IntervalDropdownComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(IntervalDropdownComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.filter = {
        beginDate: dateUtil.beginningOfLastMonthUTC().toDate(),
        endDate: dateUtil.endOfLastMonthUTC().toDate(),
        interval: INTERVAL_DAILY
      };
      comp.ngOnChanges();
    });
  }));

  it('should initialize interval according to default filter', () => {
    expect(comp.selectedInterval).toEqual(INTERVAL_DAILY);
  });

  it('should limit interval according to begin and end dates', () => {
    expect(comp.intervalOptions.length).toEqual(4); // MONTHLY, WEEKLY, DAILY, and HOURLY
  });
});
