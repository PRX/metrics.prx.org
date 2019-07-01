import { Component, Input, HostListener } from '@angular/core';
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
      </div>
    </div>
  `,
  styleUrls: ['../../dropdown/dropdown.css', './standard-date-range-dropdown.component.css']
})
export class StandardDateRangeDropdownComponent {
  @Input() standardRange: string;
  @Input() interval: IntervalModel;
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  constructor(private store: Store<any>) {}

  toggleOpen() {
    this.open = !this.open;
  }

  onStandardRangeChange(standardRange: string) {
    this.googleAnalyticsEvent('standard-date', standardRange);
    this.store.dispatch(new RouteStandardRangeAction({standardRange}));
    this.toggleOpen();
  }

  googleAnalyticsEvent(action: string, standardRange: string) {
    const dateRange = dateUtil.getBeginEndDateFromStandardRange(standardRange);
    const value = dateUtil.getAmountOfIntervals(dateRange.beginDate, dateRange.endDate, this.interval);
    this.store.dispatch(new GoogleAnalyticsEventAction({gaAction: 'routerParams-' + action, value}));
  }
}
