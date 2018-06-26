import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { StandardDateRangeComponent } from './standard-date-range.component';

import { INTERVAL_HOURLY } from '../../../ngrx';
import * as dateConst from '../../util/date/date.constants';

describe('StandardDateRangeComponent', () => {
  let comp: StandardDateRangeComponent;
  let fix: ComponentFixture<StandardDateRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StandardDateRangeComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(StandardDateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should not have options more than 40 days apart when interval is hourly', () => {
    comp.standardRange = dateConst.THIS_WEEK;
    comp.interval = INTERVAL_HOURLY;
    comp.ngOnChanges();
    const flattenedOptions = [];
    expect(comp.rangeOptions.indexOf(dateConst.THIS_MONTH)).toBeGreaterThan(-1);
    expect(comp.rangeOptions.indexOf(dateConst.LAST_YEAR)).toBeLessThan(0);
    expect(comp.rangeOptions.indexOf(dateConst.LAST_365_DAYS)).toBeLessThan(0);
  });
});
