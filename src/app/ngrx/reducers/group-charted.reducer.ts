import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { GroupCharted } from './models';
import * as chartActions from '../actions/chart-toggle.action.creator';

export type State = EntityState<GroupCharted>;

export const adapter: EntityAdapter<GroupCharted> = createEntityAdapter<GroupCharted>();

export const initialState: State = adapter.getInitialState({});

const _reducer = createReducer(
  initialState,
  on(chartActions.ChartToggleGroup, (state, action) => {
    const { group, groupName, charted } = action;
    return adapter.upsertOne({ id: `${group}-${groupName}`, group, groupName, charted }, state);
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}

export const {
  selectIds: selectGroupIds,
  selectEntities: selectGroupChartedEntities,
  selectAll: selectAllGroupCharted
} = adapter.getSelectors();
