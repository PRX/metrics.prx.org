import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-interval',
  template: `
    <span>Interval:</span>
    <prx-select single="true" [options]="intervalOptions" [selected]="selectedInterval" (onSelect)="onIntervalChange($event)"></prx-select>
  `,
  styleUrls: ['date-range.component.css']
})
export class IntervalComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  intervalOptions: any[];
  selectedInterval: any;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterStoreSub = this.store.select('filter').subscribe(state => {
      this.filter = state;
      this.selectedInterval = this.filter.interval;
      /* API requests limited as follows:
       10 days at 15m
       40 days at 1h
       2.7 years at 1d
       */
      if (this.isMoreThanXDays(40)) {
        this.intervalOptions = [
          [INTERVAL_DAILY.name, INTERVAL_DAILY]
        ];
      } else if (this.isMoreThanXDays(10)) {
        this.intervalOptions = [
          [INTERVAL_DAILY.name, INTERVAL_DAILY],
          [INTERVAL_HOURLY.name, INTERVAL_HOURLY],
        ];
      } else {
        this.intervalOptions = [
          [INTERVAL_DAILY.name, INTERVAL_DAILY],
          [INTERVAL_HOURLY.name, INTERVAL_HOURLY],
          [INTERVAL_15MIN.name, INTERVAL_15MIN]
        ];
      }
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) {
      this.filterStoreSub.unsubscribe();
    }
  }

  isMoreThanXDays(x: number): boolean {
    return this.filter.endDate.valueOf() - this.filter.beginDate.valueOf() > (1000 * 60 * 60 * 24 * x); // x days
  }

  onIntervalChange(value: any) {
    this.store.dispatch(new CastleFilterAction({filter: {interval: value}}));
  }
}
