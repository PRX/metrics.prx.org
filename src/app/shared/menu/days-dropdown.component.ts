import { Component, Input, OnChanges, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterParams, INTERVAL_HOURLY } from '../../ngrx';
import { RouteDaysAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-days-dropdown',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()" >{{ routerParams?.days }} Days<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout short">
        <ul>
          <li *ngFor="let days of daysOptions">
            <button class="btn-link" [class.active]="days === routerParams?.days" (click)="onDaysChange(days)">
              {{ days }} Days
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['../dropdown/dropdown.css', './days-dropdown.component.css']
})
export class DaysDropdownComponent implements OnChanges {
  @Input() routerParams: RouterParams;
  daysOptions = [7, 14, 28, 30, 60, 90];
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  constructor(private store: Store<any>) {}

  ngOnChanges() {
    this.daysOptions = this.getDaysOptions();
  }

  getDaysOptions(): number[] {
    /* API requests limited as follows:
     10 days at 15m
     40 days at 1h
     2.7 years at 1d
     */
    if (this.routerParams && this.routerParams.interval && this.routerParams.interval === INTERVAL_HOURLY) {
      return [1, 2, 3, 5, 7];
    } else {
      return [7, 14, 28, 30, 60, 90];
    }
  }

  toggleOpen() {
    this.open = !this.open;
  }

  onDaysChange(days: number) {
    if (days && days !== this.routerParams.days) {
      this.store.dispatch(new RouteDaysAction({days}));
    }
    this.toggleOpen();
  }
}
