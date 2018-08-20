import { reducer, initialState } from './podcast.reducer';
import * as ACTIONS from '../actions';
import { podcast } from '../../../testing/downloads.fixtures';

describe('Podcast Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  it('should set podcast entities on podcast page success', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastlePodcastPageSuccessAction({page: 1, total: 1, all: true, podcasts: [podcast]}));
    expect(newState.entities[podcast.id]).toEqual(podcast);
  });

  it('should update a podcast entity if it was already on the state', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastlePodcastPageSuccessAction({page: 1, total: 1, all: true, podcasts: [podcast]}));
    expect(newState.entities[podcast.id]).toEqual(podcast);
    newState = reducer(initialState,
      new ACTIONS.CastlePodcastPageSuccessAction({page: 1, total: 1, all: true, podcasts: [{...podcast, title: 'an updated title'}]}));
    expect(newState.entities[podcast.id].title).toEqual('an updated title');
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState, new ACTIONS.CastlePodcastPageFailureAction({error: 'something went wrong'}));
    expect(newState.error).not.toBeUndefined();
  });
});
