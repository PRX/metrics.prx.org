import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators';

import * as fromExport from './export.selectors';
import { RootState, reducers } from '..';
import {
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_DROPDAY,
  METRICSTYPE_TRAFFICSOURCES,
  METRICSTYPE_DEMOGRAPHICS,
  GROUPTYPE_AGENTNAME,
  GROUPTYPE_GEOCOUNTRY,
  GROUPTYPE_GEOSUBDIV,
  GROUPTYPE_GEOMETRO,
  INTERVAL_DAILY,
  CHARTTYPE_PODCAST,
  CHARTTYPE_EPISODES,
  CHARTTYPE_STACKED,
  CHARTTYPE_GEOCHART,
  CHARTTYPE_HORIZBAR,
  CHARTTYPE_LINE,
  METRICSTYPE_LISTENERS,
  INTERVAL_LASTWEEK
} from '../models';
import * as dispatchHelper from '@testing/dispatch.helpers';
import * as fixtures from '@testing/downloads.fixtures';
import { getTotal } from '@app/shared/util/metrics.util';

describe('Export Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)]
    });
    store = TestBed.inject(Store);
  });

  describe('Downloads exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        chartType: CHARTTYPE_STACKED,
        metricsType: METRICSTYPE_DOWNLOADS
      });
      dispatchHelper.dispatchPodcasts(store);
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchPodcastDownloads(store);
      dispatchHelper.dispatchEpisodeDownloads(store);
    });

    it('should have podcast download exports', done => {
      dispatchHelper.dispatchRouterNavigation(store, { chartType: CHARTTYPE_PODCAST });
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(1);
        expect(exportData[0].label).toEqual('All Episodes');
        done();
      });
    });

    it('should have episode download exports', done => {
      dispatchHelper.dispatchRouterNavigation(store, { chartType: CHARTTYPE_EPISODES });
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length);
        expect(exportData[0].label).toEqual(fixtures.episodes[0].title);
        done();
      });
    });

    it('should have stacked download exports', done => {
      dispatchHelper.dispatchRouterNavigation(store, { chartType: CHARTTYPE_STACKED });
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length + 1);
        expect(exportData[1].label).toEqual(fixtures.episodes[0].title);
        expect(exportData[0].label).toEqual('All Episodes');
        done();
      });
    });

    it('chart toggle should filter podcast data from export', done => {
      dispatchHelper.dispatchPodcastDownloadsChartToggle(store);
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length);
        expect(exportData[0].label).toEqual(fixtures.episodes[0].title);
        done();
      });
    });

    it('chart toggle should filter episode data from export', done => {
      dispatchHelper.dispatchRouterNavigation(store, { chartType: CHARTTYPE_EPISODES });
      dispatchHelper.dispatchEpisodeDownloadsChartToggle(store, fixtures.episodes[0].podcastId, fixtures.episodes[0].guid);
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length - 1);
        expect(exportData[0].label).toEqual(fixtures.episodes[1].title);
        done();
      });
    });

    it('selected episodes should filter episode data from export', done => {
      dispatchHelper.dispatchRouterNavigation(store, { chartType: CHARTTYPE_EPISODES });
      dispatchHelper.dispatchSelectEpisodes(store, fixtures.routerParams.podcastId, fixtures.routerParams.metricsType, [
        fixtures.episodes[1].guid
      ]);
      store.pipe(select(fromExport.selectExportDownloads), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(1);
        expect(exportData[0].label).toEqual(fixtures.episodes[1].title);
        done();
      });
    });

    it('should have filename', done => {
      store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
        expect(filename).toContain('downloads');
        done();
      });
    });
  });

  describe('Dropday exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchPodcasts(store);
      dispatchHelper.dispatchEpisodeSelectList(store);
      dispatchHelper.dispatchSelectEpisodes(
        store,
        fixtures.routerParams.podcastId,
        METRICSTYPE_DROPDAY,
        fixtures.episodes.map(e => e.guid)
      );
      dispatchHelper.dispatchEpisodeDropday(store);
    });

    it('should have cumulative dropday exports', done => {
      dispatchHelper.dispatchRouterNavigation(store, { chartType: CHARTTYPE_EPISODES });
      store.pipe(select(fromExport.selectExportDropday), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length);
        expect(exportData[0].label).toEqual(fixtures.episodes[0].title);
        expect(exportData[0].data[0][1]).toEqual(fixtures.ep0Downloads[0][1]);
        expect(exportData[0].data[exportData[0].data.length - 1][1]).toEqual(getTotal(fixtures.ep0Downloads));
        done();
      });
    });

    it('should have filename', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_DROPDAY,
        chartType: CHARTTYPE_EPISODES
      });
      store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
        expect(filename).toContain('downloads');
        done();
      });
    });
  });

  describe('Listeners exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_LISTENERS,
        chartType: CHARTTYPE_LINE,
        interval: INTERVAL_LASTWEEK
      });
      dispatchHelper.dispatchPodcastListeners(store, fixtures.routerParams.podcastId, fixtures.podDownloads);
    });

    it('should have listeners exports', done => {
      store.pipe(select(fromExport.selectExportListeners), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(1);
        expect(exportData[0].label).toEqual('Unique Listeners');
        done();
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

    it('should have podcast geo exports totals data', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_GEOCOUNTRY,
        chartType: CHARTTYPE_GEOCHART
      });

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoCountryRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
        done();
      });
    });

    it('should have podcast geo exports interval data', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_GEOCOUNTRY,
        chartType: CHARTTYPE_STACKED
      });

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoCountryRanks.length);
        expect(exportData[0].data.length).toEqual(fixtures.podcastGeoCountryDownloads.length);
        done();
      });
    });

    it('should have filename', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_GEOCOUNTRY,
        chartType: CHARTTYPE_STACKED
      });
      store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
        expect(filename).toContain('world');
        done();
      });
    });

    describe('Nested data', () => {
      beforeEach(() => {
        dispatchHelper.dispatchPodcastRanks(
          store,
          { group: GROUPTYPE_GEOSUBDIV, filter: 'US' },
          fixtures.podcastGeoSubdivRanks,
          fixtures.podcastGeoSubdivDownloads
        );
        dispatchHelper.dispatchPodcastTotals(store, { group: GROUPTYPE_GEOSUBDIV, filter: 'US' }, fixtures.podcastGeoSubdivRanks);
      });

      it('should have nested podcast geo exports totals data', done => {
        dispatchHelper.dispatchRouterNavigation(store, {
          ...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS,
          group: GROUPTYPE_GEOCOUNTRY,
          filter: 'US',
          chartType: CHARTTYPE_GEOCHART
        });

        store.pipe(select(fromExport.selectNestedPodcastExportRanks), first()).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.podcastGeoSubdivRanks.length);
          expect(exportData[0].total).toBeGreaterThan(0);
          done();
        });
      });

      it('should have nested podcast geo exports interval data', done => {
        dispatchHelper.dispatchRouterNavigation(store, {
          ...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS,
          group: GROUPTYPE_GEOCOUNTRY,
          filter: 'US',
          chartType: CHARTTYPE_STACKED
        });

        store.pipe(select(fromExport.selectNestedPodcastExportRanks), first()).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.podcastGeoSubdivRanks.length);
          expect(exportData[0].data.length).toEqual(fixtures.podcastGeoSubdivDownloads.length);
          done();
        });
      });

      it('should have filename', done => {
        dispatchHelper.dispatchRouterNavigation(store, {
          ...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS,
          group: GROUPTYPE_GEOCOUNTRY,
          filter: 'US',
          chartType: CHARTTYPE_STACKED
        });
        store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
          expect(filename).toContain('US');
          done();
        });
      });
    });

    describe('Selected Episodes', () => {
      beforeEach(() => {
        dispatchHelper.dispatchSelectEpisodes(store, fixtures.routerParams.podcastId, METRICSTYPE_DEMOGRAPHICS, [
          fixtures.episodes[0].guid
        ]);
        dispatchHelper.dispatchEpisodeRanks(
          store,
          { group: GROUPTYPE_GEOMETRO, interval: INTERVAL_DAILY },
          fixtures.episodes[0].guid,
          fixtures.ep0GeoMetroRanks,
          fixtures.ep0GeoMetroDownloads
        );
        dispatchHelper.dispatchEpisodeTotals(store, { group: GROUPTYPE_GEOMETRO }, fixtures.episodes[0].guid, fixtures.ep0GeoMetroRanks);
      });

      it('should have episode geo exports totals data', done => {
        dispatchHelper.dispatchRouterNavigation(store, {
          ...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS,
          group: GROUPTYPE_GEOMETRO,
          chartType: CHARTTYPE_GEOCHART
        });

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks), first()).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0GeoMetroRanks.length);
          expect(exportData[0].total).toBeGreaterThan(0);
          done();
        });
      });

      it('should have episode geo exports interval data', done => {
        dispatchHelper.dispatchRouterNavigation(store, {
          ...fixtures.routerParams,
          metricsType: METRICSTYPE_DEMOGRAPHICS,
          group: GROUPTYPE_GEOMETRO,
          chartType: CHARTTYPE_LINE
        });

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks), first()).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0GeoMetroRanks.length);
          expect(exportData[0].data.length).toEqual(fixtures.ep0GeoMetroDownloads.length);
          done();
        });
      });
    });
  });

  describe('Devices exports', () => {
    beforeEach(() => {
      dispatchHelper.dispatchPodcastRanks(
        store,
        { group: GROUPTYPE_AGENTNAME },
        fixtures.podcastAgentNameRanks,
        fixtures.podcastAgentNameDownloads
      );
      dispatchHelper.dispatchPodcastTotals(store, { group: GROUPTYPE_AGENTNAME }, fixtures.podcastAgentNameRanks);
    });

    it('should have podcast agent name exports totals data', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_AGENTNAME,
        chartType: CHARTTYPE_HORIZBAR
      });

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastAgentNameRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
        done();
      });
    });

    it('should have podcast agent name exports interval data', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_AGENTNAME,
        chartType: CHARTTYPE_STACKED
      });

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastAgentNameRanks.length);
        expect(exportData[0].data.length).toEqual(fixtures.podcastAgentNameDownloads.length);
        done();
      });
    });

    it('should have filename', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_AGENTNAME,
        chartType: CHARTTYPE_STACKED
      });

      store.pipe(select(fromExport.selectExportFilename), first()).subscribe(filename => {
        expect(filename).toContain(GROUPTYPE_AGENTNAME);
        done();
      });
    });

    describe('Selected Episodes', () => {
      beforeEach(() => {
        dispatchHelper.dispatchSelectEpisodes(store, fixtures.routerParams.podcastId, METRICSTYPE_TRAFFICSOURCES, [
          fixtures.episodes[0].guid
        ]);
        dispatchHelper.dispatchEpisodeRanks(
          store,
          { group: GROUPTYPE_AGENTNAME, interval: INTERVAL_DAILY },
          fixtures.episodes[0].guid,
          fixtures.ep0AgentNameRanks,
          fixtures.ep0AgentNameDownloads
        );
        dispatchHelper.dispatchEpisodeTotals(store, { group: GROUPTYPE_AGENTNAME }, fixtures.episodes[0].guid, fixtures.ep0AgentNameRanks);
      });

      it('should have episode agent name exports totals data', done => {
        dispatchHelper.dispatchRouterNavigation(store, {
          ...fixtures.routerParams,
          metricsType: METRICSTYPE_TRAFFICSOURCES,
          group: GROUPTYPE_AGENTNAME,
          interval: INTERVAL_DAILY,
          chartType: CHARTTYPE_HORIZBAR
        });

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks), first()).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0AgentNameRanks.length);
          expect(exportData[0].total).toBeGreaterThan(0);
          done();
        });
      });

      it('should have episode agent name exports interval data', done => {
        dispatchHelper.dispatchRouterNavigation(store, {
          metricsType: METRICSTYPE_TRAFFICSOURCES,
          group: GROUPTYPE_AGENTNAME,
          interval: INTERVAL_DAILY,
          chartType: CHARTTYPE_LINE
        });

        store.pipe(select(fromExport.selectSelectedEpisodeExportRanks), first()).subscribe(exportData => {
          expect(exportData.length).toEqual(fixtures.ep0AgentNameRanks.length);
          expect(exportData[0].data.length).toEqual(fixtures.ep0AgentNameDownloads.length);
          done();
        });
      });
    });

    it('chart toggle should filter data from export', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_TRAFFICSOURCES,
        group: GROUPTYPE_AGENTNAME,
        chartType: CHARTTYPE_STACKED
      });
      dispatchHelper.dispatchGroupChartToggle(store, GROUPTYPE_AGENTNAME, 'Unknown');

      store.pipe(select(fromExport.selectRoutedPodcastExportRanks), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastAgentNameRanks.length - 1);
        expect(exportData[0].data.length).toEqual(fixtures.podcastAgentNameDownloads.length);
        done();
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
      dispatchHelper.dispatchPodcastRanks(
        store,
        { group: GROUPTYPE_GEOSUBDIV, filter: 'US' },
        fixtures.podcastGeoSubdivRanks,
        fixtures.podcastGeoSubdivDownloads
      );
      dispatchHelper.dispatchPodcastTotals(store, { group: GROUPTYPE_GEOSUBDIV, filter: 'US' }, fixtures.podcastGeoSubdivRanks);
      dispatchHelper.dispatchEpisodeRanks(
        store,
        { group: GROUPTYPE_GEOMETRO, interval: INTERVAL_DAILY },
        fixtures.episodes[0].guid,
        fixtures.ep0GeoMetroRanks,
        fixtures.ep0GeoMetroDownloads
      );
      dispatchHelper.dispatchEpisodeTotals(store, { group: GROUPTYPE_GEOMETRO }, fixtures.episodes[0].guid, fixtures.ep0GeoMetroRanks);
    });

    it('should get export data for stacked downloads', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        chartType: CHARTTYPE_STACKED,
        metricsType: METRICSTYPE_DOWNLOADS
      });
      store.pipe(select(fromExport.selectExportData), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.episodes.length + 1);
        expect(exportData[1].label).toEqual(fixtures.episodes[0].title);
        expect(exportData[0].label).toEqual('All Episodes');
        done();
      });
    });

    it('should get export data for geocountry map', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_GEOCOUNTRY,
        chartType: CHARTTYPE_GEOCHART
      });
      store.pipe(select(fromExport.selectExportData), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoCountryRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
        done();
      });
    });

    it('should get export data for US map', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_GEOCOUNTRY,
        filter: 'US',
        chartType: CHARTTYPE_GEOCHART
      });
      store.pipe(select(fromExport.selectExportData), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.podcastGeoSubdivRanks.length);
        expect(exportData[0].total).toBeGreaterThan(0);
        done();
      });
    });

    it('should get export data for geometro selected episodes', done => {
      dispatchHelper.dispatchRouterNavigation(store, {
        ...fixtures.routerParams,
        metricsType: METRICSTYPE_DEMOGRAPHICS,
        group: GROUPTYPE_GEOMETRO,
        chartType: CHARTTYPE_STACKED
      });
      dispatchHelper.dispatchSelectEpisodes(store, fixtures.routerParams.podcastId, METRICSTYPE_DEMOGRAPHICS, [fixtures.episodes[0].guid]);
      store.pipe(select(fromExport.selectExportData), first()).subscribe(exportData => {
        expect(exportData.length).toEqual(fixtures.ep0GeoMetroRanks.length);
        expect(exportData[0].data.length).toEqual(fixtures.ep0GeoMetroDownloads.length);
        done();
      });
    });
  });
});
