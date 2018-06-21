import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';

import { reducers } from '../../../ngrx/reducers';
import { RouteAdvancedRangeAction, GoogleAnalyticsEventAction } from '../../../ngrx/actions';
import { INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_MONTHLY } from '../../../ngrx';
import * as dateUtil from '../../util/date';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { StandardDateRangeComponent } from './standard-date-range.component';
import { CustomDateRangeDropdownComponent } from './custom-date-range-dropdown.component';

describe('CustomDateRangeDropdownComponent', () => {
  let comp: CustomDateRangeDropdownComponent;
  let fix: ComponentFixture<CustomDateRangeDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  const routerState = {
    interval: INTERVAL_DAILY,
    beginDate: dateUtil.beginningOfTodayUTC().toDate(),
    endDate: dateUtil.endOfTodayUTC().toDate()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomDateRangeDropdownComponent,
        StandardDateRangeComponent
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
      store = TestBed.get(Store);

      comp.tempRange = comp.routerState = routerState;
      fix.detectChanges();

      spyOn(comp, 'googleAnalyticsEvent').and.callThrough();
    });
  }));

  it('should send google analytics event on apply changes', () => {
    comp.onCustomRangeChange({from: dateUtil.beginningOfLastWeekUTC().toDate(), to: dateUtil.endOfLastWeekUTC().toDate()});
    expect(comp.googleAnalyticsEvent).not.toHaveBeenCalled();
    comp.onApply();
    expect(comp.googleAnalyticsEvent).toHaveBeenCalled();
  });

  it('should show date range controls when open', () => {
    expect(de.query(By.css('.dropdown.open'))).toBeNull();
    comp.toggleOpen();
    fix.detectChanges();
    expect(de.query(By.css('.dropdown.open'))).not.toBeNull();
  });

  it('should not allow users to select dates more than 40 days apart when interval is hourly', () => {
    comp.tempRange = {
      interval: INTERVAL_HOURLY,
      beginDate: dateUtil.beginningOfLast365DaysUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().toDate()
    };
    fix.detectChanges();
    expect(comp.invalid).toContain('cannot be more than 40 days apart');
  });

  it('should not allow to date before from date', () => {
    comp.tempRange = {
      interval: INTERVAL_DAILY,
      beginDate: dateUtil.endOfLastWeekUTC().toDate(),
      endDate: dateUtil.beginningOfLastWeekUTC().toDate()
    };
    fix.detectChanges();
    expect(comp.invalid).toContain('must come before');
  });

  it('should not allow dates in the future', () => {
    comp.tempRange = {
      interval: INTERVAL_DAILY,
      beginDate: dateUtil.beginningOfTodayUTC().toDate(),
      endDate: dateUtil.endOfTodayUTC().add(1, 'days').toDate()
    };
    fix.detectChanges();
    expect(comp.invalid).toContain('dates in the past or present');
  });

  it('keeps tempRange standard range in sync with custom range', () => {
    comp.onCustomRangeChange({from: dateUtil.beginningOfLastWeekUTC().toDate(), to: dateUtil.endOfLastWeekUTC().toDate()});
    expect(comp.tempRange.standardRange).toEqual(dateUtil.LAST_WEEK);
  });

  it('should dispatch routing and google analytics actions onApply', () => {
    spyOn(store, 'dispatch');
    comp.onIntervalChange(INTERVAL_MONTHLY);
    comp.onStandardRangeChange(dateUtil.LAST_MONTH);
    comp.onApply();
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(GoogleAnalyticsEventAction));
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(RouteAdvancedRangeAction));
  });

  it('should send google analytics event or custom or standard range', () => {
    comp.onStandardRangeChange(dateUtil.LAST_WEEK);
    comp.onApply();
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith(comp.STANDARD_DATE, comp.tempRange);
    comp.onCustomRangeChange({from: dateUtil.beginningOfLastMonthUTC().toDate(), to: dateUtil.endOfLastMonthUTC().toDate()});
    comp.onApply();
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith(comp.CUSTOM_DATE, comp.tempRange);
  });

  it('should not close the dropdown on window scroll', () => {
    comp.open = true;
    window.dispatchEvent(new Event('scroll'));
    expect(comp.open).toBeTruthy();
  });
});
