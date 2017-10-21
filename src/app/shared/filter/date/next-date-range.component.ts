import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { FilterModel, TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from '../../../ngrx/model';
import { selectFilter } from '../../../ngrx/reducers';
import { CastleFilterAction } from '../../../ngrx/actions';
import { endOfTodayUTC, getWhenForRange } from '../../util/date.util';

@Component({
  selector: 'metrics-next-date-range',
  template: `
    <button class="btn-link" disabled="{{nextDisabled}}" (click)="next()">NEXT&nbsp;&gt;&gt;</button>
  `
})
export class NextDateRangeComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterStoreSub = this.store.select(selectFilter).subscribe(newFilter => {
      this.filter = newFilter;
    });
  }

  ngOnDestroy() {
    if (this.filterStoreSub) {
      this.filterStoreSub.unsubscribe();
    }
  }

  get nextDisabled(): string {
    if (!this.filter || !this.filter.range) {
      return 'disabled';
    } else if (moment(this.filter.endDate.valueOf()).utc().add(this.filter.range[0], this.filter.range[1]).valueOf() >
      endOfTodayUTC().endOf(this.filter.range[1]).valueOf()) {
      // disabled if the end date plus the last chosen range is greater than the end of this same period, i.e. week/month/year
      return 'disabled';
    } else {
      return null;
    }
  }

  next() {
    if (this.filter.range && this.filter.range.length) {
      const newBeginDate = moment(this.filter.beginDate).utc().add(this.filter.range[0], this.filter.range[1]).toDate();
      const newEndDate = moment.min(endOfTodayUTC(),
        moment(this.filter.endDate).utc().add(this.filter.range[0], this.filter.range[1])).toDate();
      let when = this.getNextWhen();
      // the first attempt at assigning when is where we are certain, if we aren't certain, we need to check for matching date ranges
      if (!when) {
        when = getWhenForRange({beginDate: newBeginDate, endDate: newEndDate});
      }
      this.store.dispatch(new CastleFilterAction({filter: {when, beginDate: newBeginDate, endDate: newEndDate}}));
    }
  }

  getNextWhen() {
    switch (this.filter.when) {
      case TODAY:
        break;
      case YESTERDAY:
        return TODAY;
      case THIS_WEEK:
        break;
      case LAST_WEEK:
        return THIS_WEEK;
      case TWO_WEEKS:
        break;
      case PRIOR_TWO_WEEKS:
        return TWO_WEEKS;
      case THIS_MONTH:
        break;
      case LAST_MONTH:
        return THIS_MONTH;
      case THREE_MONTHS:
        break;
      case PRIOR_THREE_MONTHS:
        return THREE_MONTHS;
      case THIS_YEAR:
        break;
      case LAST_YEAR:
        return THIS_YEAR;
      default:
        break;
    }
  }
}
