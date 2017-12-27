import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationPayload, RouterNavigationAction } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { FilterModel, IntervalList } from '../';
import { CastleFilterAction, CastlePodcastChartToggleAction, CastleEpisodeChartToggleAction } from '../actions';
import { getStandardRangeForBeginEndDate, getBeginEndDateFromStandardRange } from '../../shared/util/date.util';

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
        if (params['interval']) {
          filter.interval = IntervalList.find(i => i.key === params['interval']);
        }
        if (params['beginDate']) {
          filter.beginDate = new Date(params['beginDate']);
        }
        if (params['endDate']) {
          filter.endDate = new Date(params['endDate']);
        }
        // begin and end date take precendence over standard range because "users want to use urls to pass around reports"
        // "users want to bookmark common parameters" is mutually exclusive with the idea of using these date based urls
        // because dates (and episodes) are temporal parameters that would change over time
        if (filter.beginDate && filter.endDate) {
          // maybe these shouldn't even go in the url if they are being overridden, but "all things must go in the url"
          filter.standardRange = getStandardRangeForBeginEndDate(filter);
        } else if (params['standardRange']) {
          filter.standardRange = params['standardRange'];
          const { beginDate, endDate } = getBeginEndDateFromStandardRange(filter.standardRange);
          filter.beginDate = beginDate;
          filter.endDate = endDate;
        }
        if (params['episodes']) {
          params['episodes'].split(',').map(stringValue => +stringValue).forEach(episodeId => {
            this.store.dispatch(new CastleEpisodeChartToggleAction({id: episodeId, seriesId: filter.podcastSeriesId, charted: true}));
          });
        }
        if (params['page']) {
          filter.page = +params['page'];
        }
        if (params['chartPodcast']) {
          const charted = params['chartPodcast'] === 'true';
          this.store.dispatch(new CastlePodcastChartToggleAction({seriesId: filter.podcastSeriesId, charted}));
        }
      }
      return Observable.of(new CastleFilterAction({filter}));
    });

  constructor(public store: Store<any>,
              private actions$: Actions) {}
}
