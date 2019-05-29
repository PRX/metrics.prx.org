import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import * as fromEpisodeRanks from './episode-ranks.selectors';
import { RootState, reducers } from '..';
import { EpisodeRanks, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, GROUPTYPE_GEOSUBDIV } from '../models';
import * as ACTIONS from '../../actions';
import { routerParams, episodes, ep0AgentNameRanks, ep0AgentNameDownloads } from '../../../../testing/downloads.fixtures';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';

describe('Episode Ranks Selectors', () => {
  let store: Store<RootState>;
  const { interval, beginDate, endDate } = routerParams,
    metricsType = METRICSTYPE_TRAFFICSOURCES,
    group = GROUPTYPE_AGENTNAME,
    filter = 'US';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);

    store.dispatch(new ACTIONS.EpisodeSelectEpisodesAction({
      podcastId: routerParams.podcastId,
      metricsType: METRICSTYPE_TRAFFICSOURCES,
      episodeGuids: episodes.map(e => e.guid)
    }));
    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, metricsType, group, filter}}));
  });

  function load() {
    store.dispatch(new ACTIONS.CastleEpisodeRanksLoadAction({guid: episodes[0].guid, group, interval, beginDate, endDate}));
    store.dispatch(new ACTIONS.CastleEpisodeRanksLoadAction({guid: episodes[0].guid,
      group: GROUPTYPE_GEOSUBDIV, filter, interval, beginDate, endDate}));
  }
  function success() {
    store.dispatch(new ACTIONS.CastleEpisodeRanksSuccessAction({
      guid: episodes[0].guid, group, interval, beginDate, endDate,
      ranks: ep0AgentNameRanks, downloads: ep0AgentNameDownloads}));
    store.dispatch(new ACTIONS.CastleEpisodeRanksSuccessAction({
      guid: episodes[0].guid, group: GROUPTYPE_GEOSUBDIV, filter, interval, beginDate, endDate,
      ranks: ep0AgentNameRanks, downloads: ep0AgentNameDownloads}));
  }
  function failure() {
    store.dispatch(new ACTIONS.CastleEpisodeRanksFailureAction({
      guid: episodes[0].guid, group, interval, beginDate, endDate,
      error: 'something went wrong'}));
  }

  it('should have loading status true if some episode ranks are loading', () => {
    load();
    store.pipe(select(fromEpisodeRanks.selectAllEpisodeRanksLoading)).subscribe((loading: boolean) => {
      expect(loading).toBeTruthy();
    });
    store.pipe(select(fromEpisodeRanks.selectSelectedEpisodesRanksLoading)).subscribe((loading: boolean) => {
      expect(loading).toBeTruthy();
    });
    store.pipe(select(fromEpisodeRanks.selectNestedEpisodesRanksLoading)).subscribe((loading: boolean) => {
      expect(loading).toBeTruthy();
    });
  });

  it('should have loaded status true if all episode ranks are loaded', () => {
    load();
    success();
    store.pipe(select(fromEpisodeRanks.selectAllEpisodeRanksLoaded)).subscribe((loaded: boolean) => {
      expect(loaded).toBeTruthy();
    });
    store.pipe(select(fromEpisodeRanks.selectSelectedEpisodesRanksLoaded)).subscribe((loaded: boolean) => {
      expect(loaded).toBeTruthy();
    });
    store.pipe(select(fromEpisodeRanks.selectNestedEpisodesRanksLoaded)).subscribe((loaded: boolean) => {
      expect(loaded).toBeTruthy();
    });
  });

  it('should have error if faulure occurs', () => {
    load();
    failure();
    store.pipe(select(fromEpisodeRanks.selectAllEpisodeRanksErrors)).subscribe((errors: any[]) => {
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('should have selected episode ranks', () => {
    load();
    success();
    store.pipe(select(fromEpisodeRanks.selectSelectedEpisodesRanks)).subscribe((ranks: EpisodeRanks[]) => {
      expect(ranks.length).toBeGreaterThan(0);
    });
  });

  it('should have nested data selected episode ranks', () => {
    load();
    success();
    store.pipe(select(fromEpisodeRanks.selectNestedEpisodesRanks)).subscribe((ranks: EpisodeRanks[]) => {
      expect(ranks.length).toBeGreaterThan(0);
    });
  });

  it('should have selected episode chart metrics', () => {
    load();
    success();
    store.pipe(select(fromEpisodeRanks.selectSelectedEpisodeRanksChartMetrics)).subscribe((metrics: TimeseriesChartModel[]) => {
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  it('should have nested data selected episode chart metrics', () => {
    load();
    success();
    store.pipe(select(fromEpisodeRanks.selectNestedEpisodesRanksChartMetrics)).subscribe((metrics: TimeseriesChartModel[]) => {
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  it('should have selected episode total downloads', () => {
    load();
    success();
    store.pipe(select(fromEpisodeRanks.selectSelectedEpisodesRanksTotalDownloads)).subscribe((total: number) => {
      expect(total).toBeGreaterThan(0);
    });
  });

});
