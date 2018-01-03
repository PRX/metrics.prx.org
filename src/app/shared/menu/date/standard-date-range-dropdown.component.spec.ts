import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { StandardDateRangeComponent } from './standard-date-range.component';
import { StandardDateRangeDropdownComponent } from './standard-date-range-dropdown.component';

import { INTERVAL_DAILY } from '../../../ngrx';
import { THIS_WEEK } from '../../util/date.util';

describe('StandardDateRangeDropdownComponent', () => {
  let comp: StandardDateRangeDropdownComponent;
  let fix: ComponentFixture<StandardDateRangeDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StandardDateRangeDropdownComponent,
        StandardDateRangeComponent
      ],
      imports: []
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(StandardDateRangeDropdownComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      comp.standardRange = THIS_WEEK;
      comp.interval = INTERVAL_DAILY;
      fix.detectChanges();
    });
  }));

  it('should show dropdown when open', () => {
    expect(de.query(By.css('.dropdown.open'))).toBeNull();
    comp.toggleOpen();
    fix.detectChanges();
    expect(de.query(By.css('.dropdown.open'))).not.toBeNull();
  });
});
