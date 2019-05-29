import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { getActions, TestActions } from './test.actions';

import { HalService, MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '@app/core';

import { INTERVAL_DAILY, GROUPTYPE_AGENTNAME } from '../';
import { reducers } from '../reducers';
import * as ACTIONS from '../actions';
import { CastleRanksTotalsEffects } from './castle-ranks-totals.effects';

import {
  routerParams,
  podcast,
  episodes,
  podcastAgentNameRanks,
  podcastAgentNameDownloads,
  ep0AgentNameRanks,
  ep0AgentNameDownloads
} from '@testing/downloads.fixtures';

describe('CastleRanksTotalsEffects', () => {
  let effects: CastleRanksTotalsEffects;
  let actions$: TestActions;
  let castle: MockHalService;

  beforeEach(async(() => {
    castle = new MockHalService();
    castle.root.mock('prx:podcast-ranks', {
      downloads: podcastAgentNameDownloads,
      ranks: podcastAgentNameRanks
    });
    castle.root.mock('prx:podcast-totals', {
      ranks: podcastAgentNameRanks.map(rank => {
        const { total, label, code } = rank;
        return { count: total, label, code };
      })
    });
    castle.root.mockList('prx:episode-ranks', [{
      downloads: ep0AgentNameDownloads,
      ranks: ep0AgentNameRanks
    }]);
    castle.root.mockList('prx:episode-totals', [{
      ranks: ep0AgentNameRanks.map(rank => {
        const { total, label, code } = rank;
        return { count: total, label, code };
      })
    }]);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...reducers }),
        EffectsModule.forRoot([CastleRanksTotalsEffects])
      ],
      providers: [
        CastleRanksTotalsEffects,
        { provide: HalService, useValue: castle },
        { provide: CastleService, useValue: castle.root },
        { provide: Actions, useFactory: getActions }
      ]
    });
    effects = TestBed.get(CastleRanksTotalsEffects);
    actions$ = TestBed.get(Actions);
  }));

  it('should load more than one grouped podcast ranks at a time', () => {
    const action: ACTIONS.CastlePodcastRanksLoadAction = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_RANKS_LOAD,
      payload: {
        podcastId: podcast.id,
        group: GROUPTYPE_AGENTNAME,
        interval: INTERVAL_DAILY,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate,
      }
    };
    const success = new ACTIONS.CastlePodcastRanksSuccessAction({
      podcastId: podcast.id,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks,
      downloads: podcastAgentNameDownloads
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadPodcastRanks$).toBeObservable(expected);
  });

  it('should load more than one grouped podcast totals at a time', () => {
    const action: ACTIONS.CastlePodcastTotalsLoadAction = {
      type: ACTIONS.ActionTypes.CASTLE_PODCAST_TOTALS_LOAD,
      payload: {
        podcastId: podcast.id,
        group: GROUPTYPE_AGENTNAME,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate
      }
    };
    const success = new ACTIONS.CastlePodcastTotalsSuccessAction({
      podcastId: podcast.id,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks.map(rank => {
        const { label, total, code } = rank;
        return { label, total, code };
      })
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadPodcastTotals$).toBeObservable(expected);
  });

  it('should load more than one grouped episode ranks at a time', () => {
    const action: ACTIONS.CastleEpisodeRanksLoadAction = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_RANKS_LOAD,
      payload: {
        guid: episodes[0].guid,
        group: GROUPTYPE_AGENTNAME,
        interval: INTERVAL_DAILY,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate,
      }
    };
    const success = new ACTIONS.CastleEpisodeRanksSuccessAction({
      guid: episodes[0].guid,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: ep0AgentNameRanks,
      downloads: ep0AgentNameDownloads
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadEpisodeRanks$).toBeObservable(expected);
  });

  it('should load more than one grouped episode totals at a time', () => {
    const action: ACTIONS.CastleEpisodeTotalsLoadAction = {
      type: ACTIONS.ActionTypes.CASTLE_EPISODE_TOTALS_LOAD,
      payload: {
        guid: episodes[0].guid,
        group: GROUPTYPE_AGENTNAME,
        beginDate: routerParams.beginDate,
        endDate: routerParams.endDate
      }
    };
    const success = new ACTIONS.CastleEpisodeTotalsSuccessAction({
      guid: episodes[0].guid,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: ep0AgentNameRanks.map(rank => {
        const { label, total, code } = rank;
        return { label, total, code };
      })
    });

    actions$.stream = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadEpisodeTotals$).toBeObservable(expected);
  });
});
