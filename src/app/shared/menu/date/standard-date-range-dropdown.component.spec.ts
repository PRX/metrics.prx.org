import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { reducers } from '../../../ngrx/reducers';
import { RouteStandardRange, GoogleAnalyticsEvent } from '../../../ngrx/actions';
import { INTERVAL_DAILY } from '../../../ngrx';
import { THIS_WEEK, LAST_WEEK } from '../../util/date/date.constants';
import * as dateUtil from '../../util/date';
import { StandardDateRangeComponent } from './standard-date-range.component';
import { StandardDateRangeDropdownComponent } from './standard-date-range-dropdown.component';

describe('StandardDateRangeDropdownComponent', () => {
  let comp: StandardDateRangeDropdownComponent;
  let fix: ComponentFixture<StandardDateRangeDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StandardDateRangeDropdownComponent, StandardDateRangeComponent],
      imports: [StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(StandardDateRangeDropdownComponent);
        comp = fix.componentInstance;
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.get(Store);

        comp.standardRange = THIS_WEEK;
        comp.interval = INTERVAL_DAILY;
        fix.detectChanges();

        jest.spyOn(store, 'dispatch').mockImplementation(() => {});
      });
  }));

  it('should show dropdown when open', () => {
    expect(de.query(By.css('.dropdown.open'))).toBeNull();
    comp.toggleOpen();
    fix.detectChanges();
    expect(de.query(By.css('.dropdown.open'))).not.toBeNull();
  });

  it('should dispatch routing action when standard range is changed', () => {
    comp.onStandardRangeChange(LAST_WEEK);
    expect(store.dispatch).toHaveBeenCalledWith(RouteStandardRange({ standardRange: LAST_WEEK }));
  });

  it('should send google analytics event when standard range is changed', () => {
    comp.onStandardRangeChange(LAST_WEEK);
    const dateRange = dateUtil.getBeginEndDateFromStandardRange(LAST_WEEK);
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, INTERVAL_DAILY);
    expect(store.dispatch).toHaveBeenCalledWith(GoogleAnalyticsEvent({ gaAction: 'routerParams-standard-date', value }));
  });

  it('should close the dropdown on window scroll', done => {
    comp.open = true;
    window.addEventListener('scroll', e => {
      expect(comp.open).toBeFalsy();
      done();
    });
    window.dispatchEvent(new Event('scroll'));
  });
});
