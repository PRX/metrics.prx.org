import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { CastleFilterAction } from '../../../ngrx/actions';
import { FilterModel, DateRangeModel } from '../../../ngrx/model';
import { getBeginEndDateFromWhen, getWhenForRange, getRange } from '../../util/date.util';

@Component({
  selector: 'metrics-date-range',
  template: `
    <metrics-standard-date-range *ngIf="filter" [interval]="filter.interval" [when]="filter.when"
                                 (whenChange)="onWhenChange($event)"></metrics-standard-date-range>
    <metrics-custom-date-range *ngIf="filter" [interval]="filter.interval"
                               [beginDate]="filter.beginDate" [endDate]="filter.endDate"
                               (dateRangeChange)="onDateRangeChange($event)"></metrics-custom-date-range>
  `
})
export class DateRangeComponent implements OnInit, OnDestroy {
  @Output() dateRangeChange = new EventEmitter<DateRangeModel>();
  filterStoreSub: Subscription;
  filter: FilterModel;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterStoreSub = this.store.select('filter').subscribe(state => {
      this.filter = state;
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
  }

  onDateRangeChange(dateRange: DateRangeModel) {
    const when = getWhenForRange(dateRange);
    const range = getRange(when);
    this.dateRangeChange.emit({...dateRange, when, range});
    this.store.dispatch(new CastleFilterAction({filter: {...dateRange, when, range}}));
  }

  onWhenChange(when: string) {
    const dateRange = getBeginEndDateFromWhen(when);
    const range = getRange(when);
    this.dateRangeChange.emit({when, range, ...dateRange});
    this.store.dispatch(new CastleFilterAction({filter: {when, range, ...dateRange}}));
  }
}
