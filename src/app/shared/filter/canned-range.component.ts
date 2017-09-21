import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel } from '../../ngrx/model';
import { castleFilter } from '../../ngrx/actions/castle.action.creator';
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
  selector: 'metrics-canned-range',
  template: `
    <button class="btn-link" disabled="{{prevDisabled}}" (click)="prev()">&lt;&lt;&nbsp;PREV</button>
    <div>
      <span>When:</span>
      <span>
        <prx-select single="true" [options]="whenOptions" [selected]="selected" (onSelect)="onWhenChange($event)"></prx-select>
      </span>
    </div>
    <button class="btn-link" disabled="{{nextDisabled}}" (click)="next()">NEXT&nbsp;&gt;&gt;</button>
  `,
  styleUrls: ['./canned-range.component.css']
})
export class CannedRangeComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  whenOptions: any[];
  selected: any[];
  lastChosenRange: any[];

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterStoreSub = this.store.select('filter').subscribe(state => {
      this.filter = state;
      this.genWhenDates();
    });
  }

  ngOnDestroy() {
    this.filterStoreSub.unsubscribe();
  }

  endOfTodayUTC() {
    return moment().utc().hours(23).minutes(59).seconds(59).milliseconds(999);
  }

  beginningOfTodayUTC() {
    return moment().utc().hours(0).minutes(0).seconds(0).milliseconds(0);
  }

  genWhenDates() {
    this.selected = null;

    let utcEndDate = this.endOfTodayUTC();
    let utcBeginDate = this.beginningOfTodayUTC();
    const daysIntoWeek = utcEndDate.day();

    this.whenOptions = [[TODAY, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]];
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(daysIntoWeek, 'days');
    this.whenOptions.push([THIS_WEEK, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(7, 'days');
    this.whenOptions.push([TWO_WEEKS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate = this.beginningOfTodayUTC().date(1);
    this.whenOptions.push([THIS_MONTH, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate.subtract(2, 'months');
    this.whenOptions.push([THREE_MONTHS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcBeginDate = this.beginningOfTodayUTC().month(0).date(1);
    this.whenOptions.push([THIS_YEAR, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate.subtract(1, 'days');
    utcBeginDate = this.beginningOfTodayUTC().subtract(1, 'days');
    this.whenOptions.push([YESTERDAY, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = this.endOfTodayUTC().subtract(daysIntoWeek + 1, 'days');
    utcBeginDate = this.beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days');
    this.whenOptions.push([LAST_WEEK, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = this.endOfTodayUTC().subtract(daysIntoWeek + 8, 'days');
    utcBeginDate = this.beginningOfTodayUTC().subtract(daysIntoWeek + 21, 'days');
    this.whenOptions.push([PRIOR_TWO_WEEKS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    utcEndDate = this.endOfTodayUTC().date(1).subtract(1, 'days'); // 1st of month - 1 day
    utcBeginDate = this.beginningOfTodayUTC().date(1).subtract(1, 'months'); // 1st of month - 1 month
    this.whenOptions.push([LAST_MONTH, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    // first of this month - 1 day and 2 months
    utcEndDate = this.endOfTodayUTC().date(1).subtract(1, 'days').subtract(2, 'months');
    // first of this month - 5 months
    utcBeginDate = this.beginningOfTodayUTC().date(1).subtract(5, 'months');
    this.whenOptions.push([PRIOR_THREE_MONTHS, {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    this.setSelectedIfFilterIsRange(this.whenOptions[this.whenOptions.length - 1]);

    // last day of year minus 1 year
    utcEndDate = this.endOfTodayUTC().month(11).date(31).subtract(1, 'years');
    // first day of year minus 1 year
    utcBeginDate = this.beginningOfTodayUTC().month(0).date(1).subtract(1, 'years');
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
      this.setLastChosenRange();
    }
  }

  setLastChosenRange() {
    switch (this.selected[0]) {
      case TODAY:
      case YESTERDAY:
        this.lastChosenRange = [1, 'days'];
        break;
      case THIS_WEEK:
      case LAST_WEEK:
        this.lastChosenRange =  [1, 'weeks'];
        break;
      case TWO_WEEKS:
      case PRIOR_TWO_WEEKS:
        this.lastChosenRange = [2, 'weeks'];
        break;
      case THIS_MONTH:
      case LAST_MONTH:
        this.lastChosenRange = [1, 'months'];
        break;
      case THREE_MONTHS:
      case PRIOR_THREE_MONTHS:
        this.lastChosenRange = [3, 'months'];
        break;
      case THIS_YEAR:
      case LAST_YEAR:
        this.lastChosenRange = [1, 'year'];
        break;
      default:
        break;
    }
  }

  onWhenChange(val) {
    const { beginDate, endDate } = val;
    this.store.dispatch(castleFilter({beginDate, endDate}));
  }

  get prevDisabled(): string {
    if (!this.selected && !this.lastChosenRange) {
      return 'disabled';
    } else {
      return null;
    }
  }

  get nextDisabled(): string {
    if (!this.filter || !this.lastChosenRange) {
      return 'disabled';
    } else if (moment(this.filter.endDate.valueOf()).utc().add(this.lastChosenRange[0], this.lastChosenRange[1]).valueOf() >
      this.endOfTodayUTC().endOf(this.lastChosenRange[1]).valueOf()) {
      // disabled if the end date plus the last chosen range is greater than the end of this same period, i.e. week/month/year
      return 'disabled';
    } else {
      return null;
    }
  }

  prev() {
    let newBeginDate, newEndDate;
    if (this.selected) {
      const { beginDate, endDate } = this.selected[1];
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
    } else if (this.lastChosenRange) {
      newBeginDate = moment(this.filter.beginDate).utc().subtract(this.lastChosenRange[0], this.lastChosenRange[1]);
      newEndDate = moment(this.filter.endDate).utc().subtract(this.lastChosenRange[0], this.lastChosenRange[1]);
    }
    if (newBeginDate && newEndDate) {
      this.store.dispatch(castleFilter({beginDate: newBeginDate.toDate(), endDate: newEndDate.toDate()}));
    }
  }

  next() {
    let newBeginDate, newEndDate;
    if (this.selected) {
      const { beginDate, endDate } = this.selected[1];
      switch (this.selected[0]) {
        case TODAY:
          break;
        case YESTERDAY:
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'days');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'days'), this.endOfTodayUTC());
          break;
        case THIS_WEEK:
          break;
        case LAST_WEEK:
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'weeks');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'weeks'), this.endOfTodayUTC());
          break;
        case TWO_WEEKS:
          break;
        case PRIOR_TWO_WEEKS:
          newBeginDate = moment(beginDate.valueOf()).utc().add(2, 'weeks');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(2, 'weeks'), this.endOfTodayUTC());
          break;
        case THIS_MONTH:
          break;
        case LAST_MONTH:
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'months');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'months'), this.endOfTodayUTC());
          break;
        case THREE_MONTHS:
          break;
        case PRIOR_THREE_MONTHS:
          newBeginDate = moment(beginDate.valueOf()).utc().add(3, 'months');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(3, 'months'), this.endOfTodayUTC());
          break;
        case THIS_YEAR:
          break;
        case LAST_YEAR:
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'year');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'year'), this.endOfTodayUTC());
          break;
        default:
          break;
      }
    } else if (this.lastChosenRange) {
      newBeginDate = moment(this.filter.beginDate).utc().add(this.lastChosenRange[0], this.lastChosenRange[1]);
      newEndDate = moment(this.filter.endDate).utc().add(this.lastChosenRange[0], this.lastChosenRange[1]);
    }
    if (newBeginDate && newEndDate) {
      this.store.dispatch(castleFilter({beginDate: newBeginDate.toDate(), endDate: newEndDate.toDate()}));
    }
  }
}
