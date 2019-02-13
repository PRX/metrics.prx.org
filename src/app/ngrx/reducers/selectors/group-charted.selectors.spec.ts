import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators/first';

import * as fromGroupCharted from './group-charted.selectors';
import { RootState, reducers } from '..';
import { GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, GroupCharted } from '../models';
import * as ACTIONS from '../../actions';
import * as dispatchHelpers from '../../../../testing/dispatch.helpers';

describe('Group Charted Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);

    dispatchHelpers.dispatchRouterNavigation(store, {metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME});
  });

  it('should have just the toggled groups charted status', () => {
    store.dispatch(new ACTIONS.ChartToggleGroupAction({group: GROUPTYPE_AGENTNAME, groupName: 'Unknown', charted: false}));
    store.pipe(select(fromGroupCharted.selectRoutedGroupCharted), first()).subscribe((groups: GroupCharted[]) => {
      expect(groups.length).toEqual(1);
      expect(groups.find(g => g.groupName === 'Unknown').charted).toBeFalsy();
    });

    store.dispatch(new ACTIONS.ChartToggleGroupAction({group: GROUPTYPE_AGENTNAME, groupName: 'Overcast', charted: true}));
    store.pipe(select(fromGroupCharted.selectRoutedGroupCharted), first()).subscribe((groups: GroupCharted[]) => {
      expect(groups.length).toEqual(2);
      expect(groups.find(g => g.groupName === 'Overcast').charted).toBeTruthy();
    });
  });

});
