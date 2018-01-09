import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../../ngrx/reducers';

import { CastleFilterAction } from '../../ngrx/actions';
import { FilterModel, INTERVAL_DAILY, INTERVAL_MONTHLY } from '../../ngrx';
import * as dateUtil from '../util/date';

import { MenuBarComponent } from './menu-bar.component';
import { ChartTypeComponent } from './chart-type.component';
import { CustomDateRangeDropdownComponent } from './date/custom-date-range-dropdown.component';
import { IntervalDropdownComponent } from './interval-dropdown.component';
import { PodcastsComponent } from './podcasts.component';
import { StandardDateRangeDropdownComponent } from './date/standard-date-range-dropdown.component';
import { StandardDateRangeComponent } from './date/standard-date-range.component';
import { DatepickerModule, SelectModule } from 'ngx-prx-styleguide';

describe('MenuBarComponent', () => {
  let comp: MenuBarComponent;
  let fix: ComponentFixture<MenuBarComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const filter: FilterModel = {
    interval: INTERVAL_DAILY,
    standardRange: dateUtil.THIS_WEEK,
    beginDate: dateUtil.beginningOfThisWeekUTC().toDate(),
    endDate: dateUtil.endOfTodayUTC().toDate()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuBarComponent,
        ChartTypeComponent,
        CustomDateRangeDropdownComponent,
        IntervalDropdownComponent,
        PodcastsComponent,
        StandardDateRangeComponent,
        StandardDateRangeDropdownComponent
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
    comp.onFilterChange({beginDate: dateUtil.beginningOfLastWeekUTC().toDate(), endDate: dateUtil.endOfLastWeekUTC().toDate()});
    expect(comp.filter.standardRange).toEqual(dateUtil.LAST_WEEK);
  });

  it('keeps date range in sync with interval', () => {
    comp.filter.beginDate = dateUtil.beginningOfTodayUTC().toDate();
    comp.onIntervalChange(INTERVAL_MONTHLY);
    expect(comp.filter.beginDate.valueOf()).toEqual(dateUtil.beginningOfThisMonthUTC().valueOf());
    expect(comp.filter.standardRange).toEqual(dateUtil.THIS_MONTH);
  });

  it('should send google analytics event when standard range is changed', () => {
    comp.onStandardRangeChange(dateUtil.LAST_WEEK);
    expect(comp.googleAnalyticsEvent).toHaveBeenCalled();
  });
});
