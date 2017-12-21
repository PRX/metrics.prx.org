import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';

import { reducers } from '../../../ngrx/reducers';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { CustomDateRangeComponent } from './custom-date-range.component';
import { CustomDateRangeDropdownComponent } from './custom-date-range-dropdown.component';

import { INTERVAL_DAILY } from '../../../ngrx';
import { beginningOfTodayUTC, endOfTodayUTC, beginningOfYesterdayUTC, endOfYesterdayUTC } from '../../../shared/util/date.util';

describe('CustomDateRangeDropdownComponent', () => {
  let comp: CustomDateRangeDropdownComponent;
  let fix: ComponentFixture<CustomDateRangeDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomDateRangeComponent,
        CustomDateRangeDropdownComponent
      ],
      imports: [
        DatepickerModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(CustomDateRangeDropdownComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      comp.dateRange = comp.filter = {
        interval: INTERVAL_DAILY,
        beginDate: beginningOfTodayUTC().toDate(),
        endDate: endOfTodayUTC().toDate()
      };
      fix.detectChanges();

      spyOn(comp, 'googleAnalyticsEvent').and.callThrough();
    });
  }));

  it('should send google analytics event on apply changes', () => {
    comp.onCustomRangeChange({beginDate: beginningOfYesterdayUTC().toDate(), endDate: endOfYesterdayUTC().toDate()});
    expect(comp.googleAnalyticsEvent).not.toHaveBeenCalled();
    comp.onApply();
    expect(comp.googleAnalyticsEvent).toHaveBeenCalled();
  });

  it('should show date range controls when open', () => {
    expect(de.query(By.css('.custom-date-range-dropdown.open'))).toBeNull();
    comp.toggleOpen();
    fix.detectChanges();
    expect(de.query(By.css('.custom-date-range-dropdown.open'))).not.toBeNull();
  });
});
