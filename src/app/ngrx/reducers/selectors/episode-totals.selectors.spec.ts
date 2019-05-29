import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import * as fromEpisodeTotals from './episode-totals.selectors';
import { RootState, reducers } from '..';
import { EpisodeTotals, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, GROUPTYPE_GEOSUBDIV, TotalsTableRow } from '../models';
import * as ACTIONS from '../../actions';
import { routerParams, episodes, ep0AgentNameRanks } from '../../../../testing/downloads.fixtures';

describe('Episode Totals Selectors', () => {
  let store: Store<RootState>;
  const { beginDate, endDate } = routerParams,
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
    store.dispatch(new ACTIONS.CastleEpisodeTotalsLoadAction({guid: episodes[0].guid, group, beginDate, endDate}));
    store.dispatch(new ACTIONS.CastleEpisodeTotalsLoadAction({guid: episodes[0].guid,
      group: GROUPTYPE_GEOSUBDIV, filter, beginDate, endDate}));
  }
  function success() {
    store.dispatch(new ACTIONS.CastleEpisodeTotalsSuccessAction({
      guid: episodes[0].guid, group, beginDate, endDate, ranks: ep0AgentNameRanks}));
    store.dispatch(new ACTIONS.CastleEpisodeTotalsSuccessAction({
      guid: episodes[0].guid, group: GROUPTYPE_GEOSUBDIV, filter, beginDate, endDate, ranks: ep0AgentNameRanks}));
  }
  function failure() {
    store.dispatch(new ACTIONS.CastleEpisodeTotalsFailureAction({
      guid: episodes[0].guid, group, beginDate, endDate,
      error: 'something went wrong'}));
  }

  it('should have loading status true if some episode ranks are loading', () => {
    load();
    store.pipe(select(fromEpisodeTotals.selectAllEpisodeTotalsLoading)).subscribe((loading: boolean) => {
      expect(loading).toBeTruthy();
    });
    store.pipe(select(fromEpisodeTotals.selectSelectedEpisodesTotalsLoading)).subscribe((loading: boolean) => {
      expect(loading).toBeTruthy();
    });
    store.pipe(select(fromEpisodeTotals.selectNestedEpisodesTotalsLoading)).subscribe((loading: boolean) => {
      expect(loading).toBeTruthy();
    });
  });

  it('should have loaded status true if all episode ranks are loaded', () => {
    load();
    success();
    store.pipe(select(fromEpisodeTotals.selectAllEpisodeTotalsLoaded)).subscribe((loaded: boolean) => {
      expect(loaded).toBeTruthy();
    });
    store.pipe(select(fromEpisodeTotals.selectSelectedEpisodesTotalsLoaded)).subscribe((loaded: boolean) => {
      expect(loaded).toBeTruthy();
    });
    store.pipe(select(fromEpisodeTotals.selectNestedEpisodesTotalsLoaded)).subscribe((loaded: boolean) => {
      expect(loaded).toBeTruthy();
    });
  });

  it('should have error if faulure occurs', () => {
    load();
    failure();
    store.pipe(select(fromEpisodeTotals.selectAllEpisodeTotalsErrors)).subscribe((errors: any[]) => {
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('should have selected episode ranks', () => {
    load();
    success();
    store.pipe(select(fromEpisodeTotals.selectSelectedEpisodesTotals)).subscribe((totals: EpisodeTotals[]) => {
      expect(totals.length).toBeGreaterThan(0);
    });
  });

  it('should have nested data selected episode ranks', () => {
    load();
    success();
    store.pipe(select(fromEpisodeTotals.selectNestedEpisodesTotals)).subscribe((totals: EpisodeTotals[]) => {
      expect(totals.length).toBeGreaterThan(0);
    });
  });

  it('should have selected episode table metrics', () => {
    load();
    success();
    store.pipe(select(fromEpisodeTotals.selectSelectedEpisodesTotalsTableMetrics)).subscribe((metrics: TotalsTableRow[]) => {
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  it('should have nested data selected episode table metrics', () => {
    load();
    success();
    store.pipe(select(fromEpisodeTotals.selectNestedEpisodesTotalsTableMetrics)).subscribe((metrics: TotalsTableRow[]) => {
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  it('should have selected episode total downloads', () => {
    load();
    success();
    store.pipe(select(fromEpisodeTotals.selectSelectedEpisodesTotalsTotalDownloads)).subscribe((total: number) => {
      expect(total).toBeGreaterThan(0);
    });
  });

});
