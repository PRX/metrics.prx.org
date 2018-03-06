import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { RouterModel, IntervalList,
  METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, MetricsType } from './models';

import { getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate } from '../../shared/util/date/date.util';

// serialize the route snapshot to our RouterModel
export class CustomSerializer implements RouterStateSerializer<RouterModel> {
  serialize(routerState: RouterStateSnapshot | any): RouterModel {
    const router: RouterModel = {};
    const { url } = routerState;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    if (params && url.length > 1) {
      if (params['seriesId'] && !isNaN(parseInt(params['seriesId'], 10))) {
        router.podcastSeriesId = +params['seriesId'];
      }
      // metricsType is not a param because it differentiates the feature module routes
      const urlParts = url.split('/');
      if (urlParts.length >= 3 && urlParts[2]) {
        const metricsType = urlParts[2].split(';')[0];
        switch (metricsType) {
          case METRICSTYPE_DOWNLOADS:
            router.metricsType = <MetricsType>METRICSTYPE_DOWNLOADS;
            break;
          case METRICSTYPE_DEMOGRAPHICS:
            router.metricsType = <MetricsType>METRICSTYPE_DEMOGRAPHICS;
            break;
          case METRICSTYPE_TRAFFICSOURCES:
            router.metricsType = <MetricsType>METRICSTYPE_TRAFFICSOURCES;
            break;
        }
      }
      if (params['interval']) {
        router.interval = IntervalList.find(i => i.key === params['interval']);
      }
      if (params['chartType']) {
        router.chartType = params['chartType'];
      }
      if (params['beginDate']) {
        router.beginDate = new Date(params['beginDate']);
      }
      if (params['endDate']) {
        router.endDate = new Date(params['endDate']);
        // Hmmm... params from the RouterStateSnanshot have date strings without milliseconds even though they're in the url
        // For our purposes, end date is 999 milliseconds, so... add it I guess
        // This could get weird for hourly data if we ever bring back time pickers
        router.endDate.setMilliseconds(999);
      }
      if (router.beginDate && router.endDate && params['standardRange']) {
        const range = getBeginEndDateFromStandardRange(params['standardRange']);
        if (range && (range.beginDate.valueOf() !== router.beginDate.valueOf() ||
          range.endDate.valueOf() !== router.endDate.valueOf())) {
          // route has standard range that does not match begin/end dates
          router.standardRange = getStandardRangeForBeginEndDate(router.beginDate, router.endDate);
        } else {
          // standardRange matches begin/end dates
          router.standardRange = params['standardRange'];
        }
      } else if (router.beginDate && router.endDate && !params['standardRange']) {
        // missing standard range, so set it from begin/end date
        router.standardRange = getStandardRangeForBeginEndDate(router.beginDate, router.endDate);
      } else if (params['standardRange']) {
        // missing begin and/or end dates, so set from standardRange
        router.standardRange = params['standardRange'];
        const { beginDate, endDate } = getBeginEndDateFromStandardRange(router.standardRange);
        router.beginDate = beginDate;
        router.endDate = endDate;
      }
      if (params['episodes']) {
        router.episodeIds = params['episodes'].split(',').map(stringValue => +stringValue).filter(id => id > 0);
      } else if (params['episodes'] === '') {
        router.episodeIds = [];
      }
      if (params['page']) {
        router.page = +params['page'];
      }
      if (params['chartPodcast']) {
        router.chartPodcast = params['chartPodcast'] === 'true';
      }
    }
    return router;
  }
}
