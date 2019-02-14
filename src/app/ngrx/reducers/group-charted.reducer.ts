import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GroupCharted, Rank } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<GroupCharted>;

export const adapter: EntityAdapter<GroupCharted> = createEntityAdapter<GroupCharted>({
  selectId: ((p: GroupCharted) => p.key)
});

export const initialState: State = adapter.getInitialState({});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CHART_TOGGLE_GROUP: {
      const { group, groupName, charted } = action.payload;
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return adapter.upsertOne({
        id: `${group}-${groupName}`,
        changes: {
          key: `${group}-${groupName}`, group, groupName, charted
        }
      }, state);
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
