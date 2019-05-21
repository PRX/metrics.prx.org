import { reducer, initialState } from './episode-select.reducer';
import * as ACTIONS from '../actions';
import { episodes, routerParams } from '../../../testing/downloads.fixtures';
import { EPISODE_SELECT_PAGE_SIZE, METRICSTYPE_DROPDAY } from './models';

describe('Episode Select Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  it('should hold onto the last search term', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastleEpisodeSelectPageLoadAction({podcastId: '70', page: 1, per: EPISODE_SELECT_PAGE_SIZE, search: 'cool stuff'}));
    expect(newState.search).toEqual('cool stuff');
    newState = reducer(newState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length, episodes}));
    expect(newState.search).toEqual('cool stuff');
  });

  it('saves selected episodes between searches', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastleEpisodeSelectPageLoadAction({podcastId: '70', page: 1, per: EPISODE_SELECT_PAGE_SIZE, search: 'cool'}));
    newState = reducer(newState,
        new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length, episodes}));
    newState = reducer(newState, new ACTIONS.EpisodeSelectEpisodesAction({
      podcastId: '70',
      metricsType: METRICSTYPE_DROPDAY,
      episodeGuids: episodes.map(e => e.guid)
    }));
    expect(newState.dropdaySelected['70']).toEqual(episodes.map(e => e.guid));
    newState = reducer(newState,
      new ACTIONS.CastleEpisodeSelectPageLoadAction({podcastId: '70', page: 1, per: EPISODE_SELECT_PAGE_SIZE, search: 'something else'}));
    newState = reducer(newState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length, episodes}));
    expect(newState.dropdaySelected['70']).toEqual(episodes.map(e => e.guid));
  });

  it('should clear selected if action payload selected array is empty', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastleEpisodeSelectPageLoadAction({podcastId: '70', page: 1, per: EPISODE_SELECT_PAGE_SIZE, search: 'cool'}));
    newState = reducer(newState, new ACTIONS.EpisodeSelectEpisodesAction({
      podcastId: '70',
      metricsType: METRICSTYPE_DROPDAY,
      episodeGuids: []
    }));
    expect(newState.dropdaySelected['70']).toBeNull();
  });

  it('should reset search term and selections when routing to a podcast', () => {
    const newState = reducer(initialState,
      new ACTIONS.RoutePodcastAction({podcastId: '70'}));
    expect(newState.search).toBeNull();
    expect(newState.downloadsSelected['70']).toBeNull();
    expect(newState.dropdaySelected['70']).toBeNull();
    expect(newState.aggregateSelected['70']).toBeNull();
    expect(newState.page).toBeNull();
    expect(newState.total).toBeNull();
  });

  it('should set loading on episode select page load', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodeSelectPageLoadAction({podcastId: '70', page: 1, per: EPISODE_SELECT_PAGE_SIZE}));
    expect(newState.loading).toBeTruthy();
  });

  it('should set episode entities on episode select page success', () => {
    const newState = reducer(initialState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length, episodes}));
    // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
    expect(newState.entities[episodes[0].guid]).toEqual({...episodes[0], id: episodes[0].guid});
    expect(newState.loading).toBeFalsy();
  });

  it('should update an episode entity if it was already on the state', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length, episodes}));
    // @ts-ignore using upsert adds 'id' property to entity, seems like ngrx/entity v6 gets rid of this
    expect(newState.entities[episodes[1].guid]).toEqual({...episodes[1], id: episodes[1].guid});
    newState = reducer(newState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length,
        episodes: [episodes[0], {...episodes[1], title: 'an updated title'}]}));
    expect(newState.entities[episodes[1].guid].title).toEqual('an updated title');
  });

  it('should set error on failure', () => {
    const newState = reducer(initialState, new ACTIONS.CastleEpisodeSelectPageFailureAction({error: 'something went wrong'}));
    expect(newState.error).not.toBeUndefined();
  });

  it('should have total episodes', () => {
    let newState = reducer(initialState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 2, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length, episodes}));
    expect(newState.total).toEqual(episodes.length);
    newState = reducer(newState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: 25, episodes}));
    expect(newState.total).toEqual(25);
  });

  it('should update with toggled episodes', () => {
    // nothing currently selected
    let newState = reducer(initialState,
      new ACTIONS.ChartToggleEpisodeAction({podcastId: episodes[0].podcastId, guid: episodes[0].guid, charted: true}));
    expect(newState.downloadsSelected).toEqual(initialState.downloadsSelected);

    // remove from selected
    newState = reducer(newState,
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: episodes.length, episodes}));
    newState = reducer(newState, new ACTIONS.EpisodeSelectEpisodesAction({
      podcastId: routerParams.podcastId,
      metricsType: routerParams.metricsType,
      episodeGuids: episodes.map(e => e.guid)
    }));
    newState = reducer(newState,
      new ACTIONS.ChartToggleEpisodeAction({podcastId: episodes[0].podcastId, guid: episodes[0].guid, charted: false}));
    expect(newState.downloadsSelected[episodes[0].podcastId]).toEqual(episodes.slice(1).map(e => e.guid));

    // add to selected
    newState = reducer(newState,
      new ACTIONS.ChartToggleEpisodeAction({podcastId: episodes[0].podcastId, guid: 'jklmnop', charted: true}));
    expect(newState.downloadsSelected[episodes[0].podcastId].indexOf('jklmnop')).toBeGreaterThan(-1);
  });
});
