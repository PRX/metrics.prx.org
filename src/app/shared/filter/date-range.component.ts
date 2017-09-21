import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel } from '../../ngrx/model';
import { castleFilter } from '../../ngrx/actions/castle.action.creator';

@Component({
  selector: 'metrics-date-range',
  template: `
    <div>
      <span>From:</span>
      <span>
        <prx-datepicker [date]="filter.beginDate" (dateChange)="onBeginDateChange($event)"></prx-datepicker>
        <prx-timepicker [date]="filter.beginDate" (timeChange)="onBeginDateChange($event)"></prx-timepicker>
        {{ filter.beginDate.toUTCString() }}
      </span>
    </div>
    <div>
      <span>Through:</span>
      <span>
        <prx-datepicker [date]="filter.endDate" (dateChange)="onEndDateChange($event)"></prx-datepicker>
        <prx-timepicker [date]="filter.endDate" (timeChange)="onEndDateChange($event)"></prx-timepicker>
        {{ filter.endDate.toUTCString() }}
      </span>
    </div>
  `,
  styleUrls: ['date-range.component.css']
})
export class DateRangeComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterStoreSub = this.store.select('filter').subscribe(state => {
      this.filter = state;
    });
  }

  ngOnDestroy() {
    this.filterStoreSub.unsubscribe();
  }

  onBeginDateChange(date: Date) {
    this.store.dispatch(castleFilter({beginDate: date}));
  }

  onEndDateChange(date: Date) {
    this.store.dispatch(castleFilter({endDate: date}));
  }
}
