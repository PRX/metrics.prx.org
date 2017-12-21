import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../../ngrx/reducers';

import { CastleFilterAction } from '../../ngrx/actions';
import { FilterModel, INTERVAL_DAILY, INTERVAL_MONTHLY } from '../../ngrx';
import { TODAY, YESTERDAY, LAST_WEEK, THIS_MONTH,
  beginningOfTodayUTC, endOfTodayUTC, beginningOfLastWeekUTC, endOfLastWeekUTC, beginningOfThisMonthUTC } from '../util/date.util';

import { MenuBarComponent } from './menu-bar.component';
import { ChartTypeComponent } from './chart-type.component';
import { CustomDateRangeComponent } from './date/custom-date-range.component';
import { CustomDateRangeDropdownComponent } from './date/custom-date-range-dropdown.component';
import { IntervalComponent } from './interval.component';
import { PodcastsComponent } from './podcasts.component';
import { StandardDateRangeComponent } from './date/standard-date-range.component';
import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';

describe('MenuBarComponent', () => {
  let comp: MenuBarComponent;
  let fix: ComponentFixture<MenuBarComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const filter: FilterModel = {
    interval: INTERVAL_DAILY,
    range: [1, 'day'],
    standardRange: TODAY,
    beginDate: beginningOfTodayUTC().toDate(),
    endDate: endOfTodayUTC().toDate()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuBarComponent,
        ChartTypeComponent,
        CustomDateRangeComponent,
        CustomDateRangeDropdownComponent,
        IntervalComponent,
        PodcastsComponent,
        StandardDateRangeComponent
      ],
      imports: [
        DatepickerModule,
        SelectModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(MenuBarComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.store.dispatch(new CastleFilterAction({filter}));

      spyOn(comp, 'googleAnalyticsEvent').and.callThrough();
    });
  }));

  it('keeps standard range in sync with custom range', () => {
    comp.onDateRangeChange({beginDate: beginningOfLastWeekUTC().toDate(), endDate: endOfLastWeekUTC().toDate()});
    expect(comp.filter.standardRange).toEqual(LAST_WEEK);
  });

  it('keeps date range in sync with interval', () => {
    comp.onIntervalChange(INTERVAL_MONTHLY);
    expect(comp.filter.beginDate.valueOf()).toEqual(beginningOfThisMonthUTC().valueOf());
    expect(comp.filter.standardRange).toEqual(THIS_MONTH);
  });

  it('should send google analytics event when standard range is changed', () => {
    comp.onStandardRangeChange(YESTERDAY);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalled();
  });
});
