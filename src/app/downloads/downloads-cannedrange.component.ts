import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FilterModel } from '../ngrx/model';
import { castleFilter } from '../ngrx/actions/castle.action.creator';
import * as moment from 'moment';

const TODAY = 'Today';
const THIS_WEEK = 'This week';
const TWO_WEEKS = '2 weeks';
const THIS_MONTH = 'This month';
const THREE_MONTHS = '3 months';
const THIS_YEAR = 'This year';
const YESTERDAY = 'Yesterday';
const LAST_WEEK = 'Last week';
const PRIOR_TWO_WEEKS = 'Prior 2 weeks';
const LAST_MONTH = 'Last month';
const PRIOR_THREE_MONTHS = 'Prior 3 months';
const LAST_YEAR = 'Last year';

@Component({
  selector: 'metrics-downloads-cannedrange',
  template: `
    <button class="btn-link" disabled="{{prevDisabled}}" (click)="prev()">&lt;&lt; PREV</button>
    <div>
      When:
      <prx-select single="true" [options]="whenOptions" [selected]="selected" (onSelect)="onWhenChange($event)"></prx-select>
    </div>
    <button class="btn-link">NEXT &gt;&gt;</button>
  `
})
export class DownloadsCannedrangeComponent implements OnInit {
  filterStore: Observable<FilterModel>;
  filter: FilterModel;
  whenOptions: any[];
  selected: any[];

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

    this.whenOptions = [[TODAY, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]];
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(daysIntoWeek, 'days');
    this.whenOptions.push([THIS_WEEK, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(7, 'days');
    this.whenOptions.push([TWO_WEEKS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push([THIS_MONTH, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(2, 'months');
    this.whenOptions.push([THREE_MONTHS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate = moment().utc().month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push([THIS_YEAR, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate.subtract(1, 'days');
    utcBeginDate = moment().utc().subtract(1, 'days').hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push([YESTERDAY, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = moment().utc().subtract(daysIntoWeek + 1, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
    utcBeginDate = moment().utc().subtract(daysIntoWeek + 7, 'days').hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push([LAST_WEEK, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = moment().utc().subtract(daysIntoWeek + 8, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
    utcBeginDate = moment().utc().subtract(daysIntoWeek + 21, 'days').hours(0).minutes(0).seconds(0).milliseconds(0);
    this.whenOptions.push([PRIOR_TWO_WEEKS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'days'); // 1st of month - 1 day
    utcBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(1, 'months'); // 1st of month - 1 month
    this.whenOptions.push([LAST_MONTH, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    // first of this month - 1 day and 2 months
    utcEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'days').subtract(2, 'months');
    // first of this month - 5 months
    utcBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(5, 'months');
    this.whenOptions.push([PRIOR_THREE_MONTHS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    // last day of year minus 1 year
    utcEndDate = moment().utc().month(11).date(31).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'years');
    // first day of year minus 1 year
    utcBeginDate = moment().utc().month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(1, 'years');
    this.whenOptions.push([LAST_YEAR, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
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

  get prevDisabled(): string {
    if (!this.selected) {
      return 'disabled';
    } else {
      return null;
    }
  }

  prev() {
    if (this.selected) {
      const { beginDate, endDate } = this.selected[1];
      let newBeginDate, newEndDate;
      switch (this.selected[0]) {
        case TODAY:
        case YESTERDAY:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'days');
          newEndDate = moment(endDate.valueOf()).utc().subtract(1, 'days');
          break;
        case THIS_WEEK:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'weeks');
          newEndDate = moment().utc();
          newEndDate.subtract(newEndDate.days() + 1, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
          break;
        case LAST_WEEK:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'weeks');
          newEndDate = moment(endDate.valueOf()).utc().subtract(1, 'weeks');
          break;
        case TWO_WEEKS:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(2, 'weeks');
          newEndDate = moment().utc();
          newEndDate.subtract(newEndDate.days() + 8, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
          break;
        case PRIOR_TWO_WEEKS:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(2, 'weeks');
          newEndDate = moment(endDate.valueOf()).utc().subtract(2, 'weeks');
          break;
        case THIS_MONTH:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'months');
          newEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'days');
          break;
        case LAST_MONTH:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'months');
          newEndDate = moment(endDate.valueOf()).utc().subtract(1, 'months');
          break;
        case THREE_MONTHS:
          // first of this month - 5 months
          newBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(5, 'months');
          // first of this month - 1 day and 2 months
          newEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'days').subtract(2, 'months');
          break;
        case PRIOR_THREE_MONTHS:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(3, 'months');
          newEndDate = moment(endDate.valueOf()).utc().subtract(3, 'months');
          break;
        case THIS_YEAR:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'year');
          newEndDate = moment().utc().month(11).date(31).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'years');
          break;
        case LAST_YEAR:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'year');
          newEndDate = moment(endDate.valueOf()).utc().subtract(1, 'year');
          break;
        default:
          break;
      }
      if (newBeginDate && newEndDate) {
        this.store.dispatch(castleFilter({beginDate: newBeginDate.toDate(), endDate: newEndDate.toDate()}));
      }
    }
  }
}
