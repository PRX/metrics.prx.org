import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PodcastGroupCharted, Rank } from './models';
import { ActionTypes, AllActions } from '../actions';

export type State = EntityState<PodcastGroupCharted>;

export const adapter: EntityAdapter<PodcastGroupCharted> = createEntityAdapter<PodcastGroupCharted>({
  selectId: ((p: PodcastGroupCharted) => p.key)
});

export const initialState: State = adapter.getInitialState({});

export function reducer(
  state = initialState,
  action: AllActions
): State {
  switch (action.type) {
    case ActionTypes.CHART_TOGGLE_GROUP: {
      const { podcastId, groupName, charted } = action.payload;
      // Note that there will be a breaking change with upsert in Ngrx/entity v6, no longer users Update interface
      // https://github.com/ngrx/platform/commit/a0f45ff035726f106f3f34ddf9b5025c54fc63e0
      return adapter.upsertOne({
        id: `${podcastId}-${groupName}`,
        changes: {
          key: `${podcastId}-${groupName}`, podcastId, groupName, charted
        }
      }, state);
    }

    // when podcast ranks are loaded, add them to state
    // addMany does not overwrite, so this will just initialize the entries
    case ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS: {
      const { id, ranks } = action.payload;
      const groupsCharted = ranks.map((rank: Rank) => {
        return {
          key: `${id}-${rank.label}`,
          podcastId: id,
          groupName: rank.label,
          charted: true
        };
      });
      return adapter.addMany(groupsCharted, state);
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

export const selectPodcastGroupKeys = selectIds;
export const selectPodcastGroupChartedEntities = selectEntities;
export const selectAllPodcastGroupCharted = selectAll;
