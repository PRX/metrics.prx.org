import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FilterModel } from '../ngrx/model';
import { castleFilter } from '../ngrx/actions/castle.action.creator';
import * as moment from 'moment';

@Component({
  selector: 'metrics-downloads-cannedrange',
  template: `
    <div>
      When:
      <prx-select single="true" [options]="whenOptions" [selected]="selected" (onSelect)="onWhenChange($event)"></prx-select>
    </div>
  `
})
export class DownloadsCannedrangeComponent implements OnInit {
  filterStore: Observable<FilterModel>;
  filter: FilterModel;
  whenOptions: any[];
  selected: string;

  constructor(public store: Store<any>) {
    this.filterStore = this.store.select('filter');
  }

  ngOnInit() {
    this.filterStore.subscribe(state => {
      this.filter = state;
      this.genWhenDates();
    });
  }

  genWhenDates() {
    this.selected = null;

    let utcEndDate = moment().utc().hours(23).minutes(59).seconds(59).milliseconds(999);
    let utcBeginDate = moment().utc().hours(0).minutes(0).seconds(0).milliseconds(0);
    const daysIntoWeek = utcEndDate.day();

    this.whenOptions = [['Today', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]];
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(daysIntoWeek, 'days');
    this.whenOptions.push(['This week', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(7, 'days');
    this.whenOptions.push(['2 weeks', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push(['This month', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(2, 'months');
    this.whenOptions.push(['3 months', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate = moment().utc().month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push(['This year', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate.subtract(1, 'days');
    utcBeginDate = moment().utc().subtract(1, 'days').hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push(['Yesterday', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = moment().utc().subtract(daysIntoWeek + 1, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
    utcBeginDate = moment().utc().subtract(daysIntoWeek + 7, 'days').hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push(['Last week', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = moment().utc().subtract(daysIntoWeek + 8, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
    utcBeginDate = moment().utc().subtract(daysIntoWeek + 21, 'days').hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push(['Prior 2 weeks', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'days'); // 1st of month - 1 day
    utcBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(1, 'months'); // 1st of month - 1 month
    this.whenOptions.push(['Last month', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    // first of this month - 1 day and 2 months
    utcEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'days').subtract(2, 'months');
    // first of this month - 5 months
    utcBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(5, 'months');
    this.whenOptions.push(['Prior 3 months', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    // last day of year minus 1 year
    utcEndDate = moment().utc().month(11).date(31).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'years');
    // first day of year minus 1 year
    utcBeginDate = moment().utc().month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(1, 'years');
    this.whenOptions.push(['Last year', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    // We don't have back data yet, but users want an All time option,
    //  suppose that would just use the pub date of the very first episode as the begin date
    // this.whenOptions.push(['All time', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
  }

  setSelectedIfFilterIsRange(range) {
    const { beginDate, endDate } = range[1];
    if (this.filter.beginDate.valueOf() === beginDate.valueOf() &&
      this.filter.endDate.valueOf() === endDate.valueOf()) {
      this.selected = range;
    }
  }

  onWhenChange(val) {
    const { beginDate, endDate } = val;
    this.store.dispatch(castleFilter({beginDate, endDate}));
  }
}
