import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import { RootState, reducers } from '../';
import { getMetricsProperty, ChartType,
  CHARTTYPE_STACKED, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { getTotal } from '../../../shared/util/chart.util';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { routerParams,  podcast, episodes,
  podDownloads, podPerformance,
  ep0Downloads, ep1Downloads, ep0Performance, ep1Performance } from '../../../../testing/downloads.fixtures';
import * as ACTIONS from '../../actions';
import { selectDownloadChartMetrics } from './downloads-chart.selectors';

describe('Downloads Chart Selectors', () => {
  let store: Store<RootState>;
  const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);
  });

  describe('stacked podcast and episode chart', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, chartType: <ChartType>CHARTTYPE_STACKED}}));
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
      store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({
        id: podcast.id, metricsPropertyName, metrics: podDownloads}));
      store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({id: podcast.id, ...podPerformance }));
      store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
        podcastId: episodes[0].podcastId, guid: episodes[0].guid, ...ep0Performance}));
      store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
        podcastId: episodes[1].podcastId, guid: episodes[1].guid, ...ep1Performance}));

      store.pipe(select(selectDownloadChartMetrics)).subscribe((data) => {
        result = data;
      });
    });

    it('should transform podcast and episode data download chart data model', () => {
      expect(result.length).toEqual(3);
      expect(result[0].label).toEqual(episodes[1].title); // (sorted by total, tested below)
      expect(result[0].data[0].value).toEqual(<number>ep1Downloads[0][1]);
      expect(result[1].label).toEqual(episodes[0].title);
      expect(result[1].data[0].value).toEqual(<number>ep0Downloads[0][1]);
      expect(result[2].label).toEqual('All Other Episodes');
      expect(result[2].data[0].date).toEqual(new Date(<string>podDownloads[0][0]).valueOf());
    });

    it('should subtract episode data from podcast data for chart display', () => {
      expect(result[2].data[0].value).toEqual(<number>podDownloads[0][1] - (<number>ep0Downloads[0][1] + <number>ep1Downloads[0][1]));
    });

    it('should only include episode metrics matching router state', () => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {podcastId: '75', episodePage: 2}}));
      expect(result).toBeUndefined();
    });

    // TODO: fix/keep charted episodes on route?
    xit('should only include charted episodes', () => {
      expect(result.length).toEqual(3);
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams}}));
      expect(result.length).toEqual(2);
    });

    // TODO
    xit('should only include podcast if charted', () => {
      expect(result.length).toEqual(3);
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams}}));
      expect(result.length).toEqual(2);
    });

    it('should sort episode chart data by total biggest to smallest', () => {
      expect(getTotal(result[0].data)).toBeGreaterThanOrEqual(getTotal(result[1].data));
    });
  });

  describe('single line podcast chart', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, chartType: <ChartType>CHARTTYPE_PODCAST}}));
      store.dispatch(new ACTIONS.CastlePodcastMetricsSuccessAction({id: podcast.id, metricsPropertyName, metrics: podDownloads}));
      store.dispatch(new ACTIONS.CastlePodcastPerformanceMetricsSuccessAction({id: podcast.id, ...podPerformance }));

      store.pipe(select(selectDownloadChartMetrics)).subscribe((data) => {
        result = data;
      });
    });

    it('should transform podcast data to chart model', () => {
      expect(result.length).toEqual(1);
      expect(result[0].label).toEqual('All Episodes');
      expect(result[0].data.length).toEqual(podDownloads.length);
    });

    it('should include podcast data as is for chart display', () => {
      expect(result[0].data[0].value).toEqual(<number>podDownloads[0][1]);
    });

    // TODO
    xit('should include podcast regardless of whether or not it is set to charted', () => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {}}));
      expect(result).not.toBeUndefined();
      expect(result[0].label).toContain('All Episodes');
    });
  });

  describe('multi-line episode chart', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, chartType: <ChartType>CHARTTYPE_EPISODES}}));
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
      store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
        podcastId: episodes[0].podcastId, guid: episodes[0].guid, ...ep0Performance}));
      store.dispatch(new ACTIONS.CastleEpisodePerformanceMetricsSuccessAction({
        podcastId: episodes[1].podcastId, guid: episodes[1].guid, ...ep1Performance}));

      store.pipe(select(selectDownloadChartMetrics)).subscribe((data) => {
        result = data;
      });
    });

    it('should transform episode data to chart model', () => {
      expect(result.length).toEqual(2);
      expect(result[0].label).toEqual(episodes[0].title);
      expect(result[1].label).toEqual(episodes[1].title);
    });

    it('should only include episode metrics matching router state', () => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {episodePage: 2}}));
      expect(result).toBeUndefined();
    });

    // TODO: fix/keep charted episodes on route?
    xit('should only include charted episodes', () => {
      expect(result.length).toEqual(2);
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {}}));
      expect(result.length).toEqual(1);
    });
  });

});
