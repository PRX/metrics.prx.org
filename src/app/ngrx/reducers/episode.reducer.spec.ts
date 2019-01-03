import { reducer, initialState } from './episode.reducer';
import * as ACTIONS from '../actions';
import { episodes } from '../../../testing/downloads.fixtures';
import { EPISODE_PAGE_SIZE } from './models';

describe('Episode Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should reset pages loading and loaded when routing to a podcast', () => {
    const newState = reducer(initialState,
      new ACTIONS.RoutePodcastAction({podcastId: '70'}));
    expect(newState.pagesLoaded.length).toEqual(0);
    expect(newState.pagesLoading.length).toEqual(0);
  });

  it('should set pagesLoading on episode page load', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodePageLoadAction({podcastId: '70', page: 1, per: EPISODE_PAGE_SIZE}));
    expect(newState.pagesLoading.indexOf(1)).not.toBe(-1);
  });

  it('should set episode entities and pagesLoaded on episode page success', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodePageSuccessAction({page: 1, per: EPISODE_PAGE_SIZE, total: episodes.length, episodes}));
    // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
    expect(newState.entities[episodes[0].guid]).toEqual({...episodes[0], id: episodes[0].guid});
    expect(newState.pagesLoaded.indexOf(1)).not.toBe(-1);
    expect(newState.pagesLoading.indexOf(1)).toBe(-1);
  });

  it('should update an episode entity if it was already on the state', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastleEpisodePageSuccessAction({page: 1, per: EPISODE_PAGE_SIZE, total: episodes.length, episodes}));
    // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
    expect(newState.entities[episodes[1].guid]).toEqual({...episodes[1], id: episodes[1].guid});
    newState = reducer(initialState,
      new ACTIONS.CastleEpisodePageSuccessAction({page: 1, per: EPISODE_PAGE_SIZE, total: episodes.length,
        episodes: [episodes[0], {...episodes[1], title: 'an updated title'}]}));
    expect(newState.entities[episodes[1].guid].title).toEqual('an updated title');
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState, new ACTIONS.CastleEpisodePageFailureAction({error: 'something went wrong'}));
    expect(newState.error).not.toBeUndefined();
  });

  it('should update total episodes on page 1 or on initial load', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastleEpisodePageSuccessAction({page: 2, per: EPISODE_PAGE_SIZE, total: episodes.length, episodes}));
    expect(newState.total).toEqual(episodes.length);
    newState = reducer(newState,
      new ACTIONS.CastleEpisodePageSuccessAction({page: 1, per: EPISODE_PAGE_SIZE, total: 25, episodes}));
    expect(newState.total).toEqual(25);
    newState = reducer(newState,
      new ACTIONS.CastleEpisodePageSuccessAction({page: 2, per: EPISODE_PAGE_SIZE, total: episodes.length, episodes}));
    expect(newState.total).toEqual(25);
  });
});
