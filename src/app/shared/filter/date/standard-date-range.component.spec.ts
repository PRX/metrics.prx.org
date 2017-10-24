import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SelectModule } from 'ngx-prx-styleguide';
import { StandardDateRangeComponent } from './standard-date-range.component';

import { INTERVAL_HOURLY, INTERVAL_15MIN,
  TODAY, THIS_MONTH, YESTERDAY, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from '../../../ngrx/model';

describe('StandardDateRangeComponent', () => {
  let comp: StandardDateRangeComponent;
  let fix: ComponentFixture<StandardDateRangeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StandardDateRangeComponent
      ],
      imports: [
        RouterTestingModule,
        SelectModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(StandardDateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should not have options more than 10 days apart when interval is 15 minutes', () => {
    comp.standardRange = TODAY;
    comp.interval = INTERVAL_15MIN;
    comp.ngOnChanges();
    expect(comp.rangeOptions.indexOf(YESTERDAY)).toBeGreaterThan(-1);
    expect(comp.rangeOptions.indexOf(PRIOR_TWO_WEEKS)).toBeLessThan(0);
    expect(comp.rangeOptions.indexOf(LAST_MONTH)).toBeLessThan(0);
    expect(comp.rangeOptions.indexOf(PRIOR_THREE_MONTHS)).toBeLessThan(0);
    expect(comp.rangeOptions.indexOf(LAST_YEAR)).toBeLessThan(0);
  });

  it('should not have options more than 40 days apart when interval is hourly', () => {
    comp.standardRange = TODAY;
    comp.interval = INTERVAL_HOURLY;
    comp.ngOnChanges();
    expect(comp.rangeOptions.indexOf(THIS_MONTH)).toBeGreaterThan(-1);
    expect(comp.rangeOptions.indexOf(PRIOR_THREE_MONTHS)).toBeLessThan(0);
    expect(comp.rangeOptions.indexOf(LAST_YEAR)).toBeLessThan(0);
  });
});
