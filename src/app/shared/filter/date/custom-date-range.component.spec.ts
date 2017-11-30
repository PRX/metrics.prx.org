import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { CustomDateRangeComponent } from './custom-date-range.component';

import { reducers } from '../../../ngrx/reducers';
import { INTERVAL_DAILY, INTERVAL_HOURLY } from '../../../ngrx/model';
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
        DatepickerModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(CustomDateRangeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should not allow users to select dates more than 40 days apart when interval is hourly', () => {
    comp.interval = INTERVAL_HOURLY;
    comp.beginDate = beginningOfLastYearUTC().toDate();
    comp.endDate = endOfLastYearUTC().toDate();
    expect(comp.invalid).toContain('cannot be more than 40 days apart');
  });
});
