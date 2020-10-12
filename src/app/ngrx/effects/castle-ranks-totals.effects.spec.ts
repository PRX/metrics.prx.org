import { TestBed, async } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { StoreModule, Action } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';

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
  let actions$ = new Observable<Action>();
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
    castle.root.mockList('prx:episode-ranks', [
      {
        downloads: ep0AgentNameDownloads,
        ranks: ep0AgentNameRanks
      }
    ]);
    castle.root.mockList('prx:episode-totals', [
      {
        ranks: ep0AgentNameRanks.map(rank => {
          const { total, label, code } = rank;
          return { count: total, label, code };
        })
      }
    ]);

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ ...reducers }), EffectsModule.forRoot([CastleRanksTotalsEffects])],
      providers: [
        CastleRanksTotalsEffects,
        { provide: HalService, useValue: castle },
        { provide: CastleService, useValue: castle.root },
        provideMockActions(() => actions$)
      ]
    });
    effects = TestBed.inject(CastleRanksTotalsEffects);
  }));

  it('should load more than one grouped podcast ranks at a time', () => {
    const action = ACTIONS.CastlePodcastRanksLoad({
      podcastId: podcast.id,
      group: GROUPTYPE_AGENTNAME,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    });
    const success = ACTIONS.CastlePodcastRanksSuccess({
      podcastId: podcast.id,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: podcastAgentNameRanks,
      downloads: podcastAgentNameDownloads
    });

    actions$ = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadPodcastRanks$).toBeObservable(expected);
  });

  it('should load more than one grouped podcast totals at a time', () => {
    const action = ACTIONS.CastlePodcastTotalsLoad({
      podcastId: podcast.id,
      group: GROUPTYPE_AGENTNAME,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    });
    const success = ACTIONS.CastlePodcastTotalsSuccess({
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

    actions$ = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadPodcastTotals$).toBeObservable(expected);
  });

  it('should load more than one grouped episode ranks at a time', () => {
    const action = ACTIONS.CastleEpisodeRanksLoad({
      guid: episodes[0].guid,
      group: GROUPTYPE_AGENTNAME,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    });
    const success = ACTIONS.CastleEpisodeRanksSuccess({
      guid: episodes[0].guid,
      group: GROUPTYPE_AGENTNAME,
      filter: undefined,
      interval: INTERVAL_DAILY,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate,
      ranks: ep0AgentNameRanks,
      downloads: ep0AgentNameDownloads
    });

    actions$ = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadEpisodeRanks$).toBeObservable(expected);
  });

  it('should load more than one grouped episode totals at a time', () => {
    const action = ACTIONS.CastleEpisodeTotalsLoad({
      guid: episodes[0].guid,
      group: GROUPTYPE_AGENTNAME,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    });
    const success = ACTIONS.CastleEpisodeTotalsSuccess({
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

    actions$ = hot('-ab', { a: action, b: action });
    const expected = cold('-ab', { a: success, b: success });
    expect(effects.loadEpisodeTotals$).toBeObservable(expected);
  });
});
