import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';
import { isMoreThanXDays } from '../util/date.util';

@Component({
  selector: 'metrics-interval',
  template: `
    <span>Interval:</span>
    <span>
      <prx-select single="true" [options]="intervalOptions" [selected]="selectedInterval" (onSelect)="onIntervalChange($event)">
      </prx-select>
    </span>
  `
})
export class IntervalComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  intervalOptions: any[] = [];
  selectedInterval: any;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterStoreSub = this.store.select('filter').subscribe(newFilter => {
      if (newFilter && newFilter.interval && newFilter.beginDate && newFilter.endDate) {
        this.filter = newFilter;
        this.selectedInterval = this.filter.interval;
        /* API requests limited as follows:
         10 days at 15m
         40 days at 1h
         2.7 years at 1d
         */
        if (isMoreThanXDays(40, this.filter.beginDate, this.filter.endDate)) {
          this.intervalOptions = [
            [INTERVAL_DAILY.name, INTERVAL_DAILY]
          ];
        } else if (isMoreThanXDays(10, this.filter.beginDate, this.filter.endDate)) {
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
      }
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) {
      this.filterStoreSub.unsubscribe();
    }
  }

  onIntervalChange(value: any) {
    this.store.dispatch(new CastleFilterAction({filter: {interval: value}}));
  }
}