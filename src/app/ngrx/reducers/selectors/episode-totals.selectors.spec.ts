import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

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

  it('should have loading status true if some episode ranks are loading', done => {
    load();
    combineLatest(
      store.pipe(select(fromEpisodeTotals.selectAllEpisodeTotalsLoading)),
      store.pipe(select(fromEpisodeTotals.selectSelectedEpisodesTotalsLoading)),
      store.pipe(select(fromEpisodeTotals.selectNestedEpisodesTotalsLoading))
    ).subscribe(([allTotalsLoading, selectedTotalsLoading, nestedTotalsLoading]) => {
      expect(allTotalsLoading).toBeTruthy();
      expect(selectedTotalsLoading).toBeTruthy();
      expect(nestedTotalsLoading).toBeTruthy();
      done();
    });
  });

  it('should have loaded status true if all episode ranks are loaded', done => {
    load();
    success();
    combineLatest(
      store.pipe(select(fromEpisodeTotals.selectAllEpisodeTotalsLoaded)),
      store.pipe(select(fromEpisodeTotals.selectSelectedEpisodesTotalsLoaded)),
      store.pipe(select(fromEpisodeTotals.selectNestedEpisodesTotalsLoaded))
    ).subscribe(([allTotalsLoaded, selectedTotalsLoaded, nestedTotalsLoaded]) => {
      expect(allTotalsLoaded).toBeTruthy();
      expect(selectedTotalsLoaded).toBeTruthy();
      expect(nestedTotalsLoaded).toBeTruthy();
      done();
    });
  });

  it('should have error if faulure occurs', done => {
    load();
    failure();
    store.pipe(
      select(fromEpisodeTotals.selectAllEpisodeTotalsErrors),
      first()
    ).subscribe((errors: any[]) => {
      expect(errors.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have selected episode ranks', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeTotals.selectSelectedEpisodesTotals),
      first()
    ).subscribe((totals: EpisodeTotals[]) => {
      expect(totals.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have nested data selected episode ranks', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeTotals.selectNestedEpisodesTotals),
      first()
    ).subscribe((totals: EpisodeTotals[]) => {
      expect(totals.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have selected episode table metrics', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeTotals.selectSelectedEpisodesTotalsTableMetrics),
      first()
    ).subscribe((metrics: TotalsTableRow[]) => {
      expect(metrics.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have nested data selected episode table metrics', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeTotals.selectNestedEpisodesTotalsTableMetrics),
      first()
    ).subscribe((metrics: TotalsTableRow[]) => {
      expect(metrics.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have selected episode total downloads', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeTotals.selectSelectedEpisodesTotalsTotalDownloads),
      first()
    ).subscribe((total: number) => {
      expect(total).toBeGreaterThan(0);
      done();
    });
  });

});
