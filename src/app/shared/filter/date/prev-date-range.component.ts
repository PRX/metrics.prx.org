import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { FilterModel, TODAY, THIS_WEEK, TWO_WEEKS, THIS_MONTH, THREE_MONTHS, THIS_YEAR,
  YESTERDAY, LAST_WEEK, PRIOR_TWO_WEEKS, LAST_MONTH, PRIOR_THREE_MONTHS, LAST_YEAR } from '../../../ngrx/model';
import { selectFilter } from '../../../ngrx/reducers';
import { CastleFilterAction } from '../../../ngrx/actions';
import { beginningOfYesterdayUTC, endOfYesterdayUTC, beginningOfLastWeekUTC, endOfLastWeekUTC,
  beginningOfPriorTwoWeeksUTC, endOfPriorTwoWeeksUTC, beginningOfLastMonthUTC, endOfLastMonthUTC,
  beginningOfPriorThreeMonthsUTC, endOfPriorThreeMonthsUTC, beginningOfLastYearUTC, endOfLastYearUTC,
  getWhenForRange } from '../../../shared/util/date.util';

@Component({
  selector: 'metrics-prev-date-range',
  template: `
    <button class="btn-link" disabled="{{prevDisabled}}" (click)="prev()">&lt;&lt;&nbsp;PREV</button>
  `
})
export class PrevDateRangeComponent implements OnInit, OnDestroy {
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

  get prevDisabled(): string {
    if (!this.filter || !this.filter.range) {
      return 'disabled';
    } else {
      return null;
    }
  }

  prev() {
    if (this.filter.range && this.filter.range.length) {
      const filter = this.getPrev();
      this.store.dispatch(new CastleFilterAction({filter}));
    }
  }

  getPrev() {
    let beginDate;
    let endDate;
    let when;
    switch (this.filter.when) {
      case TODAY:
        beginDate = beginningOfYesterdayUTC().toDate();
        endDate = endOfYesterdayUTC().toDate();
        when = YESTERDAY;
        break;
      case YESTERDAY:
        break;
      case THIS_WEEK:
        beginDate = beginningOfLastWeekUTC().toDate();
        endDate = endOfLastWeekUTC().toDate();
        when = LAST_WEEK;
        break;
      case LAST_WEEK:
        break;
      case TWO_WEEKS:
        beginDate = beginningOfPriorTwoWeeksUTC().toDate();
        endDate = endOfPriorTwoWeeksUTC().toDate();
        when = PRIOR_TWO_WEEKS;
        break;
      case PRIOR_TWO_WEEKS:
        break;
      case THIS_MONTH:
        beginDate = beginningOfLastMonthUTC().toDate();
        endDate = endOfLastMonthUTC().toDate();
        when = LAST_MONTH;
        break;
      case LAST_MONTH:
        break;
      case THREE_MONTHS:
        beginDate = beginningOfPriorThreeMonthsUTC().toDate();
        endDate = endOfPriorThreeMonthsUTC().toDate();
        when = PRIOR_THREE_MONTHS;
        break;
      case PRIOR_THREE_MONTHS:
        break;
      case THIS_YEAR:
        beginDate = beginningOfLastYearUTC().toDate();
        endDate = endOfLastYearUTC().toDate();
        when = LAST_YEAR;
        break;
      case LAST_YEAR:
        break;
      default:
        break;
    }
    if (!beginDate && !endDate) {
      beginDate = moment(this.filter.beginDate).utc().subtract(this.filter.range[0], this.filter.range[1]).toDate();
      endDate = moment(this.filter.endDate).utc().subtract(this.filter.range[0], this.filter.range[1]).toDate();
    }
    if (!when) {
      when = getWhenForRange({beginDate, endDate});
    }
    return { when, beginDate, endDate };
  }
}
