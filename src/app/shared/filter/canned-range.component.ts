import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel, INTERVAL_15MIN, INTERVAL_HOURLY, INTERVAL_DAILY,
  TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from '../../ngrx/model';
import { CastleFilterAction } from '../../ngrx/actions';
import { isMoreThanXDays, beginningOfTodayUTC, endOfTodayUTC } from '../util/date.util';
import * as moment from 'moment';

@Component({
  selector: 'metrics-canned-range',
  template: `
    <button class="btn-link" disabled="{{prevDisabled}}" (click)="prev()">&lt;&lt;&nbsp;PREV</button>
    <div>
      <span>When:</span>
      <span>
        <prx-select single="true" [options]="whenOptions" [selected]="selection" (onSelect)="onWhenChange($event)"></prx-select>
      </span>
    </div>
    <button class="btn-link" disabled="{{nextDisabled}}" (click)="next()">NEXT&nbsp;&gt;&gt;</button>
  `,
  styleUrls: ['./canned-range.component.css']
})
export class CannedRangeComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;
  whenOptions: any[][];
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
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
  }

  genWhenDates() {
    this.selected = null;

    if (!this.filter.when) {
      // clear out last chosen range if user used the date pickers
      this.lastChosenRange = null;
    }

    let utcEndDate = endOfTodayUTC();
    let utcBeginDate = beginningOfTodayUTC();
    const daysIntoWeek = utcEndDate.day();

    this.whenOptions = [[TODAY, {when: TODAY, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]];

    utcBeginDate.subtract(daysIntoWeek, 'days');
    this.whenOptions.push([THIS_WEEK, {when: THIS_WEEK, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);

    utcBeginDate.subtract(7, 'days');
    if (this.filter.interval !== INTERVAL_15MIN ||
      (this.filter.interval === INTERVAL_15MIN && !isMoreThanXDays(10, utcBeginDate, utcEndDate))) {
      this.whenOptions.push([TWO_WEEKS, {when: TWO_WEEKS, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    }

    utcBeginDate = beginningOfTodayUTC().date(1);
    if (this.filter.interval !== INTERVAL_15MIN ||
      (this.filter.interval === INTERVAL_15MIN && !isMoreThanXDays(10, utcBeginDate, utcEndDate))) {
      this.whenOptions.push([THIS_MONTH, {when: THIS_MONTH, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    }

    utcBeginDate.subtract(2, 'months');
    if (this.filter.interval === INTERVAL_DAILY ||
      (this.filter.interval === INTERVAL_15MIN && !isMoreThanXDays(10, utcBeginDate, utcEndDate)) ||
      (this.filter.interval === INTERVAL_HOURLY && !isMoreThanXDays(40, utcBeginDate, utcEndDate))) {
      this.whenOptions.push([THREE_MONTHS, {when: THREE_MONTHS, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    }

    utcBeginDate = beginningOfTodayUTC().month(0).date(1);
    if (this.filter.interval === INTERVAL_DAILY ||
      (this.filter.interval === INTERVAL_15MIN && !isMoreThanXDays(10, utcBeginDate, utcEndDate)) ||
      (this.filter.interval === INTERVAL_HOURLY && !isMoreThanXDays(40, utcBeginDate, utcEndDate))) {
      this.whenOptions.push([THIS_YEAR, {when: THIS_YEAR, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    }

    utcEndDate.subtract(1, 'days');
    utcBeginDate = beginningOfTodayUTC().subtract(1, 'days');
    this.whenOptions.push([YESTERDAY, {when: YESTERDAY, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);

    utcEndDate = endOfTodayUTC().subtract(daysIntoWeek + 1, 'days');
    utcBeginDate = beginningOfTodayUTC().subtract(daysIntoWeek + 7, 'days');
    this.whenOptions.push([LAST_WEEK, {when: LAST_WEEK, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);

    if (this.filter.interval !== INTERVAL_15MIN) {
      utcEndDate = endOfTodayUTC().subtract(daysIntoWeek + 8, 'days');
      utcBeginDate = beginningOfTodayUTC().subtract(daysIntoWeek + 21, 'days');
      this.whenOptions.push([PRIOR_TWO_WEEKS, {when: PRIOR_TWO_WEEKS, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);

      utcEndDate = endOfTodayUTC().date(1).subtract(1, 'days'); // 1st of month - 1 day
      utcBeginDate = beginningOfTodayUTC().date(1).subtract(1, 'months'); // 1st of month - 1 month
      this.whenOptions.push([LAST_MONTH, {when: LAST_MONTH, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    }

    if (this.filter.interval !== INTERVAL_15MIN && this.filter.interval !== INTERVAL_HOURLY) {
      // first of this month - 1 day and 2 months
      utcEndDate = endOfTodayUTC().date(1).subtract(2, 'months').subtract(1, 'days');
      // first of this month - 5 months
      utcBeginDate = beginningOfTodayUTC().date(1).subtract(5, 'months');
      this.whenOptions.push([PRIOR_THREE_MONTHS, {when: PRIOR_THREE_MONTHS,
        beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);

      // last day of year minus 1 year
      utcEndDate = endOfTodayUTC().month(11).date(31).subtract(1, 'years');
      // first day of year minus 1 year
      utcBeginDate = beginningOfTodayUTC().month(0).date(1).subtract(1, 'years');
      this.whenOptions.push([LAST_YEAR, {when: LAST_YEAR, beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);
    }

    // We don't have back data yet, but users want an All time option,
    //  suppose that would just use the pub date of the very first episode as the begin date
    // this.whenOptions.push(['All time', {beginDate: utcBeginDate.toDate(), endDate: utcEndDate.toDate()}]);

    this.whenOptions.forEach(this.setSelectedIfFilterIsRange.bind(this));
  }

  get selection(): any {
    return this.selected && this.selected.length ? this.selected[1] : null;
  }

  setSelectedIfFilterIsRange(range) {
    const { when, beginDate, endDate } = range[1];
    // if the 1st of the month or 1st of the year is on a Sunday or it's January and the user selected THIS_YEAR,
    // the dates might match but that's not what the user selected
    const misMatchedNamedRanges = this.lastChosenRange &&
      (this.lastChosenRange[1].indexOf('week') !== -1 && when.indexOf('month') !== -1 ||
      this.lastChosenRange[1].indexOf('week') !== -1 && when.indexOf('year') !== -1 ||
      this.lastChosenRange[1].indexOf('month') !== -1 && when.indexOf('week') !== -1 ||
      this.lastChosenRange[1].indexOf('month') !== -1 && when.indexOf('year') !== -1);

    if (this.filter.beginDate && this.filter.endDate &&
      this.filter.beginDate.valueOf() === beginDate.valueOf() &&
      this.filter.endDate.valueOf() === endDate.valueOf() &&
      (!this.filter.when || this.filter.when === when) &&
      !misMatchedNamedRanges) {
      this.selected = range;
      this.setLastChosenRange(when);
      // keep state in sync
      if (!this.filter.when) {
        this.store.dispatch(new CastleFilterAction({filter: {when, beginDate, endDate}}));
      }
    }
  }

  onWhenChange(val) {
    if (val && val.when && val.beginDate && val.endDate) {
      const { when, beginDate, endDate } = val;
      this.setLastChosenRange(when);
      this.store.dispatch(new CastleFilterAction({filter: {when, beginDate, endDate}}));
    }
  }

  setLastChosenRange(when: string) {
    switch (when) {
      case TODAY:
      case YESTERDAY:
        this.lastChosenRange = [1, 'days'];
        break;
      case THIS_WEEK:
      case LAST_WEEK:
        this.lastChosenRange = [1, 'weeks'];
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
        this.lastChosenRange = [1, 'years'];
        break;
      default:
        break;
    }
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
      endOfTodayUTC().endOf(this.lastChosenRange[1]).valueOf()) {
      // disabled if the end date plus the last chosen range is greater than the end of this same period, i.e. week/month/year
      return 'disabled';
    } else {
      return null;
    }
  }

  prev() {
    let when, newBeginDate, newEndDate;
    if (this.selected) {
      const { beginDate, endDate } = this.selected[1];
      switch (this.selected[0]) {
        case TODAY:
          when = YESTERDAY;
        case YESTERDAY:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'days');
          newEndDate = moment(endDate.valueOf()).utc().subtract(1, 'days');
          break;
        case THIS_WEEK:
          when = LAST_WEEK;
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'weeks');
          newEndDate = moment().utc();
          newEndDate.subtract(newEndDate.days() + 1, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
          break;
        case LAST_WEEK:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'weeks');
          newEndDate = moment(endDate.valueOf()).utc().subtract(1, 'weeks');
          break;
        case TWO_WEEKS:
          when = PRIOR_TWO_WEEKS;
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(2, 'weeks');
          newEndDate = moment().utc();
          newEndDate.subtract(newEndDate.days() + 8, 'days').hours(23).minutes(59).seconds(59).milliseconds(999);
          break;
        case PRIOR_TWO_WEEKS:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(2, 'weeks');
          newEndDate = moment(endDate.valueOf()).utc().subtract(2, 'weeks');
          break;
        case THIS_MONTH:
          when = LAST_MONTH;
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'months');
          newEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(1, 'days');
          break;
        case LAST_MONTH:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(1, 'months');
          newEndDate = moment(endDate.valueOf()).utc().subtract(1, 'months');
          break;
        case THREE_MONTHS:
          when = PRIOR_THREE_MONTHS;
          // first of this month - 5 months
          newBeginDate = moment().utc().date(1).hours(0).minutes(0).seconds(0).milliseconds(0).subtract(5, 'months');
          // first of this month - 1 day and 2 months
          newEndDate = moment().utc().date(1).hours(23).minutes(59).seconds(59).milliseconds(999).subtract(2, 'months').subtract(1, 'days');
          break;
        case PRIOR_THREE_MONTHS:
          newBeginDate = moment(beginDate.valueOf()).utc().subtract(3, 'months');
          newEndDate = moment(endDate.valueOf()).utc().subtract(3, 'months');
          break;
        case THIS_YEAR:
          when = LAST_YEAR;
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
      this.store.dispatch(new CastleFilterAction({filter: {when, beginDate: newBeginDate.toDate(), endDate: newEndDate.toDate()}}));
    }
  }

  next() {
    let when, newBeginDate, newEndDate;
    if (this.selected) {
      const { beginDate, endDate } = this.selected[1];
      switch (this.selected[0]) {
        case TODAY:
          break;
        case YESTERDAY:
          when = TODAY;
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'days');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'days'), endOfTodayUTC());
          break;
        case THIS_WEEK:
          break;
        case LAST_WEEK:
          when = THIS_WEEK;
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'weeks');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'weeks'), endOfTodayUTC());
          break;
        case TWO_WEEKS:
          break;
        case PRIOR_TWO_WEEKS:
          when = TWO_WEEKS;
          newBeginDate = moment(beginDate.valueOf()).utc().add(2, 'weeks');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(2, 'weeks'), endOfTodayUTC());
          break;
        case THIS_MONTH:
          break;
        case LAST_MONTH:
          when = THIS_MONTH;
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'months');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'months'), endOfTodayUTC());
          break;
        case THREE_MONTHS:
          break;
        case PRIOR_THREE_MONTHS:
          when = THREE_MONTHS;
          newBeginDate = moment(beginDate.valueOf()).utc().add(3, 'months');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(3, 'months'), endOfTodayUTC());
          break;
        case THIS_YEAR:
          break;
        case LAST_YEAR:
          when = THIS_YEAR;
          newBeginDate = moment(beginDate.valueOf()).utc().add(1, 'year');
          newEndDate = moment.min(moment(endDate.valueOf()).utc().add(1, 'year'), endOfTodayUTC());
          break;
        default:
          break;
      }
    } else if (this.lastChosenRange) {
      newBeginDate = moment(this.filter.beginDate).utc().add(this.lastChosenRange[0], this.lastChosenRange[1]);
      newEndDate = moment(this.filter.endDate).utc().add(this.lastChosenRange[0], this.lastChosenRange[1]);
    }
    if (newBeginDate && newEndDate) {
      this.store.dispatch(new CastleFilterAction({filter: {when, beginDate: newBeginDate.toDate(), endDate: newEndDate.toDate()}}));
    }
  }
}
