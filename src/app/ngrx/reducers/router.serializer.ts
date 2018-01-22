import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { IntervalModel, IntervalList, ChartType,
  METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, MetricsType } from './models';

import { getBeginEndDateFromStandardRange, getStandardRangeForBeginEndDate } from '../../shared/util/date';

export interface RouterModel {
  metricsType?: MetricsType;
  podcastSeriesId?: number;
  page?: number;
  standardRange?: string;
  beginDate?: Date;
  endDate?: Date;
  interval?: IntervalModel;
  chartType?: ChartType;
  chartPodcast?: boolean;
  episodeIds?: number[];
}

export class CustomSerializer implements RouterStateSerializer<RouterModel> {
  serialize(routerState: RouterStateSnapshot): RouterModel {
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
        const metricsType = urlParts[2];
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
      }
      if (router.beginDate && router.endDate && params['standardRange']) {
        const range = getBeginEndDateFromStandardRange(params['standardRange']);
        if (range && (range.beginDate.valueOf() !== router.beginDate.valueOf() ||
          range.endDate.valueOf() !== router.endDate.valueOf())) {
          // route has standard range that does not match begin/end dates
          router.standardRange = getStandardRangeForBeginEndDate(router);
        } else {
          // standardRange matches being/end dates
          router.standardRange = params['standardRange'];
        }
      } else if (router.beginDate && router.endDate && !params['standardRange']) {
        // missing standard range, so set it from begin/end date
        router.standardRange = getStandardRangeForBeginEndDate(router);
      } else if (params['standardRange']) {
        // missing begin and/or end dates, so set from standardRange
        router.standardRange = params['standardRange'];
        const { beginDate, endDate } = getBeginEndDateFromStandardRange(router.standardRange);
        router.beginDate = beginDate;
        router.endDate = endDate;
      }
      if (params['episodes']) {
        router.episodeIds = params['episodes'].split(',').map(stringValue => +stringValue);
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
