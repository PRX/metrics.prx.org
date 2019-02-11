import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import { RootState, reducers } from '../';
import { ChartType, CHARTTYPE_STACKED, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES, EPISODE_PAGE_SIZE } from '../models';
import { getTotal } from '../../../shared/util/chart.util';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import { routerParams,  podcast, episodes,
  podDownloads, ep0Downloads, ep1Downloads } from '../../../../testing/downloads.fixtures';
import * as ACTIONS from '../../actions';
import { selectDownloadChartMetrics } from './downloads-chart.selectors';

describe('Downloads Chart Selectors', () => {
  let store: Store<RootState>;

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
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      }));
      store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[0].podcastId, page: episodes[0].page, guid: episodes[0].guid, downloads: ep0Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[1].podcastId, page: episodes[1].page, guid: episodes[1].guid, downloads: ep1Downloads}));
      store.dispatch(new ACTIONS.CastlePodcastDownloadsSuccessAction({id: podcast.id, downloads: podDownloads}));

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

    it('should only include charted episodes', () => {
      expect(result.length).toEqual(3);
      store.dispatch(new ACTIONS.ChartToggleEpisodeAction({guid: episodes[0].guid, charted: false}));
      expect(result.length).toEqual(2);
    });

    it('should only include podcast if charted', () => {
      expect(result.length).toEqual(3);
      store.dispatch(new ACTIONS.ChartTogglePodcastAction({id: podcast.id, charted: false}));
      expect(result.length).toEqual(2);
    });

    it('should sort episode chart data by total biggest to smallest', () => {
      expect(getTotal(result[0].data)).toBeGreaterThanOrEqual(getTotal(result[1].data));
    });

    it('should only show podcast data if not the same number of episode downloads datapoints', () => {
      debugger;
      store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[1].podcastId, page: episodes[1].page, guid: episodes[1].guid, downloads: ep1Downloads.slice(1)}));
      expect(result.length).toEqual(1);
      expect(result[0].label).toEqual('All Episodes');
    });
  });

  describe('single line podcast chart', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, chartType: <ChartType>CHARTTYPE_PODCAST}}));
      store.dispatch(new ACTIONS.CastlePodcastDownloadsSuccessAction({id: podcast.id, downloads: podDownloads}));

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

    it('should include podcast regardless of whether or not it is set to charted', () => {
      store.dispatch(new ACTIONS.ChartTogglePodcastAction({id: podcast.id, charted: false}));
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
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      }));
      store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[0].podcastId, page: episodes[0].page, guid: episodes[0].guid, downloads: ep0Downloads}));
      store.dispatch(new ACTIONS.CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[1].podcastId, page: episodes[1].page, guid: episodes[1].guid, downloads: ep1Downloads}));

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

    it('should only include charted episodes', () => {
      expect(result.length).toEqual(episodes.length);
      store.dispatch(new ACTIONS.ChartToggleEpisodeAction({guid: episodes[0].guid, charted: false}));
      expect(result.length).toEqual(episodes.length - 1);
    });

    it('should add first part of guid string to non unique episode titles', () => {
      store.dispatch(new ACTIONS.CastleEpisodePageSuccessAction({
        episodes: [
          episodes[0],
          {...episodes[1], title: episodes[0].title}
        ],
        page: 1,
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      }));

      expect(result[0].label.indexOf(episodes[0].guid.split('-')[0].substr(0, 10))).toBeGreaterThan(-1);
    });
  });

});
