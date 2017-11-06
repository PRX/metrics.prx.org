import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { FilterModel, TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from '../../../ngrx/model';
import { selectFilter } from '../../../ngrx/reducers';
import { endOfTodayUTC, getStandardRangeForBeginEndDate } from '../../util/date.util';

@Component({
  selector: 'metrics-next-date-range',
  template: `
    <button class="btn-link" disabled="{{nextDisabled}}" (click)="next()">NEXT&nbsp;&gt;&gt;</button>
  `
})
export class NextDateRangeComponent implements OnInit, OnDestroy {
  filterStoreSub: Subscription;
  filter: FilterModel;

  constructor(public store: Store<any>,
              private router: Router) {}

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
    if (!this.filter || !this.filter.range ||!this.filter.podcastSeriesId || !this.filter.interval) {
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
    if (this.filter.range && this.filter.range.length && this.filter.podcastSeriesId && this.filter.interval) {
      const newBeginDate = moment(this.filter.beginDate).utc().add(this.filter.range[0], this.filter.range[1]).toDate();
      const newEndDate = moment.min(endOfTodayUTC(),
        moment(this.filter.endDate).utc().add(this.filter.range[0], this.filter.range[1])).toDate();
      let standardRange = this.getNextStandardRange();
      // the first attempt at assigning when is where we are certain, if we aren't certain, we need to check for matching date ranges
      if (!standardRange) {
        standardRange = getStandardRangeForBeginEndDate({beginDate: newBeginDate, endDate: newEndDate});
      }
      const routerParams = {
        range: this.filter.range,
        beginDate: newBeginDate.toISOString(),
        endDate: newEndDate.toISOString()
      };
      // can be undefined and don't want undefined in route
      if (standardRange) {
        routerParams['standardRange'] = standardRange;
      }
      this.router.navigate([this.filter.podcastSeriesId, 'downloads', this.filter.interval.key, routerParams]);
    }
  }

  getNextStandardRange() {
    switch (this.filter.standardRange) {
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
