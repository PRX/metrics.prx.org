import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';

import { RootState, reducers } from '../';
import { getMetricsProperty } from '../models';
import { routerState,  podcast, episodes,
  podDownloads, podPerformance,
  ep0Downloads, ep1Downloads, ep0Performance, ep1Performance } from '../../../../testing/downloads.fixtures';
import * as ACTIONS from '../../actions';
import { getTotal } from '../../../shared/util/chart.util';
import { DownloadsTableModel, selectDownloadTablePodcastMetrics, selectDownloadTableEpisodeMetrics } from './downloads-table.selectors';

describe('Downloads Table Selectors', () => {
  let store: Store<RootState>;
  let result;
  const metricsPropertyName = getMetricsProperty(routerState.interval, routerState.metricsType);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerState}));
    store.dispatch(new ACTIONS.CmsPodcastEpisodePageSuccessAction({episodes}));
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: episodes[0].seriesId, page: episodes[0].page, id: episodes[0].id, guid: episodes[0].guid,
      metricsPropertyName, metrics: ep0Downloads}));
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      seriesId: episodes[1].seriesId, page: episodes[1].page, id: episodes[1].id, guid: episodes[1].guid,
      metricsPropertyName, metrics: ep1Downloads}));
    store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
      seriesId: podcast.seriesId, feederId: podcast.feederId, metricsPropertyName, metrics: podDownloads}));
    store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({seriesId: podcast.seriesId, feederId: podcast.feederId,
      ...podPerformance }));
    store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: episodes[0].seriesId, id: episodes[0].id, guid: episodes[0].guid, ...ep0Performance}));
    store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
      seriesId: episodes[1].seriesId, id: episodes[1].id, guid: episodes[1].guid, ...ep1Performance}));
  });

  describe('podcast download table metrics', () => {
    beforeEach(() => {
      store.select(selectDownloadTablePodcastMetrics).subscribe((tableMetrics: DownloadsTableModel) => {
        result = tableMetrics;
      });
    });

    it('should transform data to downloads table model', () => {
      expect(result.title).toEqual('All Episodes');
    });

    it('should include podcast all time total downloads', () => {
      expect(result.allTimeDownloads).toEqual(podPerformance.total);
    });
  });

  describe('episode download table metrics', () => {
    beforeEach(() => {
      store.select(selectDownloadTableEpisodeMetrics).subscribe((tableMetrics: DownloadsTableModel[]) => {
        result = tableMetrics;
      });
    });

    it('should transform data to downloads table model', () => {
      expect(result.length).toEqual(2);
      expect(result[0].title).toEqual(episodes[0].title);
      expect(result[1].title).toEqual(episodes[1].title);
    });

    it('should sort episodes by published date', () => {
      expect(result[0].publishedAt.valueOf()).toBeGreaterThanOrEqual(result[1].publishedAt.valueOf());
    });

    it('should include episode total downloads for period', () => {
      result.forEach(e => {
        expect(e.totalForPeriod).toEqual(getTotal(e.downloads));
      });
    });

    it('should include episode all time total downloads', () => {
      expect(result[0].allTimeDownloads).toEqual(ep0Performance.total);
      expect(result[1].allTimeDownloads).toEqual(ep1Performance.total);
    });
  });

});