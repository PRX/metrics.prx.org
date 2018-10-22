import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, RootState } from '../';
import {
  ChartType, CHARTTYPE_STACKED, CHARTTYPE_HORIZBAR,
  GroupType, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOSUBDIV, GROUPTYPE_AGENTNAME,
  MetricsType, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES, GROUPTYPE_AGENTTYPE
} from '../models';
import * as ACTIONS from '../../actions';
import {
  podcastGeoCountryDownloads,
  podcastGeoCountryRanks,
  podcastGeoSubdivDownloads,
  podcastGeoSubdivRanks,
  podcastAgentNameDownloads,
  podcastAgentNameRanks,
  podcastAgentTypeDownloads,
  podcastAgentTypeRanks,
  routerParams as downloadParams
} from '../../../../testing/downloads.fixtures';
import { CategoryChartModel, TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as podcastRanks from './podcast-ranks.selectors';

describe('Podcast Ranks Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);
  });

  const routerParams = {
    ...downloadParams,
    metricsType: <MetricsType>METRICSTYPE_DEMOGRAPHICS,
    group: <GroupType>GROUPTYPE_GEOCOUNTRY,
    chartType: <ChartType>CHARTTYPE_STACKED
  };

  function dispatchRouteGeoCountry() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
  }

  function dispatchRouteGeoSubdiv() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, filter: 'US'}}));
  }

  function dispatchRouteAgentName() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {
      ...routerParams,
        metricsType: <MetricsType>METRICSTYPE_TRAFFICSOURCES,
        group: <GroupType>GROUPTYPE_AGENTNAME,
        chartType: <ChartType>CHARTTYPE_HORIZBAR
    }}));
  }

  function dispatchRouteAgentType() {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {
        ...routerParams,
        metricsType: <MetricsType>METRICSTYPE_TRAFFICSOURCES,
        group: <GroupType>GROUPTYPE_AGENTTYPE,
        chartType: <ChartType>CHARTTYPE_HORIZBAR
      }}));
  }

  function dispatchPodcastGeoCountryRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_GEOCOUNTRY,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastGeoCountryRanks,
      downloads: podcastGeoCountryDownloads
    }));
  }

  function dispatchPodcastNestedRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_GEOSUBDIV,
      interval: routerParams.interval,
      filter: 'US',
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastGeoSubdivRanks,
      downloads: podcastGeoSubdivDownloads
    }));
  }

  function dispatchPodcastAgentNameRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_AGENTNAME,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks,
      downloads: podcastAgentNameDownloads
    }));
  }

  function dispatchPodcastAgentTypeRanks() {
    store.dispatch(new ACTIONS.CastlePodcastRanksSuccessAction({
      id: routerParams.podcastId,
      group: GROUPTYPE_AGENTTYPE,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentTypeRanks,
      downloads: podcastAgentTypeDownloads
    }));
  }

  describe('geo podcast ranks', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      dispatchRouteGeoCountry();
      dispatchPodcastGeoCountryRanks();

      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <TimeseriesChartModel[]>data;
      });
    });

    it('should transform podcast ranks to timeseries chart model', () => {
      expect(result.length).toEqual(podcastGeoCountryRanks.length - 1);
      expect(result[0].label).toEqual(podcastGeoCountryRanks[0].label);
      expect(result[0].data[0].value).toEqual(<number>podcastGeoCountryDownloads[0][1][0]);
      expect(result[1].label).toEqual(podcastGeoCountryRanks[1].label);
      expect(result[1].data[0].value).toEqual(<number>podcastGeoCountryDownloads[0][1][1]);
    });

    it('should not include "Other" for geo data', () => {
      expect(result.length).toEqual(podcastGeoCountryRanks.length - 1);
      expect(result.find(r => r.label === 'Other')).toBeUndefined();
    });
  });

  describe('totals (horizontal bar) podcast ranks', () => {
    let result: CategoryChartModel[];

    it('should transform podcast ranks to category chart model', () => {
      dispatchRouteAgentName();
      dispatchPodcastAgentNameRanks();

      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <CategoryChartModel[]>data;
      });

      expect(result.length).toEqual(podcastAgentNameRanks.length);
      expect(result[0].label).toEqual(podcastAgentNameRanks[0].label);
      expect(result[0].value).toEqual(podcastAgentNameRanks[0].total);
      expect(result[1].label).toEqual(podcastAgentNameRanks[1].label);
      expect(result[1].value).toEqual(podcastAgentNameRanks[1].total);
    });

    it('should not include "Other" data if total value is zero', () => {
      dispatchRouteAgentType();
      dispatchPodcastAgentTypeRanks();

      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <CategoryChartModel[]>data;
      });

      expect(result.length).toEqual(podcastAgentTypeRanks.length - 1);
      expect(result.find(r => r.label === 'Other')).toBeUndefined();
    });
  });

  describe('nested podcast ranks', () => {

    let result: TimeseriesChartModel[];

    beforeEach(() => {
      dispatchRouteGeoSubdiv();
      dispatchPodcastNestedRanks();

      store.pipe(select(podcastRanks.selectNestedPodcastRanksChartMetrics)).subscribe((data) => {
        result = data;
      });
    });

    it('should transform nested podcast ranks to timeseries chart model', () => {
      expect(result.length).toEqual(podcastGeoSubdivRanks.length - 1);
      expect(result[0].label).toEqual(podcastGeoSubdivRanks[0].label);
      expect(result[0].data[0].value).toEqual(<number>podcastGeoSubdivDownloads[0][1][0]);
      expect(result[1].label).toEqual(podcastGeoSubdivRanks[1].label);
      expect(result[1].data[0].value).toEqual(<number>podcastGeoSubdivDownloads[0][1][1]);
    });

    it('should not include "Other" data', () => {
      expect(result.length).toEqual(podcastGeoSubdivRanks.length - 1);
      expect(result.find(r => r.label === 'Other')).toBeUndefined();
    });
  });
});
