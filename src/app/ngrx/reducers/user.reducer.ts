import { ActionTypes, AllActions } from '../actions';
import { User } from './models/';

export interface State {
  user: User;
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export const initialState = {
  user: null,
  loaded: false,
  loading: false
};

export function reducer(state: State = initialState, action: AllActions): State {
  switch (action.type) {
    case ActionTypes.ID_USERINFO_LOAD: {
      return {
        ...state,
        user: null,
        loading: true,
        loaded: false
      };
    }
    case ActionTypes.ID_USERINFO_SUCCESS: {
      const { user } = action.payload;
      return {
        ...state,
        user,
        loading: false,
        loaded: true
      };
    }
    case ActionTypes.ID_USERINFO_FAILURE: {
      return {
        ...state,
        error: action.payload.error,
        user: null,
        loading: false,
        loaded: false
      };
    }
  }
  return state;
}

export const getUser = (state: State) =>
  state.user;
export const getUserError = (state: State) => state.error;
