import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import { RootState, reducers } from '../';
import { ChartType, CHARTTYPE_STACKED, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import { getTotal } from '../../../shared/util/chart.util';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as dispatchHelper from '../../../../testing/dispatch.helpers';
import { routerParams, episodes,
  podDownloads, ep0Downloads, ep1Downloads } from '../../../../testing/downloads.fixtures';
import * as ACTIONS from '../../actions';
import { episodeDownloadMetrics, selectDownloadChartMetrics } from './downloads-chart.selectors';

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

  it('should combine episodes with downloads and sort by published dates descending', () => {
    const downloadMetrics = episodeDownloadMetrics(episodes, [
      {
        id: episodes[0].guid,
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
        page: episodes[0].page,
        downloads: ep0Downloads,
        charted: true
      },
      {
        id: episodes[1].guid,
        podcastId: episodes[1].podcastId,
        guid: episodes[1].guid,
        page: episodes[1].page,
        downloads: ep1Downloads,
        charted: true
      }
    ]);
    expect(downloadMetrics.length).toEqual(2);
    expect(downloadMetrics[0].publishedAt.valueOf()).toBeGreaterThanOrEqual(downloadMetrics[1].publishedAt.valueOf());
  });

  describe('stacked podcast and episode chart', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {...routerParams, chartType: <ChartType>CHARTTYPE_STACKED});
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchEpisodeDownloads(store);
      dispatchHelper.dispatchPodcastDownloads(store);

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
      dispatchHelper.dispatchRouterNavigation(store, {...routerParams, podcastId: '75', episodePage: 2});
      expect(result).toBeUndefined();
    });

    it('should only include charted episodes', () => {
      expect(result.length).toEqual(3);
      dispatchHelper.dispatchEpisodeDownloadsChartToggle(store, episodes[0].guid);
      expect(result.length).toEqual(2);
    });

    it('should only include selected episodes if set', () => {
      expect(result.length).toEqual(3);
      dispatchHelper.dispatchSelectEpisodes(store, [episodes[0].guid]);
      expect(result.length).toEqual(2);
    });

    it('should only include podcast if charted', () => {
      expect(result.length).toEqual(3);
      dispatchHelper.dispatchPodcastDownloadsChartToggle(store);
      expect(result.length).toEqual(2);
    });

    it('should sort episode chart data by total biggest to smallest', () => {
      expect(getTotal(result[0].data)).toBeGreaterThanOrEqual(getTotal(result[1].data));
    });

    it('should only show podcast data if not the same number of episode downloads datapoints', () => {
      dispatchHelper.dispatchEpisodeDownloads(store, episodes[1].podcastId, episodes[1].page, episodes[1].guid, ep1Downloads.slice(1));
      expect(result.length).toEqual(1);
      expect(result[0].label).toEqual('All Episodes');
    });
  });

  describe('bar podcast chart', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {...routerParams, chartType: <ChartType>CHARTTYPE_PODCAST});
      dispatchHelper.dispatchPodcastDownloads(store);

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
      dispatchHelper.dispatchPodcastDownloadsChartToggle(store);
      expect(result).not.toBeUndefined();
      expect(result[0].label).toContain('All Episodes');
    });

    it('should not have data if podcast downloads not loaded', () => {
      dispatchHelper.dispatchRouterNavigation(store, {...routerParams, podcastId: '12345'});
      expect(result).toBeUndefined();
    });
  });

  describe('multi-line episode chart', () => {
    let result: TimeseriesChartModel[];

    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {...routerParams, chartType: <ChartType>CHARTTYPE_EPISODES});
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchEpisodeDownloads(store);

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

    it('should only include selected episodes if set', () => {
      expect(result.length).toEqual(episodes.length);
      store.dispatch(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: [episodes[0].guid]}));
      expect(result.length).toEqual(1);
    });

    it('should number non unique episode titles', () => {
      dispatchHelper.dispatchEpisodePage(store,
        [
          episodes[0],
          {...episodes[1], title: episodes[0].title}
        ]);

      expect(result[0].label.indexOf('(1) ')).toBeGreaterThan(-1);
    });
  });

});
