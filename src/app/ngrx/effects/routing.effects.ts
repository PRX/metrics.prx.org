import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationPayload, RouterNavigationAction } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { FilterModel, IntervalList } from '../model';
import { CastleFilterAction } from '../actions';
import { getStandardRangeForBeginEndDate, getBeginEndDateFromStandardRange, getRange } from '../../shared/util/date.util';

@Injectable()
export class RoutingEffects {
  @Effect()
  filterFromRoute$: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .map((action: RouterNavigationAction) => action.payload)
    .switchMap((payload: RouterNavigationPayload<RouterStateSnapshot>) => {
      const filter: FilterModel = {};
      if (payload.routerState.root.firstChild.params &&
        payload.routerState.url && payload.routerState.url.length > 1) {
        const { params } = payload.routerState.root.firstChild; // ActivatedRoute params equiv
        const url = payload.routerState.url.split('/');
        if (params['seriesId'] && !isNaN(parseInt(params['seriesId'], 10))) {
          filter.podcastSeriesId = +params['seriesId'];
        }
        if (url.length >= 3 && url[2]) {
          const type = url[2]; // "downloads" MetricsType
        }
        if (url.length >= 4 && url[3]) {
          const semi = url[3].indexOf(';');
          const interval = semi > 0 ? url[3].substr(0, semi) : url[3];
          filter.interval = IntervalList.find(i => i.key === interval);
        }
        if (params['beginDate']) {
          filter.beginDate = new Date(params['beginDate']);
        }
        if (params['endDate']) {
          filter.endDate = new Date(params['endDate']);
        }
        if (params['range']) {
          filter.range = params['range'].split(',');
        }
        // begin and end date take precendence over standard range because "users want to use urls to pass around reports"
        // "users want to bookmark common parameters" is mutually exclusive with the idea of using these date based urls
        // because dates (and episodes) are temporal parameters that would change over time
        if (filter.beginDate && filter.endDate) {
          // maybe these shouldn't even go in the url if they are being overridden, but "all things must go in the url"
          filter.standardRange = getStandardRangeForBeginEndDate({beginDate: filter.beginDate, endDate: filter.endDate});
        } else if (params['standardRange']) {
          filter.standardRange = params['standardRange'];
          if (!filter.range) {
            filter.range = getRange(filter.standardRange);
          }
          const { beginDate, endDate } = getBeginEndDateFromStandardRange(filter.standardRange);
          filter.beginDate = beginDate;
          filter.endDate = endDate;
        }
        if (params['episodes'] === '') {
          filter.episodeIds = [];
        } else if (params['episodes']) {
          filter.episodeIds = params['episodes'].split(',').map(stringValue => +stringValue);
        }
      }
      return Observable.of(new CastleFilterAction({filter}));
    });

  constructor(private actions$: Actions) {}
}
