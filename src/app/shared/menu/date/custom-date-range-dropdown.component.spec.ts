import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';

import { reducers } from '../../../ngrx/reducers';
import { RouteAdvancedRange, GoogleAnalyticsEvent } from '../../../ngrx/actions';
import { INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_MONTHLY } from '../../../ngrx';
import * as dateUtil from '../../util/date';

import { DatepickerModule } from 'ngx-prx-styleguide';
import { StandardDateRangeComponent } from './standard-date-range.component';
import { DateRangeSummaryComponent } from './date-range-summary.component';
import { CustomDateRangeDropdownComponent } from './custom-date-range-dropdown.component';

describe('CustomDateRangeDropdownComponent', () => {
  let comp: CustomDateRangeDropdownComponent;
  let fix: ComponentFixture<CustomDateRangeDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  const routerParams = {
    interval: INTERVAL_DAILY,
    beginDate: dateUtil.beginningOfTodayUTC().toDate(),
    endDate: dateUtil.endOfTodayUTC().toDate()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDateRangeDropdownComponent, DateRangeSummaryComponent, StandardDateRangeComponent],
      imports: [DatepickerModule, StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(CustomDateRangeDropdownComponent);
        comp = fix.componentInstance;
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        comp.tempRange = comp.routerParams = routerParams;
        fix.detectChanges();

        jest.spyOn(comp, 'googleAnalyticsEvent');
      });
  }));

  it('should send google analytics event on apply changes', () => {
    comp.onCustomRangeChange({ from: dateUtil.beginningOfLastWeekUTC().toDate(), to: dateUtil.endOfLastWeekUTC().toDate() });
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
    comp.onCustomRangeChange({ from: dateUtil.beginningOfLastWeekUTC().toDate(), to: dateUtil.endOfLastWeekUTC().toDate() });
    expect(comp.tempRange.standardRange).toEqual(dateUtil.LAST_WEEK);
  });

  it('should dispatch routing and google analytics actions onApply', () => {
    jest.spyOn(store, 'dispatch').mockImplementation(() => {});
    comp.onIntervalChange(INTERVAL_MONTHLY);
    comp.onStandardRangeChange(dateUtil.LAST_MONTH);
    comp.onApply();
    const range = dateUtil.getBeginEndDateFromStandardRange(dateUtil.LAST_MONTH);
    expect(store.dispatch).toHaveBeenCalledWith(GoogleAnalyticsEvent({ gaAction: 'routerParams-standard-date', value: 1 }));
    expect(store.dispatch).toHaveBeenCalledWith(
      RouteAdvancedRange({ standardRange: dateUtil.LAST_MONTH, interval: INTERVAL_MONTHLY, ...range })
    );
  });

  it('should send google analytics event or custom or standard range', () => {
    comp.onStandardRangeChange(dateUtil.LAST_WEEK);
    comp.onApply();
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith(comp.STANDARD_DATE, comp.tempRange);
    comp.onCustomRangeChange({ from: dateUtil.beginningOfLastMonthUTC().toDate(), to: dateUtil.endOfLastMonthUTC().toDate() });
    comp.onApply();
    expect(comp.googleAnalyticsEvent).toHaveBeenCalledWith(comp.CUSTOM_DATE, comp.tempRange);
  });

  it('should not close the dropdown on window scroll', done => {
    comp.open = true;
    window.addEventListener('scroll', e => {
      expect(comp.open).toBeTruthy();
      done();
    });
    window.dispatchEvent(new Event('scroll'));
  });
});
