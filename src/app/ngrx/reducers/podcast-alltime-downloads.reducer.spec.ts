import { reducer, initialState } from './podcast-alltime-downloads.reducer';
import * as ACTIONS from '../actions';
import {podcast, podAllTimeDownloadsOff, podAllTimeDownloads} from '../../../testing/downloads.fixtures';

describe('PodcastAllTimeDownloads Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });

    it('should set loading on podcast all time downloads load', () => {
      const newState = reducer(initialState,
        new ACTIONS.CastlePodcastAllTimeDownloadsLoadAction({id: podcast.id}));
      expect(newState.entities[podcast.id].loading).toBeTruthy();
    });

    it('should set podcast downloads entities and loaded on podcast all time downloads success', () => {
      const newState = reducer(initialState,
        new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({
          id: podcast.id,
          total: podAllTimeDownloads.total
        }));
      expect(newState.entities[podcast.id]).toEqual({
        id: podcast.id,
        allTimeDownloads: podAllTimeDownloads.total,
        loading: false,
        loaded: true
      });
    });

    it('should update a podcast downloads entity if it was already on the state', () => {
      let newState = reducer(initialState,
        new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({
          id: podcast.id,
          total: podAllTimeDownloads.total
        }));
      expect(newState.entities[podcast.id]).toEqual({
        id: podcast.id,
        allTimeDownloads: podAllTimeDownloads.total,
        loading: false,
        loaded: true
      });
      newState = reducer(initialState,
        new ACTIONS.CastlePodcastAllTimeDownloadsSuccessAction({
          id: podcast.id,
          total: podAllTimeDownloadsOff.total
        }));
      expect(newState.entities[podcast.id].allTimeDownloads).toEqual(podAllTimeDownloadsOff.total);
    });

    it('should set error on failure', () => {
      const newState = reducer(initialState, new ACTIONS.CastlePodcastAllTimeDownloadsFailureAction({
        id: podcast.id,
        error: 'something went wrong'
      }));
      expect(newState.entities[podcast.id].error).not.toBeUndefined();
    });
  });
});
