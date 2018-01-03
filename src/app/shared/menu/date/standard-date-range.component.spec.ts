import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SelectModule } from 'ngx-prx-styleguide';
import { StandardDateRangeComponent } from './standard-date-range.component';

import { INTERVAL_HOURLY } from '../../../ngrx';
import { THIS_WEEK, THIS_MONTH, THIS_MONTH_PLUS_2_MONTHS, LAST_365_DAYS } from '../../util/date.util';

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

  it('should not have options more than 40 days apart when interval is hourly', () => {
    comp.standardRange = THIS_WEEK;
    comp.interval = INTERVAL_HOURLY;
    comp.ngOnChanges();
    const flattenedOptions = [];
    comp.rangeOptions.forEach(group => group.forEach(option => {
      flattenedOptions.push(option);
    }));
    expect(flattenedOptions.indexOf(THIS_MONTH)).toBeGreaterThan(-1);
    expect(flattenedOptions.indexOf(THIS_MONTH_PLUS_2_MONTHS)).toBeLessThan(0);
    expect(flattenedOptions.indexOf(LAST_365_DAYS)).toBeLessThan(0);
  });
});
