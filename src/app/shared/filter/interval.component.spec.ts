import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { SelectModule } from 'ngx-prx-styleguide';
import { IntervalComponent } from './interval.component';

import { INTERVAL_DAILY } from '../../ngrx/model';
import { beginningOfLastMonthUTC, endOfLastMonthUTC } from '../../shared/util/date.util';

describe('IntervalComponent', () => {
  let comp: IntervalComponent;
  let fix: ComponentFixture<IntervalComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IntervalComponent
      ],
      imports: [
        SelectModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(IntervalComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.filter = {
        beginDate: beginningOfLastMonthUTC().toDate(),
        endDate: endOfLastMonthUTC().toDate(),
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
