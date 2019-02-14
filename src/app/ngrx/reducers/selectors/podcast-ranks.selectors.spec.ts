import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers, RootState } from '../';
import {
  ChartType, CHARTTYPE_STACKED, CHARTTYPE_HORIZBAR,
  GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOSUBDIV, GROUPTYPE_AGENTNAME,
  MetricsType, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES, GROUPTYPE_AGENTTYPE, CHARTTYPE_LINE
} from '../models';
import {
  podcastGeoCountryDownloads,
  podcastGeoCountryRanks,
  podcastGeoSubdivDownloads,
  podcastGeoSubdivRanks,
  podcastAgentNameDownloads,
  podcastAgentNameRanks,
  podcastAgentTypeDownloads,
  podcastAgentTypeRanks,
  routerParams
} from '../../../../testing/downloads.fixtures';
import * as dispatchHelper from '../../../../testing/dispatch.helpers';
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

  function dispatchRouteGeoCountry() {
    dispatchHelper.dispatchRouterNavigation(store, {
      ...routerParams,
      metricsType: METRICSTYPE_DEMOGRAPHICS,
      group: GROUPTYPE_GEOCOUNTRY,
      chartType: CHARTTYPE_STACKED
    });
  }

  function dispatchRouteGeoSubdiv() {
    dispatchHelper.dispatchRouterNavigation(store, {
      ...routerParams,
      metricsType: <MetricsType>METRICSTYPE_DEMOGRAPHICS,
      group: GROUPTYPE_GEOCOUNTRY,
      filter: 'US',
      chartType: CHARTTYPE_STACKED
    });
  }

  function dispatchRouteAgentName(chartType: ChartType) {
    dispatchHelper.dispatchRouterNavigation(store, {
      ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_AGENTNAME,
        chartType
    });
  }

  function dispatchRouteAgentType(chartType: ChartType) {
    dispatchHelper.dispatchRouterNavigation(store, {
      ...routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_AGENTTYPE,
        chartType
    });
  }

  function dispatchPodcastGeoCountryRanks() {
    dispatchHelper.dispatchPodcastRanks(store,
      {group: GROUPTYPE_GEOCOUNTRY},
      podcastGeoCountryRanks,
      podcastGeoCountryDownloads);
  }

  function dispatchPodcastNestedRanks() {
    dispatchHelper.dispatchPodcastRanks(store,
      {group: GROUPTYPE_GEOSUBDIV, filter: 'US'},
      podcastGeoSubdivRanks,
      podcastGeoSubdivDownloads);
  }

  function dispatchPodcastAgentNameRanks() {
    dispatchHelper.dispatchPodcastRanks(store,
      {group: GROUPTYPE_AGENTNAME},
      podcastAgentNameRanks,
      podcastAgentNameDownloads);
  }

  function dispatchPodcastAgentTypeRanks() {
    dispatchHelper.dispatchPodcastRanks(store,
      {group: GROUPTYPE_AGENTTYPE},
      podcastAgentTypeRanks,
      podcastAgentTypeDownloads);
  }

  function dispatchPodcastToggleGroupCharted(groupName: string) {
    dispatchHelper.dispatchGroupChartToggle(store, GROUPTYPE_AGENTTYPE, groupName);
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
