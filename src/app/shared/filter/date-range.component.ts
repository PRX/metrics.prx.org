import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';

@Component({
  selector: 'metrics-date-range',
  template: `
    <div>
      <span>From:</span>
      <span>
        <prx-datepicker [date]="filter.beginDate" UTC="true" (dateChange)="onBeginDateChange($event)"></prx-datepicker>
        <prx-timepicker [date]="filter.beginDate" UTC="true" (timeChange)="onBeginDateChange($event)"></prx-timepicker>
      </span>
    </div>
    <div>
      <span>Through:</span>
      <span>
        <prx-datepicker [date]="filter.endDate" UTC="true" (dateChange)="onEndDateChange($event)"></prx-datepicker>
        <prx-timepicker [date]="filter.endDate" UTC="true" (timeChange)="onEndDateChange($event)"></prx-timepicker>
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
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
  }

  onBeginDateChange(date: Date) {
    this.store.dispatch(new CastleFilterAction({filter: {beginDate: date}}));
  }

  onEndDateChange(date: Date) {
    this.store.dispatch(new CastleFilterAction({filter: {endDate: date}}));
  }
}
