import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, RootState } from '../';
import {
  ChartType, CHARTTYPE_STACKED, CHARTTYPE_HORIZBAR,
  GroupType, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOSUBDIV, GROUPTYPE_AGENTNAME,
  MetricsType, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES, GROUPTYPE_AGENTTYPE, CHARTTYPE_LINE
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

  function dispatchRouteAgentName(chartType) {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {
      ...routerParams,
        metricsType: <MetricsType>METRICSTYPE_TRAFFICSOURCES,
        group: <GroupType>GROUPTYPE_AGENTNAME,
        chartType
    }}));
  }

  function dispatchRouteAgentType(chartType) {
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {
        ...routerParams,
        metricsType: <MetricsType>METRICSTYPE_TRAFFICSOURCES,
        group: <GroupType>GROUPTYPE_AGENTTYPE,
        chartType
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

  function dispatchPodcastToggleGroupCharted(groupName: string) {
    store.dispatch(new ACTIONS.ChartToggleGroupAction({
      group: GROUPTYPE_AGENTTYPE,
      groupName,
      charted: false
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
    beforeEach(() => {
      dispatchPodcastAgentNameRanks();
      dispatchPodcastAgentTypeRanks();
      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <CategoryChartModel[]>data;
      });
    });

    it('should transform podcast ranks to category chart model', () => {
      dispatchRouteAgentName(CHARTTYPE_HORIZBAR);

      expect(result.length).toEqual(podcastAgentNameRanks.length);
      expect(result[0].label).toEqual(podcastAgentNameRanks[0].label);
      expect(result[0].value).toEqual(podcastAgentNameRanks[0].total);
      expect(result[1].label).toEqual(podcastAgentNameRanks[1].label);
      expect(result[1].value).toEqual(podcastAgentNameRanks[1].total);
    });

    it('should not include "Other" data if total value is zero', () => {
      dispatchRouteAgentType(CHARTTYPE_HORIZBAR);

      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <CategoryChartModel[]>data;
      });

      expect(result.length).toEqual(podcastAgentTypeRanks.length - 1);
      expect(result.find(r => r.label === 'Other')).toBeUndefined();
    });

    it('should filter by groups charted and assume groups are charted implicitly', () => {
      dispatchRouteAgentType(CHARTTYPE_HORIZBAR);

      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <CategoryChartModel[]>data;
      });

      expect(result.length).toEqual(podcastAgentTypeRanks.length - 1);
      dispatchPodcastToggleGroupCharted('Unknown');
      expect(result.length).toEqual(podcastAgentTypeRanks.length - 2);
      expect(result.find(r => r.label === 'Unknown')).toBeUndefined();
    });
  });

  describe('intervals (multiline/stacked) podcast ranks', () => {
    let result: TimeseriesChartModel[];
    beforeEach(() => {
      dispatchPodcastAgentTypeRanks();
      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <TimeseriesChartModel[]>data;
      });
    });

    it('should not include "Other" data if total value is zero', () => {
      dispatchRouteAgentType(CHARTTYPE_STACKED);

      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <TimeseriesChartModel[]>data;
      });

      expect(result.length).toEqual(podcastAgentTypeRanks.length - 1);
      expect(result.find(r => r.label === 'Other')).toBeUndefined();
    });

    it('should filter by groups charted and assume groups are charted implicitly', () => {
      dispatchRouteAgentType(CHARTTYPE_LINE);

      store.pipe(select(podcastRanks.selectRoutedPodcastRanksChartMetrics)).subscribe((data) => {
        result = <TimeseriesChartModel[]>data;
      });

      expect(result.length).toEqual(podcastAgentTypeRanks.length - 1);
      dispatchPodcastToggleGroupCharted('Unknown');
      expect(result.length).toEqual(podcastAgentTypeRanks.length - 2);
      expect(result.find(r => r.label === 'Unknown')).toBeUndefined();
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
