import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

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

  it('should have loading status true if some episode ranks are loading', done => {
    load();
    combineLatest(
      store.pipe(select(fromEpisodeRanks.selectAllEpisodeRanksLoading)),
      store.pipe(select(fromEpisodeRanks.selectSelectedEpisodesRanksLoading)),
      store.pipe(select(fromEpisodeRanks.selectNestedEpisodesRanksLoading))
    ).subscribe(([allEpisodesLoading, selectedEpisodesLoading, nestedEpisodesLoading]) => {
      expect(allEpisodesLoading).toBeTruthy();
      expect(selectedEpisodesLoading).toBeTruthy();
      expect(nestedEpisodesLoading).toBeTruthy();
      done();
    });
  });

  it('should have loaded status true if all episode ranks are loaded', done => {
    load();
    success();
    combineLatest(
      store.pipe(select(fromEpisodeRanks.selectAllEpisodeRanksLoaded)),
      store.pipe(select(fromEpisodeRanks.selectSelectedEpisodesRanksLoaded)),
      store.pipe(select(fromEpisodeRanks.selectNestedEpisodesRanksLoaded))
    ).subscribe(([allEpisodesLoaded, selectedEpisodesLoaded, nestedEpisodesLoaded]) => {
      expect(allEpisodesLoaded).toBeTruthy();
      expect(selectedEpisodesLoaded).toBeTruthy();
      expect(nestedEpisodesLoaded).toBeTruthy();
      done();
    });
  });

  it('should have error if faulure occurs', done => {
    load();
    failure();
    store.pipe(
      select(fromEpisodeRanks.selectAllEpisodeRanksErrors),
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
      select(fromEpisodeRanks.selectSelectedEpisodesRanks),
      first()
    ).subscribe((ranks: EpisodeRanks[]) => {
      expect(ranks.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have nested data selected episode ranks', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeRanks.selectNestedEpisodesRanks),
      first()
    ).subscribe((ranks: EpisodeRanks[]) => {
      expect(ranks.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have selected episode chart metrics', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeRanks.selectSelectedEpisodeRanksChartMetrics),
      first()
    ).subscribe((metrics: TimeseriesChartModel[]) => {
      expect(metrics.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have nested data selected episode chart metrics', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeRanks.selectNestedEpisodesRanksChartMetrics),
      first()
    ).subscribe((metrics: TimeseriesChartModel[]) => {
      expect(metrics.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have selected episode total downloads', done => {
    load();
    success();
    store.pipe(
      select(fromEpisodeRanks.selectSelectedEpisodesRanksTotalDownloads),
      first()
    ).subscribe((total: number) => {
      expect(total).toBeGreaterThan(0);
      done();
    });
  });

});
