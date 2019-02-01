import * as ACTIONS from '../actions';
import * as fromUser from './user.reducer';
import { userinfo } from '../../../testing/downloads.fixtures';
import { User } from './models';

describe('User Reducer', () => {

  const user: User = {doc: null, loggedIn: true, authorized: true, userinfo};

  it('starts loading a user', () => {
    const state = fromUser.reducer(fromUser.initialState, new ACTIONS.IdUserinfoLoadAction());
    expect(state.loading).toEqual(true);
    expect(state.loaded).toEqual(false);
    expect(state.user).toEqual(null);
  });

  it('successfully loads a user', () => {
    const state = fromUser.reducer(fromUser.initialState, new ACTIONS.IdUserinfoSuccessAction({user}));
    expect(state.loading).toEqual(false);
    expect(state.loaded).toEqual(true);
    expect(state.user.loggedIn).toBeTruthy();
    expect(state.user.authorized).toBeTruthy();
    expect(fromUser.getUser(state).userinfo).toEqual(userinfo);
  });

  it('fails to load a user', () => {
    const error = 'Something something failed to load';
    const state = fromUser.reducer(fromUser.initialState, new ACTIONS.IdUserinfoFailureAction({error}));
    expect(state.loading).toEqual(false);
    expect(state.loaded).toEqual(false);
    expect(fromUser.getUserError(state)).toEqual(error);
  });

});
