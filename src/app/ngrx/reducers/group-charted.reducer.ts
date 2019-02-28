import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GroupCharted } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<GroupCharted>;

export const adapter: EntityAdapter<GroupCharted> = createEntityAdapter<GroupCharted>();

export const initialState: State = adapter.getInitialState({});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CHART_TOGGLE_GROUP: {
      const { group, groupName, charted } = action.payload;
      return adapter.upsertOne({id: `${group}-${groupName}`, group, groupName, charted}, state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
} = adapter.getSelectors();

export const selectGroupKeys = selectIds;
export const selectGroupChartedEntities = selectEntities;
export const selectAllGroupCharted = selectAll;
