import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { IntervalModel } from '../../../ngrx';
import { GoogleAnalyticsEventAction, RouteStandardRangeAction } from '../../../ngrx/actions';
import * as dateUtil from '../../util/date';

@Component({
  selector: 'metrics-standard-date-range-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()" >{{ standardRange }}<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <metrics-standard-date-range
          [standardRange]="standardRange" [interval]="interval"
          (standardRangeChange)="onStandardRangeChange($event)">
        </metrics-standard-date-range>
        <ul>
          <li>
            <button class="btn-link" (click)="onCustom()">
              Other...
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['../dropdown.css', './standard-date-range-dropdown.component.css']
})
export class StandardDateRangeDropdownComponent {
  @Input() standardRange: string;
  @Input() interval: IntervalModel;
  @Output() custom = new EventEmitter();
  open = false;

  constructor(private store: Store<any>) {}

  toggleOpen() {
    this.open = !this.open;
  }

  onStandardRangeChange(standardRange: string) {
    this.googleAnalyticsEvent('standard-date', standardRange);
    this.store.dispatch(new RouteStandardRangeAction({standardRange}));
  }

  onCustom() {
    this.custom.emit();
    this.toggleOpen();
  }

  googleAnalyticsEvent(action: string, standardRange: string) {
    const dateRange = dateUtil.getBeginEndDateFromStandardRange(standardRange);
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'filter-' + action, value}));
  }
}
