import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { RootState, reducers } from '../';
import { DownloadsTableModel, EPISODE_PAGE_SIZE, CHARTTYPE_STACKED, CHARTTYPE_PODCAST, CHARTTYPE_EPISODES } from '../models';
import {
  routerParams,
  podcast,
  episodes,
  podDownloads,
  podAllTimeDownloads,
  podAllTimeDownloadsOff,
  ep0Downloads,
  ep1Downloads,
  ep0AllTimeDownloads,
  ep0AllTimeDownloadsOff,
  ep1AllTimeDownloads,
  ep1AllTimeDownloadsOff
} from '@testing/downloads.fixtures';
import * as ACTIONS from '../../actions';
import * as metricsUtil from '@app/shared/util/metrics.util';
import * as dateUtil from '@app/shared/util/date/date.util';
import {
  selectDownloadTablePodcastDownloads,
  selectDownloadTableEpisodeMetrics,
  selectDownloadTableIntervalData
} from './downloads-table.selectors';

describe('Downloads Table Selectors', () => {
  let store: Store<RootState>;
  let result;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)]
    });
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');

    store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams }));
    store.dispatch(
      ACTIONS.CastleEpisodePageSuccess({
        episodes,
        page: 1,
        per: EPISODE_PAGE_SIZE,
        total: episodes.length
      })
    );
    store.dispatch(
      ACTIONS.CastleEpisodeDownloadsSuccess({
        podcastId: episodes[0].podcastId,
        page: episodes[0].page,
        guid: episodes[0].guid,
        downloads: ep0Downloads
      })
    );
    store.dispatch(
      ACTIONS.CastleEpisodeDownloadsSuccess({
        podcastId: episodes[1].podcastId,
        page: episodes[1].page,
        guid: episodes[1].guid,
        downloads: ep1Downloads
      })
    );
    store.dispatch(ACTIONS.CastlePodcastDownloadsSuccess({ id: podcast.id, downloads: podDownloads }));
    store.dispatch(ACTIONS.CastlePodcastAllTimeDownloadsSuccess({ id: podcast.id, ...podAllTimeDownloads }));
    store.dispatch(
      ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
        ...ep0AllTimeDownloads
      })
    );
    store.dispatch(
      ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
        podcastId: episodes[1].podcastId,
        guid: episodes[1].guid,
        ...ep1AllTimeDownloads
      })
    );
  });

  describe('podcast download table metrics', () => {
    let dataSub: Subscription;

    beforeEach(() => {
      dataSub = store.pipe(select(selectDownloadTablePodcastDownloads)).subscribe((tableMetrics: DownloadsTableModel) => {
        result = tableMetrics;
      });
    });

    afterEach(() => {
      dataSub.unsubscribe();
    });

    it('should transform data to downloads table model', () => {
      expect(result.title).toEqual('All Episodes');
    });

    it('should include podcast all time total downloads', () => {
      expect(result.allTimeDownloads).toEqual(podAllTimeDownloads.total);
    });

    it('should use total for range for all time if larger than all time total rollup', () => {
      store.dispatch(ACTIONS.CastlePodcastAllTimeDownloadsSuccess({ id: podcast.id, ...podAllTimeDownloadsOff }));
      expect(result.allTimeDownloads).not.toEqual(podAllTimeDownloadsOff.total);
      expect(result.allTimeDownloads).toEqual(metricsUtil.getTotal(podDownloads));
    });

    it('should keep podcast in table for stacked chart when unselected for charting', () => {
      store.dispatch(ACTIONS.ChartTogglePodcast({ id: podcast.id, charted: false }));
      expect(result.allTimeDownloads).toEqual(podAllTimeDownloads.total);
    });
  });

  describe('episode download table metrics', () => {
    let dataSub: Subscription;

    beforeEach(() => {
      dataSub = store.pipe(select(selectDownloadTableEpisodeMetrics)).subscribe((tableMetrics: DownloadsTableModel[]) => {
        result = tableMetrics;
      });
    });

    afterEach(() => {
      dataSub.unsubscribe();
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
      expect(result[0].totalForPeriod).toEqual(metricsUtil.getTotal(ep0Downloads));
      expect(result[1].totalForPeriod).toEqual(metricsUtil.getTotal(ep1Downloads));
    });

    it('should include episode all time total downloads', () => {
      expect(result[0].allTimeDownloads).toEqual(ep0AllTimeDownloads.total);
      expect(result[1].allTimeDownloads).toEqual(ep1AllTimeDownloads.total);
    });

    it('should use total for range for all time if larger than all time total rollup', () => {
      store.dispatch(
        ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
          podcastId: episodes[0].podcastId,
          guid: episodes[0].guid,
          ...ep0AllTimeDownloadsOff
        })
      );
      store.dispatch(
        ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
          podcastId: episodes[1].podcastId,
          guid: episodes[1].guid,
          ...ep1AllTimeDownloadsOff
        })
      );
      expect(result[0].allTimeDownloads).not.toEqual(ep0AllTimeDownloadsOff.total);
      expect(result[0].allTimeDownloads).toEqual(metricsUtil.getTotal(ep0Downloads));
      expect(result[1].allTimeDownloads).not.toEqual(ep1AllTimeDownloadsOff.total);
      expect(result[1].allTimeDownloads).toEqual(metricsUtil.getTotal(ep1Downloads));
    });

    describe('selected episodes download table metrics', () => {
      it('should not apply selected episodes filtering if none are selected', () => {
        store.dispatch(
          ACTIONS.EpisodeSelectEpisodes({
            podcastId: routerParams.podcastId,
            metricsType: routerParams.metricsType,
            episodeGuids: []
          })
        );
        expect(result.every(r => r.charted)).toBeTruthy();
      });

      it('should show selected episodes as charted', () => {
        store.dispatch(
          ACTIONS.EpisodeSelectEpisodes({
            podcastId: routerParams.podcastId,
            metricsType: routerParams.metricsType,
            episodeGuids: [episodes[0].guid]
          })
        );
        expect(result.filter(r => r.charted).length).toEqual(1);
      });
    });
  });

  describe('interval data', () => {
    let dataSub: Subscription;

    beforeEach(() => {
      dataSub = store.pipe(select(selectDownloadTableIntervalData)).subscribe((intervalData: any[][]) => {
        result = intervalData;
      });
    });

    afterEach(() => {
      dataSub.unsubscribe();
    });

    it('should have dates in header row', () => {
      store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, chartType: CHARTTYPE_STACKED } }));
      expect(result[0][0]).toEqual(dateUtil.formatDateForInterval(new Date(podDownloads[0][0]), routerParams.interval));
    });

    it('should have podcast data', () => {
      store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, chartType: CHARTTYPE_PODCAST } }));
      expect(result[1][0]).toEqual(podDownloads[0][1]);
    });

    it('should have episode data', () => {
      store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams: { ...routerParams, chartType: CHARTTYPE_EPISODES } }));
      expect(result[1][0]).toEqual(ep0Downloads[0][1]);
    });
  });
});
