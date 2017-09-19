import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FilterModel } from '../ngrx/model';
import { castleFilter } from '../ngrx/actions/castle.action.creator';

@Component({
  selector: 'metrics-downloads-daterange',
  template: `
    <div>
      From:
      <prx-datepicker [date]="filter.beginDate" (dateChange)="onBeginDateChange($event)"></prx-datepicker>
      <prx-timepicker [date]="filter.beginDate" (timeChange)="onBeginDateChange($event)"></prx-timepicker>
      {{ filter.beginDate.toUTCString() }}
    </div>
    <div>
      Through:
      <prx-datepicker [date]="filter.endDate" (dateChange)="onEndDateChange($event)"></prx-datepicker>
      <prx-timepicker [date]="filter.endDate" (timeChange)="onEndDateChange($event)"></prx-timepicker>
      {{ filter.endDate.toUTCString() }}
    </div>
  `,
  styleUrls: ['downloads-daterange.component.css']
})
export class DownloadsDaterangeComponent implements OnInit {
  filterStore: Observable<FilterModel>;
  filter: FilterModel;

  constructor(public store: Store<any>) {
    this.filterStore = this.store.select('filter');
  }

  ngOnInit() {
    this.filterStore.subscribe(state => {
      this.filter = state;
    });
  }

  onBeginDateChange(date: Date) {
    this.store.dispatch(castleFilter({beginDate: date}));
  }

  onEndDateChange(date: Date) {
    this.store.dispatch(castleFilter({endDate: date}));
  }
}
