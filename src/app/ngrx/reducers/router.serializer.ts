import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { RouterParams, IntervalList,
  METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, MetricsType } from './models';

import { getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate } from '../../shared/util/date/date.util';

// serialize the route snapshot to our custom RouterParams
export class CustomSerializer implements RouterStateSerializer<RouterParams> {
  serialize(routerState: RouterStateSnapshot | any): RouterParams {
    const routerParams: RouterParams = {};
    const { url } = routerState;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    if (params && url.length > 1) {
      if (params['podcastId']) {
        routerParams.podcastId = params['podcastId'];
      }
      // metricsType is not a param because it differentiates the feature module routes
      const urlParts = url.split('/');
      if (urlParts.length >= 3 && urlParts[2]) {
        const metricsType = urlParts[2].split(';')[0];
        switch (metricsType) {
          case METRICSTYPE_DOWNLOADS:
            routerParams.metricsType = <MetricsType>METRICSTYPE_DOWNLOADS;
            break;
          case METRICSTYPE_DEMOGRAPHICS:
            routerParams.metricsType = <MetricsType>METRICSTYPE_DEMOGRAPHICS;
            break;
          case METRICSTYPE_TRAFFICSOURCES:
            routerParams.metricsType = <MetricsType>METRICSTYPE_TRAFFICSOURCES;
            break;
        }
      }
      if (params['group']) {
        routerParams.group = params['group'];
      }
      if (params['filter']) {
        routerParams.filter = params['filter'];
      }
      if (params['chartType']) {
        routerParams.chartType = params['chartType'];
      }
      if (params['interval']) {
        routerParams.interval = IntervalList.find(i => i.key === params['interval']);
      }
      if (params['episodePage'] && !isNaN(parseInt(params['episodePage'], 10))) {
        routerParams.episodePage = +params['episodePage'];
      }

      if (params['beginDate']) {
        routerParams.beginDate = new Date(params['beginDate']);
      }
      if (params['endDate']) {
        routerParams.endDate = new Date(params['endDate']);
        // Hmmm... params from the RouterStateSnanshot have date strings without milliseconds even though they're in the url
        // For our purposes, end date is 999 milliseconds, so... add it I guess
        // This could get weird for hourly data if we ever bring back time pickers
        routerParams.endDate.setMilliseconds(999);
      }
      if (routerParams.beginDate && routerParams.endDate && params['standardRange']) {
        const range = getBeginEndDateFromStandardRange(params['standardRange']);
        if (range && (range.beginDate.valueOf() !== routerParams.beginDate.valueOf() ||
          range.endDate.valueOf() !== routerParams.endDate.valueOf())) {
          // route has standard range that does not match begin/end dates
          routerParams.standardRange = getStandardRangeForBeginEndDate(routerParams.beginDate, routerParams.endDate);
        } else {
          // standardRange matches begin/end dates
          routerParams.standardRange = params['standardRange'];
        }
      } else if (routerParams.beginDate && routerParams.endDate && !params['standardRange']) {
        // missing standard range, so set it from begin/end date
        routerParams.standardRange = getStandardRangeForBeginEndDate(routerParams.beginDate, routerParams.endDate);
      } else if (params['standardRange']) {
        // missing begin and/or end dates, so set from standardRange
        routerParams.standardRange = params['standardRange'];
        const { beginDate, endDate } = getBeginEndDateFromStandardRange(routerParams.standardRange);
        routerParams.beginDate = beginDate;
        routerParams.endDate = endDate;
      }
    }
    return routerParams;
  }
}
