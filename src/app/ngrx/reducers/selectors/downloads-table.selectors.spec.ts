import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import { RootState, reducers } from '../';
import { DownloadsTableModel, getMetricsProperty } from '../models';
import { routerParams,  podcast, episodes,
  podDownloads, podAllTimeDownloads, podAllTimeDownloadsOff,
  ep0Downloads, ep1Downloads,
  ep0AllTimeDownloads, ep0AllTimeDownloadsOff, ep1AllTimeDownloads, ep1AllTimeDownloadsOff } from '../../../../testing/downloads.fixtures';
import * as ACTIONS from '../../actions';
import * as chartUtil from '../../../shared/util/chart.util';
import * as metricsUtil from '../../../shared/util/metrics.util';
import { selectDownloadTablePodcastDownloads, selectDownloadTableEpisodeMetrics } from './downloads-table.selectors';

describe('Downloads Table Selectors', () => {
  let store: Store<RootState>;
  let result;
  const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);

    jest.spyOn(store, 'dispatch');

    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
    store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
      episodes,
      page: 1,
      total: episodes.length
    }));
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      podcastId: episodes[0].podcastId, page: episodes[0].page, guid: episodes[0].guid,
      metricsPropertyName, metrics: ep0Downloads}));
    store.dispatch(new ACTIONS.CastleEpisodeMetricsSuccessAction({
      podcastId: episodes[1].podcastId, page: episodes[1].page, guid: episodes[1].guid,
      metricsPropertyName, metrics: ep1Downloads}));
    store.dispatch(new ACTIONS.CastlePodcastDownloadsSuccessAction({id: podcast.id, metricsPropertyName, metrics: podDownloads}));
    store.dispatch(new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({id: podcast.id, ...podAllTimeDownloads}));
    store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({
      podcastId: episodes[0].podcastId, guid: episodes[0].guid, ...ep0AllTimeDownloads}));
    store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({
      podcastId: episodes[1].podcastId, guid: episodes[1].guid, ...ep1AllTimeDownloads}));
  });

  describe('podcast download table metrics', () => {
    beforeEach(() => {
      store.pipe(select(selectDownloadTablePodcastDownloads)).subscribe((tableMetrics: DownloadsTableModel) => {
        result = tableMetrics;
      });
    });

    it('should transform data to downloads table model', () => {
      expect(result.title).toEqual('All Episodes');
    });

    it('should include podcast all time total downloads', () => {
      expect(result.allTimeDownloads).toEqual(podAllTimeDownloads.total);
    });

    it('should use total for range for all time if larger than all time total rollup', () => {
      store.dispatch(new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({id: podcast.id, ...podAllTimeDownloadsOff }));
      expect(result.allTimeDownloads).not.toEqual(podAllTimeDownloadsOff.total);
      expect(result.allTimeDownloads).toEqual(metricsUtil.getTotal(podDownloads));
    });

    it('should keep podcast in table for stacked chart when unselected for charting', () => {
      store.dispatch(new ACTIONS.ChartTogglePodcastAction({id: podcast.id, charted: false}));
      expect(result.allTimeDownloads).toEqual(podAllTimeDownloads.total);
    });
  });

  describe('episode download table metrics', () => {
    beforeEach(() => {
      store.pipe(select(selectDownloadTableEpisodeMetrics)).subscribe((tableMetrics: DownloadsTableModel[]) => {
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
        expect(e.totalForPeriod).toEqual(chartUtil.getTotal(e.downloads));
      });
    });

    it('should include episode all time total downloads', () => {
      expect(result[0].allTimeDownloads).toEqual(ep0AllTimeDownloads.total);
      expect(result[1].allTimeDownloads).toEqual(ep1AllTimeDownloads.total);
    });

    it('should use total for range for all time if larger than all time total rollup', () => {
      store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({
        podcastId: episodes[0].podcastId, guid: episodes[0].guid, ...ep0AllTimeDownloadsOff}));
      store.dispatch(new ACTIONS.CastleEpisodeAllTimeDownloadsSuccessAction({
        podcastId: episodes[1].podcastId, guid: episodes[1].guid, ...ep1AllTimeDownloadsOff}));
      expect(result[0].allTimeDownloads).not.toEqual(ep0AllTimeDownloadsOff.total);
      expect(result[0].allTimeDownloads).toEqual(metricsUtil.getTotal(ep0Downloads));
      expect(result[1].allTimeDownloads).not.toEqual(ep1AllTimeDownloadsOff.total);
      expect(result[1].allTimeDownloads).toEqual(metricsUtil.getTotal(ep1Downloads));
    });
  });

});
