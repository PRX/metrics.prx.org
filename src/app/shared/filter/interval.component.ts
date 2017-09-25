import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN } from '../../ngrx/model';
import { castleFilter } from '../../ngrx/actions/castle.action.creator';

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

  constructor(public store: Store<any>) {
    this.intervalOptions = [
      [INTERVAL_DAILY.name, INTERVAL_DAILY],
      [INTERVAL_HOURLY.name, INTERVAL_HOURLY],
      [INTERVAL_15MIN.name, INTERVAL_15MIN]
    ];
  }

  ngOnInit() {
    this.filterStoreSub = this.store.select('filter').subscribe(state => {
      this.filter = state;
      this.selectedInterval = this.filter.interval;
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) {
      this.filterStoreSub.unsubscribe();
    }
  }

  onIntervalChange(value: any) {
    this.store.dispatch(castleFilter({interval: value}));
  }
}
