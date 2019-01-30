import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import * as fromGroupCharted from './group-charted.selectors';
import { RootState, reducers } from '..';
import { EpisodeTotals, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, TotalsTableRow, GroupCharted } from '../models';
import * as ACTIONS from '../../actions';
import { routerParams, episodes, ep0AgentNameRanks, ep0AgentNameDownloads } from '../../../../testing/downloads.fixtures';

describe('Group Charted Selectors', () => {
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

    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams: {...routerParams, metricsType, group, filter}}));
    store.dispatch(new ACTIONS.CastleEpisodeRanksSuccessAction({
      guid: episodes[0].guid, group, interval, beginDate, endDate,
      ranks: ep0AgentNameRanks, downloads: ep0AgentNameDownloads}));
  });

  it('should groups charted on initial load', () => {
    store.pipe(select(fromGroupCharted.selectRoutedGroupCharted)).subscribe((groups: GroupCharted[]) => {
      expect(groups.every(g => g.charted)).toBeTruthy();
    });
  });

});
