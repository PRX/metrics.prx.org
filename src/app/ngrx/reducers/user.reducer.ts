import { createReducer, on } from '@ngrx/store';
import * as idActions from '../actions/id.action.creator';
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

const _reducer = createReducer(
  initialState,
  on(idActions.IdUserinfoLoad, (state, action) => {
    return {
      ...state,
      user: null,
      loading: true,
      loaded: false
    };
  }),
  on(idActions.IdUserinfoSuccess, (state, action) => {
    const { user } = action;
    return {
      ...state,
      user,
      loading: false,
      loaded: true
    };
  }),
  on(idActions.IdUserinfoFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      user: null,
      loading: false,
      loaded: false
    };
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}

export const getUser = (state: State) => state.user;
export const getUserError = (state: State) => state.error;
