import { reducer, initialState } from './episode-alltime-downloads.reducer';
import * as ACTIONS from '../actions';
import { episodes, ep0AllTimeDownloads, ep1AllTimeDownloads, ep1AllTimeDownloadsOff } from '../../../testing/downloads.fixtures';

describe('EpisodeAllTimeDownloads Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });

    it('should set loading on episode all time downloads load', () => {
      const newState = reducer(
        initialState,
        ACTIONS.CastleEpisodeAllTimeDownloadsLoad({ podcastId: episodes[0].podcastId, guid: episodes[0].guid })
      );
      expect(newState.entities[episodes[0].guid].loading).toBeTruthy();
    });

    it('should set episode downloads entities and loaded on episode all time downloads success', () => {
      const newState = reducer(
        initialState,
        ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
          podcastId: episodes[0].podcastId,
          guid: episodes[0].guid,
          total: ep0AllTimeDownloads.total
        })
      );
      expect(newState.entities[episodes[0].guid]).toEqual({
        // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
        id: episodes[0].guid,
        podcastId: episodes[0].podcastId,
        guid: episodes[0].guid,
        allTimeDownloads: ep0AllTimeDownloads.total,
        loading: false,
        loaded: true
      });
    });

    it('should update an episode downloads entity if it was already on the state', () => {
      let newState = reducer(
        initialState,
        ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
          podcastId: episodes[1].podcastId,
          guid: episodes[1].guid,
          total: ep1AllTimeDownloads.total
        })
      );
      expect(newState.entities[episodes[1].guid]).toEqual({
        // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
        id: episodes[1].guid,
        podcastId: episodes[1].podcastId,
        guid: episodes[1].guid,
        allTimeDownloads: ep1AllTimeDownloads.total,
        loading: false,
        loaded: true
      });
      newState = reducer(
        initialState,
        ACTIONS.CastleEpisodeAllTimeDownloadsSuccess({
          podcastId: episodes[1].podcastId,
          guid: episodes[1].guid,
          total: ep1AllTimeDownloadsOff.total
        })
      );
      expect(newState.entities[episodes[1].guid].allTimeDownloads).toEqual(ep1AllTimeDownloadsOff.total);
    });

    it('should set error on failure', () => {
      const newState = reducer(
        initialState,
        ACTIONS.CastleEpisodeAllTimeDownloadsFailure({
          podcastId: episodes[1].podcastId,
          guid: episodes[1].guid,
          error: 'something went wrong'
        })
      );
      expect(newState.entities[episodes[1].guid].error).not.toBeUndefined();
    });
  });
});
