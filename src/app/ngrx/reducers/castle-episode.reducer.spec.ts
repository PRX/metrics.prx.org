import { reducer, initialState } from './castle-episode.reducer';
import * as ACTIONS from '../actions';
import { episodes } from '../../../testing/downloads.fixtures';

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
      new ACTIONS.CastleEpisodePageLoadAction({podcastId: '70', page: 1}));
    expect(newState.pagesLoading.indexOf(1)).not.toBe(-1);
  });

  it('should set episode entities and pagesLoaded on episode page success', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodePageSuccessAction({page: 1, total: episodes.length, all: true, episodes}));
    expect(newState.entities[episodes[0].guid]).toEqual(episodes[0]);
    expect(newState.pagesLoaded.indexOf(1)).not.toBe(-1);
    expect(newState.pagesLoading.indexOf(1)).toBe(-1);
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState, new ACTIONS.CastleEpisodePageFailureAction({error: 'something went wrong'}));
    expect(newState.error).not.toBeUndefined();
  });
});
