import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromGroupCharted from '../group-charted.reducer';
import { selectGroupRoute } from './router.selectors';
import { GroupCharted } from '../models';

export const selectGroupChartedState = createFeatureSelector<fromGroupCharted.State>('groupCharted');

export const selectGroupChartedIds = createSelector(
  selectGroupChartedState,
  fromGroupCharted.selectGroupKeys
);
export const selectGroupChartedEntities = createSelector(
  selectGroupChartedState,
  fromGroupCharted.selectGroupChartedEntities
);
export const selectAllGroupCharted = createSelector(
  selectGroupChartedState,
  fromGroupCharted.selectAllGroupCharted
);

export const selectRoutedGroupCharted = createSelector(
  selectGroupRoute,
  selectAllGroupCharted,
  (group: string, groupsCharted: GroupCharted[]) => {
    return groupsCharted && groupsCharted.filter(g => g.group === group);
  }
);
