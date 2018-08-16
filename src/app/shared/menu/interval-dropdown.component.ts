import { Component, Input, OnChanges, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterParams, IntervalModel,
  INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY } from '../../ngrx';
import { RouteIntervalAction } from '../../ngrx/actions';
import * as dateUtil from '../util/date';

@Component({
  selector: 'metrics-interval-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()" >{{ selectedInterval?.name }}<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <ul>
          <li *ngFor="let interval of intervalOptions">
            <button class="btn-link" [class.active]="interval === selectedInterval" (click)="onIntervalChange(interval)">
              {{ interval.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./dropdown.css', './interval-dropdown.component.css']
})
export class IntervalDropdownComponent implements OnChanges {
  @Input() routerParams: RouterParams;
  intervalOptions: IntervalModel[] = [];
  selectedInterval: IntervalModel;
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  constructor(private store: Store<any>) {}

  ngOnChanges() {
    if (this.routerParams && this.routerParams.interval && this.routerParams.beginDate && this.routerParams.endDate) {
      this.selectedInterval = this.routerParams.interval;
      this.intervalOptions = this.getIntervalOptions();
    }
  }

  getIntervalOptions(): IntervalModel[] {
    /* API requests limited as follows:
     10 days at 15m
     40 days at 1h
     2.7 years at 1d
     */
    if (dateUtil.isMoreThanXDays(40, this.routerParams.beginDate, this.routerParams.endDate)) {
      return [INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY];
    } else {
      return [INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY];
    }
  }

  toggleOpen() {
    this.open = !this.open;
  }

  onIntervalChange(interval: IntervalModel) {
    if (interval && interval !== this.routerParams.interval) {
      this.store.dispatch(new RouteIntervalAction({interval}));
    }
    this.toggleOpen();
  }
}
