import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators';

import * as fromExport from './export.selectors';
import { RootState, reducers } from '..';
import { METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, METRICSTYPE_DEMOGRAPHICS,
  GROUPTYPE_AGENTNAME, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOSUBDIV, GROUPTYPE_GEOMETRO,
  INTERVAL_DAILY,
  CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, CHARTTYPE_STACKED, CHARTTYPE_GEOCHART, CHARTTYPE_HORIZBAR, CHARTTYPE_LINE } from '../models';
import * as dispatchHelper from '../../../../testing/dispatch.helpers';
import * as fixtures from '../../../../testing/downloads.fixtures';

describe('Export Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);
  });

  describe('Downloads exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store,
        {...fixtures.routerParams, chartType: CHARTTYPE_STACKED, metricsType: METRICSTYPE_DOWNLOADS});
      dispatchHelper.dispatchPodcasts(store);
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchPodcastDownloads(store);
      dispatchHelper.dispatchEpisodeDownloads(store);
    });

    it('should have download exports', () => {
      dispatchHelper.dispatchRouterNavigation(store, {chartType: CHARTTYPE_PODCAST});
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(1);
        expect(exportData[0].label).toEqual('All Episodes');
      });

      dispatchHelper.dispatchRouterNavigation(store, {chartType: CHARTTYPE_EPISODES});
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length);
        expect(exportData[0].label).toEqual(fixtures.episodes[0].title);
      });

      dispatchHelper.dispatchRouterNavigation(store, {chartType: CHARTTYPE_STACKED});
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length + 1);
        expect(exportData[1].label).toEqual(fixtures.episodes[0].title);
        expect(exportData[0].label).toEqual('All Episodes');
      });
    });

    it('chart toggle should filter podcast/episode data from export', () => {
      dispatchHelper.dispatchPodcastDownloadsChartToggle(store);
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length);
        expect(exportData[0].label).toEqual(fixtures.episodes[0].title);
      });

      dispatchHelper.dispatchEpisodeDownloadsChartToggle(store, fixtures.episodes[0].guid);
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length - 1);
        expect(exportData[0].label).toEqual(fixtures.episodes[1].title);
      });
    });

    it('selected episodes should filter episode data from export', () => {
      dispatchHelper.dispatchSelectEpisodes(store, [fixtures.episodes[1].guid]);
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(1);
        expect(exportData[0].label).toEqual(fixtures.episodes[1].title);
      });
    });

    it('should have filename', () => {
      store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
        expect(filename).toContain('downloads');
      });
    });
  });

  describe('Demographics exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchPodcasts(store);
      dispatchHelper.dispatchEpisodeSelectList(store);
      dispatchHelper.dispatchPodcastRanks(store);
      dispatchHelper.dispatchPodcastTotals(store);
    });

    it('should have podcast geo exports totals data', () => {
      dispatchHelper.dispatchRouterNavigation(store,
        {...fixtures.routerParams, metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, chartType: CHARTTYPE_GEOCHART});

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks)).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoCountryRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
      });
    });

    it('should have podcast geo exports interval data', () => {
      dispatchHelper.dispatchRouterNavigation(store,
        {...fixtures.routerParams, metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, chartType: CHARTTYPE_STACKED});

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks)).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoCountryRanks.length);
        expect(exportData[0].data.length).toEqual(fixtures.podcastGeoCountryDownloads.length);
      });
    });

    it('should have filename', () => {
      store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
        expect(filename).toContain('world');
      });
    });

    describe('Nested data', () => {
      beforeEach(() => {
        dispatchHelper.dispatchPodcastRanks(store,
          {group: GROUPTYPE_GEOSUBDIV, filter: 'US'}, fixtures.podcastGeoSubdivRanks, fixtures.podcastGeoSubdivDownloads);
        dispatchHelper.dispatchPodcastTotals(store, {group: GROUPTYPE_GEOSUBDIV, filter: 'US'}, fixtures.podcastGeoSubdivRanks);
      });

      it('should have nested podcast geo exports totals data', () => {
        dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, filter: 'US', chartType: CHARTTYPE_GEOCHART});

        store.pipe(select(fromExport.selectNestedPodcastExportRanks)).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.podcastGeoSubdivRanks.length);
          expect(exportData[0].total).toBeGreaterThan(0);
        });
      });

      it('should have nested podcast geo exports interval data', () => {
        dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, filter: 'US', chartType: CHARTTYPE_STACKED});

        store.pipe(select(fromExport.selectNestedPodcastExportRanks)).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.podcastGeoSubdivRanks.length);
          expect(exportData[0].data.length).toEqual(fixtures.podcastGeoSubdivDownloads.length);
        });
      });

      it('should have filename', () => {
        store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
          expect(filename).toContain('US');
        });
      });
    });

    describe('Selected Episodes', () => {
      beforeEach(() => {
        dispatchHelper.dispatchSelectEpisodes(store, [fixtures.episodes[0].guid]);
        dispatchHelper.dispatchEpisodeRanks(store,
          {group: GROUPTYPE_GEOMETRO, interval: INTERVAL_DAILY},
          fixtures.episodes[0].guid, fixtures.ep0GeoMetroRanks, fixtures.ep0GeoMetroDownloads);
        dispatchHelper.dispatchEpisodeTotals(store,
          {group: GROUPTYPE_GEOMETRO},
          fixtures.episodes[0].guid, fixtures.ep0GeoMetroRanks);
      });

      it('should have episode geo exports totals data', () => {
        dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOMETRO, interval: INTERVAL_DAILY, chartType: CHARTTYPE_GEOCHART});

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks)).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0GeoMetroRanks.length);
          expect(exportData[0].total).toBeGreaterThan(0);
        });
      });

      it('should have episode geo exports interval data', () => {
        dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOMETRO, interval: INTERVAL_DAILY, chartType: CHARTTYPE_LINE});

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks)).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0GeoMetroRanks.length);
          expect(exportData[0].data.length).toEqual(fixtures.ep0GeoMetroDownloads.length);
        });
      });
    });
  });

  describe('Devices exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchPodcastRanks(store,
        {group: GROUPTYPE_AGENTNAME}, fixtures.podcastAgentNameRanks, fixtures.podcastAgentNameDownloads);
      dispatchHelper.dispatchPodcastTotals(store, {group: GROUPTYPE_AGENTNAME}, fixtures.podcastAgentNameRanks);
    });

    it('should have podcast agent name exports totals data', () => {
      dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME, chartType: CHARTTYPE_HORIZBAR});

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks)).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastAgentNameRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
      });
    });

    it('should have podcast agent name exports interval data', () => {
      dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME, chartType: CHARTTYPE_STACKED});

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks)).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastAgentNameRanks.length);
        expect(exportData[0].data.length).toEqual(fixtures.podcastAgentNameDownloads.length);
      });
    });

    it('should have filename', () => {
      store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
        expect(filename).toContain(GROUPTYPE_AGENTNAME);
      });
    });

    describe('Selected Episodes', () => {
      beforeEach(() => {
        dispatchHelper.dispatchSelectEpisodes(store, [fixtures.episodes[0].guid]);
        dispatchHelper.dispatchEpisodeRanks(store,
          {group: GROUPTYPE_AGENTNAME, interval: INTERVAL_DAILY},
          fixtures.episodes[0].guid, fixtures.ep0AgentNameRanks, fixtures.ep0AgentNameDownloads);
        dispatchHelper.dispatchEpisodeTotals(store,
          {group: GROUPTYPE_AGENTNAME},
          fixtures.episodes[0].guid, fixtures.ep0AgentNameRanks);
      });

      it('should have episode agent name exports totals data', () => {
        dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
          metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME, interval: INTERVAL_DAILY, chartType: CHARTTYPE_HORIZBAR});

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks)).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0AgentNameRanks.length);
          expect(exportData[0].total).toBeGreaterThan(0);
        });
      });

      it('should have episode agent name exports interval data', () => {
        dispatchHelper.dispatchRouterNavigation(store,
          {metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME, interval: INTERVAL_DAILY, chartType: CHARTTYPE_LINE});

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks)).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0AgentNameRanks.length);
          expect(exportData[0].data.length).toEqual(fixtures.ep0AgentNameDownloads.length);
        });
      });
    });

    it('chart toggle should filter data from export', () => {
      dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME, chartType: CHARTTYPE_STACKED});
      dispatchHelper.dispatchGroupChartToggle(store, GROUPTYPE_AGENTNAME, 'Unknown');

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks)).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastAgentNameRanks.length - 1);
        expect(exportData[0].data.length).toEqual(fixtures.podcastAgentNameDownloads.length);
      });
    });
  });

  describe('Routed Export Data', () => {
    beforeEach(() => {
      dispatchHelper.dispatchPodcasts(store);
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchPodcastDownloads(store);
      dispatchHelper.dispatchEpisodeDownloads(store);
      dispatchHelper.dispatchEpisodeSelectList(store);
      dispatchHelper.dispatchPodcastRanks(store);
      dispatchHelper.dispatchPodcastTotals(store);
      dispatchHelper.dispatchPodcastRanks(store,
        {group: GROUPTYPE_GEOSUBDIV, filter: 'US'}, fixtures.podcastGeoSubdivRanks, fixtures.podcastGeoSubdivDownloads);
      dispatchHelper.dispatchPodcastTotals(store, {group: GROUPTYPE_GEOSUBDIV, filter: 'US'}, fixtures.podcastGeoSubdivRanks);
      dispatchHelper.dispatchEpisodeRanks(store,
        {group: GROUPTYPE_GEOMETRO, interval: INTERVAL_DAILY},
        fixtures.episodes[0].guid, fixtures.ep0GeoMetroRanks, fixtures.ep0GeoMetroDownloads);
      dispatchHelper.dispatchEpisodeTotals(store,
        {group: GROUPTYPE_GEOMETRO},
        fixtures.episodes[0].guid, fixtures.ep0GeoMetroRanks);
    });

    it('should get export data according to router and selected episode state', () => {
      dispatchHelper.dispatchRouterNavigation(store,
        {...fixtures.routerParams, chartType: CHARTTYPE_STACKED, metricsType: METRICSTYPE_DOWNLOADS});
      store.pipe(select(fromExport.selectExportData), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length + 1);
        expect(exportData[1].label).toEqual(fixtures.episodes[0].title);
        expect(exportData[0].label).toEqual('All Episodes');
      });

      dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, chartType: CHARTTYPE_GEOCHART});
      store.pipe(select(fromExport.selectExportData), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoCountryRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
      });

      dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, filter: 'US', chartType: CHARTTYPE_GEOCHART});
      store.pipe(select(fromExport.selectExportData), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoSubdivRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
      });

      dispatchHelper.dispatchRouterNavigation(store, {...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOMETRO, chartType: CHARTTYPE_STACKED});
      dispatchHelper.dispatchSelectEpisodes(store, [fixtures.episodes[0].guid]);
      store.pipe(select(fromExport.selectExportData)).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.ep0GeoMetroRanks.length);
        expect(exportData[0].data.length).toEqual(fixtures.ep0GeoMetroDownloads.length);
      });
    });
  });

});
