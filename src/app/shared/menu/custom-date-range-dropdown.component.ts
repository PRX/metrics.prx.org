import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FilterModel } from '../../ngrx';
import { getStandardRangeForBeginEndDate, getRange, getAmountOfIntervals } from '../util/date.util';
import { GoogleAnalyticsEventAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-custom-date-range-dropdown',
  template: `
    <div class="custom-date-range-dropdown">
      <div class="custom-date-range-button" [class.open]="open">
        <button class="btn-icon icon-calendar grey-dove" (click)="toggleOpen()"></button>
      </div>
      <div class="custom-date-range-content" [class.open]="open">
        <metrics-custom-date-range [filter]="dateRange"
                                   (customRangeChange)="onCustomRangeChange($event)"></metrics-custom-date-range>
        <button (click)="toggleOpen()" class="btn-link">Cancel</button>
        <button (click)="onApply()">Apply</button>
      </div>
    </div>
  `,
  styleUrls: ['./custom-date-range-dropdown.component.css']
})

export class CustomDateRangeDropdownComponent implements OnInit {
  @Input() filter: FilterModel;
  @Output() dateRangeChange = new EventEmitter<FilterModel>();
  dateRange: FilterModel;
  open = false;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.dateRange = this.filter;
  }

  onCustomRangeChange(dateRange: FilterModel) {
    this.dateRange = {...dateRange};
  }

  googleAnalyticsEvent(action: string, dateRange: FilterModel) {
    const value = getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.filter.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'filter-' + action, value}));
  }

  toggleOpen() {
    this.dateRange = {...this.filter};
    this.open = !this.open;
  }

  onApply() {
    const standardRange = getStandardRangeForBeginEndDate({...this.filter, ...this.dateRange});
    const range = getRange(standardRange);
    this.googleAnalyticsEvent('custom-date', this.dateRange);
    this.dateRangeChange.emit({...this.filter, ...this.dateRange, standardRange, range});
    this.open = false;
  }
}
