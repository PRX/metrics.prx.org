import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators';

import * as fromGroupCharted from './group-charted.selectors';
import { RootState, reducers } from '..';
import { GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES, GroupCharted } from '../models';
import * as dispatchHelper from '../../../../testing/dispatch.helpers';

describe('Group Charted Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)]
    });
    store = TestBed.inject(Store);

    dispatchHelper.dispatchRouterNavigation(store, { metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME });
  });

  it('should toggle groups charted off', done => {
    dispatchHelper.dispatchGroupChartToggle(store, GROUPTYPE_AGENTNAME, 'Unknown');
    store.pipe(select(fromGroupCharted.selectRoutedGroupCharted), first()).subscribe((groups: GroupCharted[]) => {
      expect(groups.length).toEqual(1);
      expect(groups.find(g => g.groupName === 'Unknown').charted).toBeFalsy();
      done();
    });
  });

  it('should toggle groups charted on', done => {
    dispatchHelper.dispatchGroupChartToggle(store, GROUPTYPE_AGENTNAME, 'Overcast', true);
    store.pipe(select(fromGroupCharted.selectRoutedGroupCharted), first()).subscribe((groups: GroupCharted[]) => {
      expect(groups.length).toEqual(1);
      expect(groups.find(g => g.groupName === 'Overcast').charted).toBeTruthy();
      done();
    });
  });
});
